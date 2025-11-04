import { createContext, useContext, useState, ReactNode } from "react";

type Language = "english" | "marathi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Header
    reportComplaints: "Report Complaints",
    viewDashboard: "View Dashboard",
    aboutBMC: "About BMC",
    marathi: "Marathi",
    visuallyChallenged: "Visually Challenged",
    support: "Support",
    login: "Login",
    getStarted: "Get Started",
    
    // Hero Section
    heroTitle: "Your Voice, Your City",
    heroSubtitle: "Report civic issues directly to BMC and track their resolution in real-time",
    fileComplaint: "File a Complaint",
    
    // Features
    featuresTitle: "Why Choose CivicMind?",
    quickReportingTitle: "Quick Reporting",
    quickReportingDesc: "Submit complaints in under 2 minutes with our streamlined process",
    realTimeTrackingTitle: "Real-time Tracking",
    realTimeTrackingDesc: "Monitor the status of your complaint from submission to resolution",
    transparentSystemTitle: "Transparent System",
    transparentSystemDesc: "Public visibility of all complaints ensures accountability",
    
    // Stats
    activeComplaints: "Active Complaints",
    resolvedIssues: "Resolved Issues",
    avgResponseTime: "Avg Response Time",
    hours: "hours",
    
    // CTA
    ctaTitle: "Ready to Make a Difference?",
    ctaSubtitle: "Join thousands of citizens making Mumbai better, one complaint at a time",
    startNow: "Start Now",
    
    // Footer
    footerTagline: "Making civic engagement accessible to everyone",
    quickLinks: "Quick Links",
    home: "Home",
    about: "About",
    contact: "Contact",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "All rights reserved.",
    
    // Index Page Hero
    aiPoweredSolutions: "AI-Powered Civic Solutions",
    reportCivicIssues: "Report Civic Issues,",
    createChange: "Create Change",
    heroDescription: "CivicMind uses AI to automatically classify and route your complaints to the right authorities. Get real-time updates and make your city better.",
    reportIssueCitizen: "Report Issue (Citizen)",
    authorityPortal: "Authority Portal",
    
    // How It Works
    howItWorks: "How It Works",
    howItWorksSubtitle: "Simple, fast, and effective civic complaint management",
    step1Title: "1. Upload",
    step1Desc: "Take a photo and describe the civic issue in your area",
    step2Title: "2. AI Categorizes",
    step2Desc: "Our AI automatically classifies and prioritizes your complaint",
    step3Title: "3. Authority Notified",
    step3Desc: "Relevant authorities receive instant notification with all details",
    step4Title: "4. Get Updates",
    step4Desc: "Track progress and get notified when your issue is resolved",
    
    // Stats
    activeCitizens: "Active Citizens",
    issuesResolved: "Issues Resolved",
    citiesCovered: "Cities Covered",
    
    // CTA Bottom
    readyToMakeDifference: "Ready to Make a Difference?",
    joinThousands: "Join thousands of citizens who are making their communities better, one report at a time.",
    getStartedFree: "Get Started Free",
    signIn: "Sign In",
    
    // Footer
    makingCitiesSmarter: "Making cities smarter, one complaint at a time.",
    product: "Product",
    browseComplaints: "Browse Complaints",
    reportIssue: "Report Issue",
    dashboard: "Dashboard",
    company: "Company",
    aboutUs: "About Us",
    
    // Complaints Page
    complaintsTitle: "Complaint Categories",
    complaintsSubtitle: "Select a category to report your civic issue",
    reportComplaintBtn: "Report Complaint",
    roadsTransportTitle: "Roads & Transportation",
    roadsTransportDesc: "Report issues related to roads, traffic, and transportation infrastructure",
    roadsTransportSub1: "Potholes",
    roadsTransportSub2: "Broken footpaths",
    roadsTransportSub3: "Waterlogging",
    roadsTransportSub4: "Damaged manholes",
    roadsTransportSub5: "Traffic signal not working",
    roadsTransportSub6: "Illegal parking",
    roadsTransportSub7: "Poor road signage",
    garbageSanitationTitle: "Garbage & Sanitation",
    garbageSanitationDesc: "Report waste management and sanitation issues",
    garbageSanitationSub1: "Overflowing bins",
    garbageSanitationSub2: "Uncollected waste",
    garbageSanitationSub3: "Open drains",
    garbageSanitationSub4: "Lack of dustbins",
    garbageSanitationSub5: "Dead animal removal",
    garbageSanitationSub6: "Public toilet cleanliness",
    waterDrainageTitle: "Water Supply & Drainage",
    waterDrainageDesc: "Report water supply problems and drainage issues",
    waterDrainageSub1: "Water leakage",
    waterDrainageSub2: "Irregular water supply",
    waterDrainageSub3: "Blocked drainage",
    waterDrainageSub4: "Stagnant water",
    waterDrainageSub5: "Muddy water supply",
    electricityLightingTitle: "Electricity & Street Lighting",
    electricityLightingDesc: "Report electrical and street lighting problems",
    electricityLightingSub1: "Streetlight not working",
    electricityLightingSub2: "Exposed wires",
    electricityLightingSub3: "Transformer issues",
    electricityLightingSub4: "Dimly lit streets",
    publicSafetyTitle: "Public Safety & Encroachments",
    publicSafetyDesc: "Report safety hazards and illegal encroachments",
    publicSafetySub1: "Illegal hawkers",
    publicSafetySub2: "Construction debris",
    publicSafetySub3: "Noise pollution",
    publicSafetySub4: "Stray animals",
    publicSafetySub5: "Open manholes",
    publicSafetySub6: "Unauthorized structures",
  },
  marathi: {
    // Header
    reportComplaints: "तक्रार नोंदवा",
    viewDashboard: "डॅशबोर्ड पहा",
    aboutBMC: "BMC बद्दल",
    marathi: "मराठी",
    visuallyChallenged: "दृष्टिहीन",
    support: "मदत",
    login: "लॉगिन",
    getStarted: "सुरू करा",
    
    // Hero Section
    heroTitle: "तुमचा आवाज, तुमचे शहर",
    heroSubtitle: "नागरी समस्या थेट BMC ला नोंदवा आणि त्यांचे निराकरण रिअल-टाइममध्ये ट्रॅक करा",
    fileComplaint: "तक्रार नोंदवा",
    
    // Features
    featuresTitle: "CivicMind का निवडावे?",
    quickReportingTitle: "जलद अहवाल",
    quickReportingDesc: "आमच्या सुव्यवस्थित प्रक्रियेसह 2 मिनिटांपेक्षा कमी वेळात तक्रार सबमिट करा",
    realTimeTrackingTitle: "रिअल-टाइम ट्रॅकिंग",
    realTimeTrackingDesc: "सबमिशनपासून निराकरणापर्यंत तुमच्या तक्रारीच्या स्थितीचे निरीक्षण करा",
    transparentSystemTitle: "पारदर्शक प्रणाली",
    transparentSystemDesc: "सर्व तक्रारींची सार्वजनिक दृश्यता जबाबदारी सुनिश्चित करते",
    
    // Stats
    activeComplaints: "सक्रिय तक्रारी",
    resolvedIssues: "निराकरण केलेल्या समस्या",
    avgResponseTime: "सरासरी प्रतिसाद वेळ",
    hours: "तास",
    
    // CTA
    ctaTitle: "फरक करण्यासाठी तयार आहात?",
    ctaSubtitle: "मुंबईला चांगले बनवणाऱ्या हजारो नागरिकांमध्ये सामील व्हा, एका वेळी एक तक्रार",
    startNow: "आता सुरू करा",
    
    // Footer
    footerTagline: "नागरी सहभाग प्रत्येकासाठी सुलभ करणे",
    quickLinks: "द्रुत दुवे",
    home: "मुख्यपृष्ठ",
    about: "बद्दल",
    contact: "संपर्क",
    legal: "कायदेशीर",
    privacyPolicy: "गोपनीयता धोरण",
    termsOfService: "सेवा अटी",
    allRightsReserved: "सर्व हक्क राखीव.",
    
    // Index Page Hero
    aiPoweredSolutions: "AI-संचालित नागरी उपाय",
    reportCivicIssues: "नागरी समस्या नोंदवा,",
    createChange: "बदल करा",
    heroDescription: "CivicMind तुमच्या तक्रारी योग्य अधिकाऱ्यांना स्वयंचलितपणे वर्गीकृत आणि पाठवण्यासाठी AI वापरते. रिअल-टाइम अपडेट्स मिळवा आणि तुमचे शहर चांगले करा.",
    reportIssueCitizen: "समस्या नोंदवा (नागरिक)",
    authorityPortal: "प्राधिकरण पोर्टल",
    
    // How It Works
    howItWorks: "हे कसे कार्य करते",
    howItWorksSubtitle: "साधे, जलद आणि प्रभावी नागरी तक्रार व्यवस्थापन",
    step1Title: "1. अपलोड करा",
    step1Desc: "फोटो घ्या आणि तुमच्या क्षेत्रातील नागरी समस्येचे वर्णन करा",
    step2Title: "2. AI वर्गीकरण करते",
    step2Desc: "आमचा AI तुमची तक्रार स्वयंचलितपणे वर्गीकृत आणि प्राधान्यीकृत करतो",
    step3Title: "3. प्राधिकरणाला सूचित केले",
    step3Desc: "संबंधित अधिकाऱ्यांना सर्व तपशीलांसह त्वरित सूचना मिळते",
    step4Title: "4. अपडेट्स मिळवा",
    step4Desc: "प्रगती ट्रॅक करा आणि तुमची समस्या सोडवली जाते तेव्हा सूचित व्हा",
    
    // Stats
    activeCitizens: "सक्रिय नागरिक",
    issuesResolved: "निराकरण केलेल्या समस्या",
    citiesCovered: "कव्हर केलेली शहरे",
    
    // CTA Bottom
    readyToMakeDifference: "फरक करण्यासाठी तयार आहात?",
    joinThousands: "हजारो नागरिकांमध्ये सामील व्हा जे त्यांचे समुदाय चांगले बनवत आहेत, एका वेळी एक अहवाल.",
    getStartedFree: "विनामूल्य सुरू करा",
    signIn: "साइन इन करा",
    
    // Footer
    makingCitiesSmarter: "शहरे स्मार्ट बनवणे, एका वेळी एक तक्रार.",
    product: "उत्पादन",
    browseComplaints: "तक्रारी ब्राउज करा",
    reportIssue: "समस्या नोंदवा",
    dashboard: "डॅशबोर्ड",
    company: "कंपनी",
    aboutUs: "आमच्याबद्दल",
    
    // Complaints Page
    complaintsTitle: "तक्रार श्रेणी",
    complaintsSubtitle: "तुमची नागरी समस्या नोंदवण्यासाठी एक श्रेणी निवडा",
    reportComplaintBtn: "तक्रार नोंदवा",
    roadsTransportTitle: "रस्ते आणि वाहतूक",
    roadsTransportDesc: "रस्ते, वाहतूक आणि वाहतूक पायाभूत सुविधांशी संबंधित समस्या नोंदवा",
    roadsTransportSub1: "खड्डे",
    roadsTransportSub2: "तुटलेले फूटपाथ",
    roadsTransportSub3: "पाणीसाठा",
    roadsTransportSub4: "खराब मॅनहोल",
    roadsTransportSub5: "वाहतूक सिग्नल काम करत नाही",
    roadsTransportSub6: "अवैध पार्किंग",
    roadsTransportSub7: "खराब रस्ता चिन्हे",
    garbageSanitationTitle: "कचरा आणि स्वच्छता",
    garbageSanitationDesc: "कचरा व्यवस्थापन आणि स्वच्छता समस्या नोंदवा",
    garbageSanitationSub1: "ओव्हरफ्लो डब्बे",
    garbageSanitationSub2: "गोळा न केलेला कचरा",
    garbageSanitationSub3: "मोकळे नाले",
    garbageSanitationSub4: "डस्टबिन नसणे",
    garbageSanitationSub5: "मृत प्राणी काढणे",
    garbageSanitationSub6: "सार्वजनिक शौचालय स्वच्छता",
    waterDrainageTitle: "पाणी पुरवठा आणि निचरा",
    waterDrainageDesc: "पाणी पुरवठा समस्या आणि निचरा समस्या नोंदवा",
    waterDrainageSub1: "पाणी गळती",
    waterDrainageSub2: "अनियमित पाणी पुरवठा",
    waterDrainageSub3: "अवरोधित निचरा",
    waterDrainageSub4: "साठलेले पाणी",
    waterDrainageSub5: "चिखलमय पाणी पुरवठा",
    electricityLightingTitle: "वीज आणि रस्त्याचा दिवा",
    electricityLightingDesc: "विद्युत आणि रस्त्याच्या प्रकाशाच्या समस्या नोंदवा",
    electricityLightingSub1: "रस्त्याचा दिवा काम करत नाही",
    electricityLightingSub2: "उघडी तारा",
    electricityLightingSub3: "ट्रान्सफॉर्मर समस्या",
    electricityLightingSub4: "अंधुक रस्ते",
    publicSafetyTitle: "सार्वजनिक सुरक्षा आणि अतिक्रमण",
    publicSafetyDesc: "सुरक्षा धोके आणि बेकायदेशीर अतिक्रमण नोंदवा",
    publicSafetySub1: "बेकायदेशीर फेरीवाले",
    publicSafetySub2: "बांधकाम मलबा",
    publicSafetySub3: "ध्वनी प्रदूषण",
    publicSafetySub4: "भटक्या प्राणी",
    publicSafetySub5: "मोकळे मॅनहोल",
    publicSafetySub6: "अनधिकृत संरचना",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("english");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};