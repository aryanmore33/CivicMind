const { HfInference } = require("@huggingface/inference");
const categoryModel = require('../models/categoryModels');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * ✅ HUGGING FACE ZERO-SHOT CLASSIFICATION
 * Free, reliable, understands context
 */
const detectCategoriesWithAI = async (title, description) => {
  try {
    const complaintText = `${title} ${description}`;
    console.log(`\n🤖 HUGGING FACE CLASSIFICATION`);
    console.log(`📝 Input: "${complaintText}"`);

    // Candidate labels (civic complaint types)
    const candidateLabels = [
      "Pothole and road damage",
      "Garbage and waste",
      "Street light issue",
      "Water leakage",
      "Drainage problem",
      "Animal control",
      "Public safety",
      "Noise pollution",
      "Tree maintenance",
      "Other civic issue"
    ];

    console.log('🔄 Calling Hugging Face API...');

    const result = await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: complaintText,
      candidate_labels: candidateLabels,
      multi_class: true
    });

    console.log(`✅ Results:`, result.scores.map((s, i) => 
      `${result.labels[i]}(${(s*100).toFixed(1)}%)`
    ).join(', '));

    // Get top 3 with score > 0.5
    const topCategories = result.labels
      .map((label, i) => ({ label, score: result.scores[i] }))
      .filter(item => item.score > 0.3)
      .slice(0, 3)
      .map(item => item.label.split(' and ')[0]); // Extract main category

    console.log(`🎯 Top categories: ${topCategories.join(', ')}`);

    if (topCategories.length === 0) {
      topCategories.push('Other civic issue');
    }

    // Link to database
    const categoryResults = [];
    for (const categoryName of topCategories) {
      let category = await categoryModel.getCategoryByName(categoryName);

      if (!category) {
        console.log(`✨ Creating: "${categoryName}"`);
        category = await categoryModel.createCategory(categoryName);
      }

      categoryResults.push({
        category_id: category.category_id,
        category_name: category.name,
        is_new: !await categoryModel.getAllCategories()
          .then(cats => cats.some(c => c.category_id === category.category_id))
      });
    }

    console.log(`✅ SUCCESS\n`);
    return categoryResults;

  } catch (error) {
    console.error(`❌ HF Error: ${error.message}`);
    console.log(`⚠️  Using keyword matching\n`);
    
    return await keywordBasedClassification(title, description);
  }
};

/**
 * Fallback: Keyword matching
 */
const keywordBasedClassification = async (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  const patterns = {
    'Pothole': ['pothole', 'hole', 'pit', 'crack'],
    'Garbage': ['garbage', 'trash', 'waste', 'litter'],
    'Street Light': ['light', 'lamp', 'bulb', 'dark'],
    'Water Leakage': ['water', 'leak', 'pipe', 'burst'],
    'Animal Control': ['dog', 'cat', 'stray', 'animal'],
    'Other civic issue': []
  };

  let scores = {};
  for (const [cat, kws] of Object.entries(patterns)) {
    scores[cat] = kws.filter(kw => text.includes(kw)).length;
  }

  const categoryName = Object.entries(scores)
    .filter(([_, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other civic issue';

  console.log(`🔍 Keyword: ${categoryName}`);

  let category = await categoryModel.getCategoryByName(categoryName);
  if (!category) {
    category = await categoryModel.createCategory(categoryName);
  }

  return [{
    category_id: category.category_id,
    category_name: category.name,
    is_new: true
  }];
};

module.exports = { detectCategoriesWithAI };
