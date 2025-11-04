const { GoogleGenerativeAI } = require("@google/generative-ai");
const categoryModel = require('../models/categoryModels');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * ✅ SMART AI CLASSIFICATION - GEMINI (Understands context, synonyms, complex text)
 */
const detectCategoriesWithAI = async (title, description) => {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const complaintText = `Title: "${title}" | Description: "${description}"`;
    console.log(`\n🤖 GEMINI AI CLASSIFICATION`);
    console.log(`📝 Input: ${complaintText}`);

    // Get existing categories for context
    const existingCategories = await categoryModel.getAllCategories();
    const categoryList = existingCategories.map(c => c.name).join(', ') || 'Pothole, Garbage, Street Light, Water Leakage, Drainage, Road Damage, Animal Control, Public Safety, Noise Pollution, Tree Maintenance';

    // Smart prompt that understands synonyms and context
    const prompt = `You are an AI that understands civic complaints. Your job is to classify complaints intelligently.

INSTRUCTION: Read the complaint carefully. Understand what the person is reporting even if they use different words.

AVAILABLE CATEGORIES: ${categoryList}

COMPLAINT:
${complaintText}

RULES:
1. Understand the MEANING - If someone says "huge pit", it's a Pothole
2. Handle SYNONYMS - "rubbish" = Garbage, "stray dogs" = Animal Control, "broken bulb" = Street Light
3. Return 1-3 most relevant categories only
4. Return ONLY category names separated by commas
5. Be smart about context

EXAMPLES:
- "huge pit on road" → Pothole
- "rubbish piling up" → Garbage
- "broken electric pole light" → Street Light
- "water overflowing from burst pipe" → Water Leakage, Drainage
- "dogs roaming streets" → Animal Control
- "loud construction noise" → Noise Pollution, Road Damage

NOW analyze and classify the above complaint. Return ONLY category names:`;

    console.log('🔄 Calling Gemini API (gemini-1.5-flash)...');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.2, // Low temperature for consistent results
        maxOutputTokens: 100,
      }
    });

    // Call Gemini with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('API Timeout (>10s)')), 10000)
    );

    const apiCall = model.generateContent(prompt);
    const result = await Promise.race([apiCall, timeoutPromise]);

    const response = await result.response;
    const aiResponse = response.text().trim();

    console.log(`✅ Gemini Response: "${aiResponse}"`);

    // Parse response
    if (!aiResponse || aiResponse.length === 0) {
      throw new Error('Empty response from Gemini');
    }

    const detectedCategoryNames = aiResponse
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .slice(0, 3);

    console.log(`🎯 Parsed categories: ${detectedCategoryNames.join(', ')}`);

    if (detectedCategoryNames.length === 0) {
      throw new Error('No categories parsed');
    }

    // Link to database
    const categoryResults = [];
    for (const categoryName of detectedCategoryNames) {
      let category = await categoryModel.getCategoryByName(categoryName);

      if (!category) {
        console.log(`✨ Creating: "${categoryName}"`);
        category = await categoryModel.createCategory(categoryName);
      }

      categoryResults.push({
        category_id: category.category_id,
        category_name: category.name,
        is_new: !existingCategories.some(c => c.category_id === category.category_id)
      });
    }

    console.log(`✅ SUCCESS: ${categoryResults.length} categories assigned\n`);
    return categoryResults;

  } catch (error) {
    console.error(`\n❌ GEMINI AI ERROR: ${error.message}`);
    console.error(`Error Type: ${error.constructor.name}`);
    console.error(`Full Error:`, error);
    console.log(`⚠️  FALLING BACK TO KEYWORD MATCHING\n`);
    
    // Fallback to keyword classifier
    return await keywordBasedClassification(title, description);
  }
};

/**
 * Fallback: Basic keyword classification when AI fails
 */
const keywordBasedClassification = async (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  const patterns = {
    'Pothole': ['pothole', 'hole', 'pit', 'pavement', 'crack', 'uneven'],
    'Garbage': ['garbage', 'trash', 'waste', 'litter', 'rubbish'],
    'Street Light': ['light', 'lamp', 'bulb', 'dark', 'lighting'],
    'Water Leakage': ['water', 'leak', 'pipe', 'burst', 'overflow'],
    'Animal Control': ['dog', 'cat', 'stray', 'animal'],
    'Others': ['issue', 'problem', 'complaint']
  };

  let scores = {};
  for (const [cat, kws] of Object.entries(patterns)) {
    scores[cat] = kws.filter(kw => text.includes(kw)).length;
  }

  const top = Object.entries(scores)
    .filter(([_, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])[0];

  const categoryName = top ? top[0] : 'Others';
  console.log(`🔍 Keyword Match: ${categoryName}`);

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
