import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type LangCode = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "pa" | "kn" | "ml" | "or" | "ur";

export interface Language {
  code: LangCode;
  name: string;        // English name
  native: string;      // Name in that language
  flag: string;        // Emoji flag
  dir: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English",    native: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "hi", name: "Hindi",      native: "हिन्दी",       flag: "🇮🇳", dir: "ltr" },
  { code: "bn", name: "Bengali",    native: "বাংলা",        flag: "🇧🇩", dir: "ltr" },
  { code: "ta", name: "Tamil",      native: "தமிழ்",        flag: "🇮🇳", dir: "ltr" },
  { code: "te", name: "Telugu",     native: "తెలుగు",       flag: "🇮🇳", dir: "ltr" },
  { code: "mr", name: "Marathi",    native: "मराठी",        flag: "🇮🇳", dir: "ltr" },
  { code: "gu", name: "Gujarati",   native: "ગુજરાતી",      flag: "🇮🇳", dir: "ltr" },
  { code: "pa", name: "Punjabi",    native: "ਪੰਜਾਬੀ",       flag: "🇮🇳", dir: "ltr" },
  { code: "kn", name: "Kannada",    native: "ಕನ್ನಡ",        flag: "🇮🇳", dir: "ltr" },
  { code: "ml", name: "Malayalam",  native: "മലയാളം",       flag: "🇮🇳", dir: "ltr" },
  { code: "or", name: "Odia",       native: "ଓଡ଼ିଆ",        flag: "🇮🇳", dir: "ltr" },
  { code: "ur", name: "Urdu",       native: "اردو",         flag: "🇵🇰", dir: "rtl" },
];

// ── All UI string translations ─────────────────────────────────────────────
export type TranslationKey =
  | "home" | "latestJobs" | "admitCards" | "results" | "search"
  | "bookmarks" | "profile" | "login" | "register" | "logout"
  | "admin" | "viewAll" | "latestJobsTitle" | "latestJobsDesc"
  | "latestAdmitCards" | "latestAdmitCardsDesc" | "latestResults" | "latestResultsDesc"
  | "topOrganizations" | "popularCategories" | "closingSoon"
  | "heroTitle" | "heroSubtitle" | "refreshed" | "searchPlaceholder"
  | "admitCardsTitle" | "admitCardsDesc" | "resultsTitle" | "resultsDesc"
  | "allCategories" | "found" | "previous" | "next" | "pageOf"
  | "downloadAdmitCard" | "viewResult" | "fullDetails" | "noDataYet"
  | "organization" | "lastDate" | "vacancies" | "ageLimit"
  | "importantDates" | "applicationFee" | "importantLinks" | "howToFill"
  | "selectionProcess" | "applyOnline" | "downloadNotification"
  | "saveJob" | "saved" | "share" | "exportPdf" | "jobNotFound"
  | "browseAllJobs" | "government" | "banking" | "railway" | "defence"
  | "medical" | "teaching" | "engineering" | "psu" | "research";

type Translations = Record<TranslationKey, string>;
type AllTranslations = Record<LangCode, Translations>;

export const TRANSLATIONS: AllTranslations = {
  en: {
    home:"Home", latestJobs:"Latest Jobs", admitCards:"Admit Cards", results:"Results",
    search:"Search", bookmarks:"Bookmarks", profile:"Profile", login:"Login",
    register:"Register", logout:"Log out", admin:"Admin", viewAll:"View all",
    latestJobsTitle:"Latest Jobs", latestJobsDesc:"Freshly published recruitment notices.",
    latestAdmitCards:"Latest Admit Cards", latestAdmitCardsDesc:"Download hall tickets and call letters.",
    latestResults:"Latest Results", latestResultsDesc:"Check declared exam results and merit lists.",
    topOrganizations:"Top Organizations", popularCategories:"Popular Categories",
    closingSoon:"Closing Soon",
    heroTitle:"Jobs, Admit Cards & Results — all in one place.",
    heroSubtitle:"SSC, UPSC, Railways, banking, defence, PSUs and medical recruitment.",
    refreshed:"Notifications refreshed every 6 hours",
    searchPlaceholder:"Search jobs, organizations, exams…",
    admitCardsTitle:"Admit Cards & Hall Tickets", admitCardsDesc:"Download the latest government exam admit cards — updated daily.",
    resultsTitle:"Exam Results", resultsDesc:"Check latest government exam results, merit lists and selection lists.",
    allCategories:"All Categories", found:"found", previous:"Previous", next:"Next", pageOf:"Page {p} of {t}",
    downloadAdmitCard:"Download Admit Card", viewResult:"View Result", fullDetails:"Full Details",
    noDataYet:"No data yet — run a scraper.", organization:"Organization", lastDate:"Last Date",
    vacancies:"Vacancies", ageLimit:"Age Limit", importantDates:"Important Dates",
    applicationFee:"Application Fee", importantLinks:"Important Links", howToFill:"How to Fill the Form",
    selectionProcess:"Selection Process", applyOnline:"Apply Online",
    downloadNotification:"Download Notification", saveJob:"Bookmark", saved:"Saved",
    share:"Share", exportPdf:"PDF", jobNotFound:"Job not found", browseAllJobs:"Browse all jobs",
    government:"Central Government", banking:"Banking", railway:"Railway", defence:"Defence",
    medical:"Medical", teaching:"Teaching", engineering:"Engineering", psu:"PSU", research:"Research",
  },
  hi: {
    home:"होम", latestJobs:"नवीनतम नौकरियाँ", admitCards:"प्रवेश पत्र", results:"परिणाम",
    search:"खोजें", bookmarks:"बुकमार्क", profile:"प्रोफाइल", login:"लॉगिन",
    register:"रजिस्टर", logout:"लॉग आउट", admin:"एडमिन", viewAll:"सभी देखें",
    latestJobsTitle:"नवीनतम नौकरियाँ", latestJobsDesc:"ताजा प्रकाशित भर्ती सूचनाएं।",
    latestAdmitCards:"नवीनतम प्रवेश पत्र", latestAdmitCardsDesc:"हॉल टिकट और कॉल लेटर डाउनलोड करें।",
    latestResults:"नवीनतम परिणाम", latestResultsDesc:"घोषित परीक्षा परिणाम और मेरिट सूची देखें।",
    topOrganizations:"शीर्ष संगठन", popularCategories:"लोकप्रिय श्रेणियाँ",
    closingSoon:"जल्द बंद होने वाली",
    heroTitle:"नौकरियाँ, प्रवेश पत्र और परिणाम — सब एक जगह।",
    heroSubtitle:"SSC, UPSC, रेलवे, बैंकिंग, रक्षा, PSU और चिकित्सा भर्ती।",
    refreshed:"सूचनाएं हर 6 घंटे में अपडेट होती हैं",
    searchPlaceholder:"नौकरियाँ, संगठन, परीक्षा खोजें…",
    admitCardsTitle:"प्रवेश पत्र", admitCardsDesc:"नवीनतम सरकारी परीक्षा प्रवेश पत्र डाउनलोड करें।",
    resultsTitle:"परीक्षा परिणाम", resultsDesc:"नवीनतम सरकारी परीक्षा परिणाम और मेरिट सूची देखें।",
    allCategories:"सभी श्रेणियाँ", found:"मिले", previous:"पिछला", next:"अगला", pageOf:"पृष्ठ {p} / {t}",
    downloadAdmitCard:"प्रवेश पत्र डाउनलोड", viewResult:"परिणाम देखें", fullDetails:"पूरी जानकारी",
    noDataYet:"कोई डेटा नहीं — स्क्रेपर चलाएं।", organization:"संगठन", lastDate:"अंतिम तिथि",
    vacancies:"रिक्तियाँ", ageLimit:"आयु सीमा", importantDates:"महत्वपूर्ण तिथियाँ",
    applicationFee:"आवेदन शुल्क", importantLinks:"महत्वपूर्ण लिंक", howToFill:"फॉर्म कैसे भरें",
    selectionProcess:"चयन प्रक्रिया", applyOnline:"ऑनलाइन आवेदन",
    downloadNotification:"अधिसूचना डाउनलोड", saveJob:"बुकमार्क", saved:"सहेजा गया",
    share:"साझा करें", exportPdf:"PDF", jobNotFound:"नौकरी नहीं मिली", browseAllJobs:"सभी नौकरियाँ देखें",
    government:"केंद्र सरकार", banking:"बैंकिंग", railway:"रेलवे", defence:"रक्षा",
    medical:"चिकित्सा", teaching:"शिक्षण", engineering:"इंजीनियरिंग", psu:"PSU", research:"अनुसंधान",
  },
  bn: {
    home:"হোম", latestJobs:"সর্বশেষ চাকরি", admitCards:"প্রবেশপত্র", results:"ফলাফল",
    search:"অনুসন্ধান", bookmarks:"বুকমার্ক", profile:"প্রোফাইল", login:"লগইন",
    register:"নিবন্ধন", logout:"লগ আউট", admin:"অ্যাডমিন", viewAll:"সব দেখুন",
    latestJobsTitle:"সর্বশেষ চাকরি", latestJobsDesc:"নতুন প্রকাশিত নিয়োগ বিজ্ঞপ্তি।",
    latestAdmitCards:"সর্বশেষ প্রবেশপত্র", latestAdmitCardsDesc:"হল টিকিট ও কল লেটার ডাউনলোড করুন।",
    latestResults:"সর্বশেষ ফলাফল", latestResultsDesc:"পরীক্ষার ফলাফল ও মেরিট তালিকা দেখুন।",
    topOrganizations:"শীর্ষ সংস্থা", popularCategories:"জনপ্রিয় বিভাগ", closingSoon:"শীঘ্রই বন্ধ",
    heroTitle:"চাকরি, প্রবেশপত্র ও ফলাফল — এক জায়গায়।",
    heroSubtitle:"SSC, UPSC, রেলওয়ে, ব্যাংকিং, প্রতিরক্ষা, PSU ও চিকিৎসা নিয়োগ।",
    refreshed:"প্রতি ৬ ঘণ্টায় আপডেট হয়", searchPlaceholder:"চাকরি, সংস্থা, পরীক্ষা খুঁজুন…",
    admitCardsTitle:"প্রবেশপত্র", admitCardsDesc:"সর্বশেষ সরকারি পরীক্ষার প্রবেশপত্র ডাউনলোড করুন।",
    resultsTitle:"পরীক্ষার ফলাফল", resultsDesc:"সর্বশেষ সরকারি পরীক্ষার ফলাফল দেখুন।",
    allCategories:"সব বিভাগ", found:"পাওয়া গেছে", previous:"পূর্ববর্তী", next:"পরবর্তী", pageOf:"পৃষ্ঠা {p}/{t}",
    downloadAdmitCard:"প্রবেশপত্র ডাউনলোড", viewResult:"ফলাফল দেখুন", fullDetails:"সম্পূর্ণ বিবরণ",
    noDataYet:"এখনো ডেটা নেই।", organization:"সংস্থা", lastDate:"শেষ তারিখ",
    vacancies:"শূন্যপদ", ageLimit:"বয়সসীমা", importantDates:"গুরুত্বপূর্ণ তারিখ",
    applicationFee:"আবেদন ফি", importantLinks:"গুরুত্বপূর্ণ লিঙ্ক", howToFill:"ফর্ম পূরণ পদ্ধতি",
    selectionProcess:"বাছাই প্রক্রিয়া", applyOnline:"অনলাইন আবেদন",
    downloadNotification:"বিজ্ঞপ্তি ডাউনলোড", saveJob:"বুকমার্ক", saved:"সংরক্ষিত",
    share:"শেয়ার", exportPdf:"PDF", jobNotFound:"চাকরি পাওয়া যায়নি", browseAllJobs:"সব চাকরি দেখুন",
    government:"কেন্দ্রীয় সরকার", banking:"ব্যাংকিং", railway:"রেলওয়ে", defence:"প্রতিরক্ষা",
    medical:"চিকিৎসা", teaching:"শিক্ষকতা", engineering:"প্রকৌশল", psu:"PSU", research:"গবেষণা",
  },
  ta: {
    home:"முகப்பு", latestJobs:"சமீபத்திய வேலைகள்", admitCards:"அனுமதி அட்டை", results:"முடிவுகள்",
    search:"தேடல்", bookmarks:"புக்மார்க்", profile:"சுயவிவரம்", login:"உள்நுழை",
    register:"பதிவு", logout:"வெளியேறு", admin:"நிர்வாகி", viewAll:"அனைத்தையும் காண்க",
    latestJobsTitle:"சமீபத்திய வேலைகள்", latestJobsDesc:"புதியதாக வெளியிடப்பட்ட ஆட்சேர்ப்பு அறிவிப்புகள்.",
    latestAdmitCards:"சமீபத்திய அனுமதி அட்டைகள்", latestAdmitCardsDesc:"ஹால் டிக்கெட் பதிவிறக்கம் செய்யுங்கள்.",
    latestResults:"சமீபத்திய முடிவுகள்", latestResultsDesc:"தேர்வு முடிவுகளை சரிபாருங்கள்.",
    topOrganizations:"சிறந்த நிறுவனங்கள்", popularCategories:"பிரபலமான பிரிவுகள்", closingSoon:"விரைவில் மூடும்",
    heroTitle:"வேலைகள், அனுமதி அட்டைகள் & முடிவுகள் — ஒரே இடத்தில்.",
    heroSubtitle:"SSC, UPSC, ரயில்வே, வங்கி, தேசிய பாதுகாப்பு, PSU ஆட்சேர்ப்பு.",
    refreshed:"ஒவ்வொரு 6 மணி நேரத்திலும் புதுப்பிக்கப்படுகிறது",
    searchPlaceholder:"வேலைகள், நிறுவனங்கள் தேடுங்கள்…",
    admitCardsTitle:"அனுமதி அட்டைகள்", admitCardsDesc:"சமீபத்திய அரசு தேர்வு அனுமதி அட்டைகள்.",
    resultsTitle:"தேர்வு முடிவுகள்", resultsDesc:"சமீபத்திய அரசு தேர்வு முடிவுகள்.",
    allCategories:"அனைத்து பிரிவுகள்", found:"கண்டுபிடிக்கப்பட்டது", previous:"முந்தைய", next:"அடுத்த", pageOf:"பக்கம் {p}/{t}",
    downloadAdmitCard:"அனுமதி அட்டை பதிவிறக்கம்", viewResult:"முடிவு காண்க", fullDetails:"முழு விவரம்",
    noDataYet:"தரவு இல்லை.", organization:"நிறுவனம்", lastDate:"கடைசி தேதி",
    vacancies:"காலியிடங்கள்", ageLimit:"வயது வரம்பு", importantDates:"முக்கியமான தேதிகள்",
    applicationFee:"விண்ணப்பக் கட்டணம்", importantLinks:"முக்கிய இணைப்புகள்", howToFill:"படிவம் நிரப்பும் முறை",
    selectionProcess:"தேர்வு செயல்முறை", applyOnline:"ஆன்லைனில் விண்ணப்பிக்கவும்",
    downloadNotification:"அறிவிப்பு பதிவிறக்கம்", saveJob:"புக்மார்க்", saved:"சேமிக்கப்பட்டது",
    share:"பகிர்", exportPdf:"PDF", jobNotFound:"வேலை கிடைக்கவில்லை", browseAllJobs:"அனைத்து வேலைகளும்",
    government:"மத்திய அரசு", banking:"வங்கி", railway:"ரயில்வே", defence:"பாதுகாப்பு",
    medical:"மருத்துவம்", teaching:"கற்பித்தல்", engineering:"பொறியியல்", psu:"PSU", research:"ஆராய்ச்சி",
  },
  te: {
    home:"హోమ్", latestJobs:"తాజా ఉద్యోగాలు", admitCards:"అడ్మిట్ కార్డ్", results:"ఫలితాలు",
    search:"శోధన", bookmarks:"బుక్‌మార్క్", profile:"ప్రొఫైల్", login:"లాగిన్",
    register:"నమోదు", logout:"లాగ్ అవుట్", admin:"అడ్మిన్", viewAll:"అన్నీ చూడండి",
    latestJobsTitle:"తాజా ఉద్యోగాలు", latestJobsDesc:"క్రొత్తగా ప్రచురించిన నియామక నోటీసులు.",
    latestAdmitCards:"తాజా అడ్మిట్ కార్డులు", latestAdmitCardsDesc:"హాల్ టికెట్లు డౌన్‌లోడ్ చేయండి.",
    latestResults:"తాజా ఫలితాలు", latestResultsDesc:"పరీక్ష ఫలితాలు తనిఖీ చేయండి.",
    topOrganizations:"అగ్రశ్రేణి సంస్థలు", popularCategories:"ప్రసిద్ధ వర్గాలు", closingSoon:"త్వరలో మూసివేత",
    heroTitle:"ఉద్యోగాలు, అడ్మిట్ కార్డులు & ఫలితాలు — అన్నీ ఒక చోట.",
    heroSubtitle:"SSC, UPSC, రైల్వే, బ్యాంకింగ్, రక్షణ, PSU నియామకాలు.",
    refreshed:"ప్రతి 6 గంటలకు నవీకరించబడుతుంది", searchPlaceholder:"ఉద్యోగాలు, సంస్థలు శోధించండి…",
    admitCardsTitle:"అడ్మిట్ కార్డులు", admitCardsDesc:"తాజా ప్రభుత్వ పరీక్ష అడ్మిట్ కార్డులు.",
    resultsTitle:"పరీక్ష ఫలితాలు", resultsDesc:"తాజా ప్రభుత్వ పరీక్ష ఫలితాలు.",
    allCategories:"అన్ని వర్గాలు", found:"కనుగొన్నారు", previous:"మునుపటి", next:"తదుపరి", pageOf:"పేజీ {p}/{t}",
    downloadAdmitCard:"అడ్మిట్ కార్డ్ డౌన్‌లోడ్", viewResult:"ఫలితం చూడండి", fullDetails:"పూర్తి వివరాలు",
    noDataYet:"డేటా లేదు.", organization:"సంస్థ", lastDate:"చివరి తేదీ",
    vacancies:"ఖాళీలు", ageLimit:"వయో పరిమితి", importantDates:"ముఖ్యమైన తేదీలు",
    applicationFee:"దరఖాస్తు రుసుము", importantLinks:"ముఖ్యమైన లింకులు", howToFill:"ఫారం నింపే విధానం",
    selectionProcess:"ఎంపిక ప్రక్రియ", applyOnline:"ఆన్‌లైన్ దరఖాస్తు",
    downloadNotification:"నోటిఫికేషన్ డౌన్‌లోడ్", saveJob:"బుక్‌మార్క్", saved:"సేవ్ చేయబడింది",
    share:"షేర్", exportPdf:"PDF", jobNotFound:"ఉద్యోగం కనుగొనబడలేదు", browseAllJobs:"అన్ని ఉద్యోగాలు",
    government:"కేంద్ర ప్రభుత్వం", banking:"బ్యాంకింగ్", railway:"రైల్వే", defence:"రక్షణ",
    medical:"వైద్యం", teaching:"బోధన", engineering:"ఇంజినీరింగ్", psu:"PSU", research:"పరిశోధన",
  },
  mr: {
    home:"मुखपृष्ठ", latestJobs:"नवीन नोकऱ्या", admitCards:"प्रवेशपत्र", results:"निकाल",
    search:"शोधा", bookmarks:"बुकमार्क", profile:"प्रोफाइल", login:"लॉगिन",
    register:"नोंदणी", logout:"लॉग आउट", admin:"प्रशासक", viewAll:"सर्व पहा",
    latestJobsTitle:"नवीन नोकऱ्या", latestJobsDesc:"नुकत्याच प्रकाशित भरती जाहिराती.",
    latestAdmitCards:"नवीन प्रवेशपत्रे", latestAdmitCardsDesc:"हॉल तिकीट व कॉल लेटर डाउनलोड करा.",
    latestResults:"नवीन निकाल", latestResultsDesc:"परीक्षेचे निकाल व गुणवत्ता यादी पहा.",
    topOrganizations:"प्रमुख संस्था", popularCategories:"लोकप्रिय श्रेणी", closingSoon:"लवकर बंद होणार",
    heroTitle:"नोकऱ्या, प्रवेशपत्रे व निकाल — सर्व एकाच ठिकाणी.",
    heroSubtitle:"SSC, UPSC, रेल्वे, बँकिंग, संरक्षण, PSU भरती.",
    refreshed:"दर 6 तासांनी अपडेट होते", searchPlaceholder:"नोकऱ्या, संस्था शोधा…",
    admitCardsTitle:"प्रवेशपत्रे", admitCardsDesc:"नवीनतम सरकारी परीक्षा प्रवेशपत्रे.",
    resultsTitle:"परीक्षा निकाल", resultsDesc:"नवीनतम सरकारी परीक्षा निकाल.",
    allCategories:"सर्व श्रेणी", found:"सापडले", previous:"मागील", next:"पुढील", pageOf:"पृष्ठ {p}/{t}",
    downloadAdmitCard:"प्रवेशपत्र डाउनलोड", viewResult:"निकाल पहा", fullDetails:"संपूर्ण माहिती",
    noDataYet:"डेटा नाही.", organization:"संस्था", lastDate:"शेवटची तारीख",
    vacancies:"रिक्त जागा", ageLimit:"वयोमर्यादा", importantDates:"महत्त्वाच्या तारखा",
    applicationFee:"अर्ज शुल्क", importantLinks:"महत्त्वाचे दुवे", howToFill:"अर्ज कसा भरायचा",
    selectionProcess:"निवड प्रक्रिया", applyOnline:"ऑनलाइन अर्ज",
    downloadNotification:"अधिसूचना डाउनलोड", saveJob:"बुकमार्क", saved:"जतन केले",
    share:"शेअर", exportPdf:"PDF", jobNotFound:"नोकरी सापडली नाही", browseAllJobs:"सर्व नोकऱ्या",
    government:"केंद्र सरकार", banking:"बँकिंग", railway:"रेल्वे", defence:"संरक्षण",
    medical:"वैद्यकीय", teaching:"शिक्षण", engineering:"अभियांत्रिकी", psu:"PSU", research:"संशोधन",
  },
  gu: {
    home:"હોમ", latestJobs:"તાજી નોકરીઓ", admitCards:"પ્રવેશ પત્ર", results:"પરિણામ",
    search:"શોધો", bookmarks:"બુકમાર્ક", profile:"પ્રોફાઇલ", login:"લૉગિન",
    register:"નોંધણી", logout:"લૉગ આઉટ", admin:"એડ્મિન", viewAll:"બધા જુઓ",
    latestJobsTitle:"તાજી નોકરીઓ", latestJobsDesc:"નવી ભરતી જાહેરાતો.",
    latestAdmitCards:"તાજા પ્રવેશ પત્ર", latestAdmitCardsDesc:"હૉલ ટિકિટ ડાઉનલોડ કરો.",
    latestResults:"તાજા પરિણામ", latestResultsDesc:"પરીક્ષા પરિણામ અને મેરિટ યાદી.",
    topOrganizations:"ટોચની સંસ્થાઓ", popularCategories:"લોકપ્રિય શ્રેણીઓ", closingSoon:"જલ્દ બંધ",
    heroTitle:"નોકરી, પ્રવેશ પત્ર & પરિણામ — એક જ જગ્યાએ.",
    heroSubtitle:"SSC, UPSC, રેલ્વે, બેંકિંગ, સંરક્ષણ, PSU ભરતી.",
    refreshed:"દર 6 કલાકે અપડેટ", searchPlaceholder:"નોકરી, સંસ્થા શોધો…",
    admitCardsTitle:"પ્રવેશ પત્ર", admitCardsDesc:"સરકારી પરીક્ષા પ્રવેશ પત્ર ડાઉનલોડ.",
    resultsTitle:"પરીક્ષા પરિણામ", resultsDesc:"સરકારી પરીક્ષા પરિણામ.",
    allCategories:"બધી શ્રેણીઓ", found:"મળ્યા", previous:"પાછળ", next:"આગળ", pageOf:"પૃષ્ઠ {p}/{t}",
    downloadAdmitCard:"પ્રવેશ પત્ર ડાઉનલોડ", viewResult:"પરિણામ જુઓ", fullDetails:"સંપૂર્ણ વિગત",
    noDataYet:"ડેટા નથી.", organization:"સંસ્થા", lastDate:"છેલ્લી તારીખ",
    vacancies:"ખાલી જગ્યા", ageLimit:"ઉંમર મર્યાદા", importantDates:"મહત્વની તારીખો",
    applicationFee:"અરજી ફી", importantLinks:"મહત્વની લિન્ક", howToFill:"ફોર્મ કેવી રીતે ભરવો",
    selectionProcess:"પસંદગી પ્રક્રિયા", applyOnline:"ઓનલાઇન અરજી",
    downloadNotification:"સૂચના ડાઉનલોડ", saveJob:"બુકમાર્ક", saved:"સાચવ્યું",
    share:"શેર", exportPdf:"PDF", jobNotFound:"નોકરી મળી નહીં", browseAllJobs:"બધી નોકરીઓ",
    government:"કેન્દ્ર સરકાર", banking:"બેંકિંગ", railway:"રેલ્વે", defence:"સંરક્ષણ",
    medical:"તબીબી", teaching:"શિક્ષણ", engineering:"એન્જિનિયરિંગ", psu:"PSU", research:"સંશોધન",
  },
  pa: {
    home:"ਹੋਮ", latestJobs:"ਤਾਜ਼ੀਆਂ ਨੌਕਰੀਆਂ", admitCards:"ਦਾਖਲਾ ਕਾਰਡ", results:"ਨਤੀਜੇ",
    search:"ਖੋਜ", bookmarks:"ਬੁੱਕਮਾਰਕ", profile:"ਪ੍ਰੋਫਾਈਲ", login:"ਲੌਗਿਨ",
    register:"ਰਜਿਸਟਰ", logout:"ਲੌਗ ਆਉਟ", admin:"ਐਡਮਿਨ", viewAll:"ਸਭ ਦੇਖੋ",
    latestJobsTitle:"ਤਾਜ਼ੀਆਂ ਨੌਕਰੀਆਂ", latestJobsDesc:"ਨਵੇਂ ਭਰਤੀ ਨੋਟਿਸ।",
    latestAdmitCards:"ਤਾਜ਼ੇ ਦਾਖਲਾ ਕਾਰਡ", latestAdmitCardsDesc:"ਹਾਲ ਟਿਕਟ ਡਾਊਨਲੋਡ ਕਰੋ।",
    latestResults:"ਤਾਜ਼ੇ ਨਤੀਜੇ", latestResultsDesc:"ਪ੍ਰੀਖਿਆ ਨਤੀਜੇ ਦੇਖੋ।",
    topOrganizations:"ਮੁੱਖ ਸੰਸਥਾਵਾਂ", popularCategories:"ਪ੍ਰਸਿੱਧ ਸ਼੍ਰੇਣੀਆਂ", closingSoon:"ਜਲਦੀ ਬੰਦ",
    heroTitle:"ਨੌਕਰੀਆਂ, ਦਾਖਲਾ ਕਾਰਡ ਅਤੇ ਨਤੀਜੇ — ਇੱਕੋ ਥਾਂ।",
    heroSubtitle:"SSC, UPSC, ਰੇਲਵੇ, ਬੈਂਕਿੰਗ, ਰੱਖਿਆ, PSU ਭਰਤੀ।",
    refreshed:"ਹਰ 6 ਘੰਟੇ ਅਪਡੇਟ", searchPlaceholder:"ਨੌਕਰੀਆਂ, ਸੰਸਥਾਵਾਂ ਖੋਜੋ…",
    admitCardsTitle:"ਦਾਖਲਾ ਕਾਰਡ", admitCardsDesc:"ਸਰਕਾਰੀ ਪ੍ਰੀਖਿਆ ਦਾਖਲਾ ਕਾਰਡ।",
    resultsTitle:"ਪ੍ਰੀਖਿਆ ਨਤੀਜੇ", resultsDesc:"ਸਰਕਾਰੀ ਪ੍ਰੀਖਿਆ ਨਤੀਜੇ।",
    allCategories:"ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ", found:"ਮਿਲੇ", previous:"ਪਿਛਲਾ", next:"ਅਗਲਾ", pageOf:"ਸਫ਼ਾ {p}/{t}",
    downloadAdmitCard:"ਦਾਖਲਾ ਕਾਰਡ ਡਾਊਨਲੋਡ", viewResult:"ਨਤੀਜਾ ਦੇਖੋ", fullDetails:"ਪੂਰੀ ਜਾਣਕਾਰੀ",
    noDataYet:"ਕੋਈ ਡੇਟਾ ਨਹੀਂ।", organization:"ਸੰਸਥਾ", lastDate:"ਅੰਤਿਮ ਤਾਰੀਖ",
    vacancies:"ਅਸਾਮੀਆਂ", ageLimit:"ਉਮਰ ਸੀਮਾ", importantDates:"ਮਹੱਤਵਪੂਰਨ ਤਾਰੀਖਾਂ",
    applicationFee:"ਅਰਜ਼ੀ ਫ਼ੀਸ", importantLinks:"ਮਹੱਤਵਪੂਰਨ ਲਿੰਕ", howToFill:"ਫਾਰਮ ਕਿਵੇਂ ਭਰੀਏ",
    selectionProcess:"ਚੋਣ ਪ੍ਰਕਿਰਿਆ", applyOnline:"ਔਨਲਾਈਨ ਅਰਜ਼ੀ",
    downloadNotification:"ਨੋਟਿਫਿਕੇਸ਼ਨ ਡਾਊਨਲੋਡ", saveJob:"ਬੁੱਕਮਾਰਕ", saved:"ਸੁਰੱਖਿਅਤ",
    share:"ਸਾਂਝਾ ਕਰੋ", exportPdf:"PDF", jobNotFound:"ਨੌਕਰੀ ਨਹੀਂ ਮਿਲੀ", browseAllJobs:"ਸਾਰੀਆਂ ਨੌਕਰੀਆਂ",
    government:"ਕੇਂਦਰ ਸਰਕਾਰ", banking:"ਬੈਂਕਿੰਗ", railway:"ਰੇਲਵੇ", defence:"ਰੱਖਿਆ",
    medical:"ਡਾਕਟਰੀ", teaching:"ਅਧਿਆਪਨ", engineering:"ਇੰਜੀਨੀਅਰਿੰਗ", psu:"PSU", research:"ਖੋਜ",
  },
  kn: {
    home:"ಹೋಮ್", latestJobs:"ಇತ್ತೀಚಿನ ಉದ್ಯೋಗಗಳು", admitCards:"ಪ್ರವೇಶ ಪತ್ರ", results:"ಫಲಿತಾಂಶಗಳು",
    search:"ಹುಡುಕಿ", bookmarks:"ಬುಕ್‌ಮಾರ್ಕ್", profile:"ಪ್ರೊಫೈಲ್", login:"ಲಾಗಿನ್",
    register:"ನೋಂದಣಿ", logout:"ಲಾಗ್ ಔಟ್", admin:"ಆಡ್ಮಿನ್", viewAll:"ಎಲ್ಲ ನೋಡಿ",
    latestJobsTitle:"ಇತ್ತೀಚಿನ ಉದ್ಯೋಗಗಳು", latestJobsDesc:"ಹೊಸ ನೇಮಕಾತಿ ಅಧಿಸೂಚನೆಗಳು.",
    latestAdmitCards:"ಇತ್ತೀಚಿನ ಪ್ರವೇಶ ಪತ್ರ", latestAdmitCardsDesc:"ಹಾಲ್ ಟಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    latestResults:"ಇತ್ತೀಚಿನ ಫಲಿತಾಂಶ", latestResultsDesc:"ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ ಪರಿಶೀಲಿಸಿ.",
    topOrganizations:"ಪ್ರಮುಖ ಸಂಸ್ಥೆಗಳು", popularCategories:"ಜನಪ್ರಿಯ ವರ್ಗಗಳು", closingSoon:"ಶೀಘ್ರದಲ್ಲಿ ಮುಚ್ಚಲಾಗುತ್ತದೆ",
    heroTitle:"ಉದ್ಯೋಗ, ಪ್ರವೇಶ ಪತ್ರ & ಫಲಿತಾಂಶ — ಒಂದೇ ಜಾಗದಲ್ಲಿ.",
    heroSubtitle:"SSC, UPSC, ರೈಲ್ವೆ, ಬ್ಯಾಂಕಿಂಗ್, ರಕ್ಷಣೆ, PSU ನೇಮಕಾತಿ.",
    refreshed:"ಪ್ರತಿ 6 ಗಂಟೆಗೆ ನವೀಕರಿಸಲಾಗುತ್ತದೆ", searchPlaceholder:"ಉದ್ಯೋಗ, ಸಂಸ್ಥೆ ಹುಡುಕಿ…",
    admitCardsTitle:"ಪ್ರವೇಶ ಪತ್ರ", admitCardsDesc:"ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಯ ಪ್ರವೇಶ ಪತ್ರ.",
    resultsTitle:"ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ", resultsDesc:"ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ.",
    allCategories:"ಎಲ್ಲ ವರ್ಗಗಳು", found:"ಕಂಡುಬಂದಿದೆ", previous:"ಹಿಂದಿನ", next:"ಮುಂದಿನ", pageOf:"ಪುಟ {p}/{t}",
    downloadAdmitCard:"ಪ್ರವೇಶ ಪತ್ರ ಡೌನ್‌ಲೋಡ್", viewResult:"ಫಲಿತಾಂಶ ನೋಡಿ", fullDetails:"ಸಂಪೂರ್ಣ ವಿವರ",
    noDataYet:"ಡೇಟಾ ಇಲ್ಲ.", organization:"ಸಂಸ್ಥೆ", lastDate:"ಕೊನೆಯ ದಿನಾಂಕ",
    vacancies:"ತೆರವು ಹುದ್ದೆಗಳು", ageLimit:"ವಯೋಮಿತಿ", importantDates:"ಮುಖ್ಯ ದಿನಾಂಕಗಳು",
    applicationFee:"ಅರ್ಜಿ ಶುಲ್ಕ", importantLinks:"ಮುಖ್ಯ ಲಿಂಕ್‌ಗಳು", howToFill:"ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡುವ ವಿಧಾನ",
    selectionProcess:"ಆಯ್ಕೆ ಪ್ರಕ್ರಿಯೆ", applyOnline:"ಆನ್‌ಲೈನ್ ಅರ್ಜಿ",
    downloadNotification:"ಅಧಿಸೂಚನೆ ಡೌನ್‌ಲೋಡ್", saveJob:"ಬುಕ್‌ಮಾರ್ಕ್", saved:"ಉಳಿಸಲಾಗಿದೆ",
    share:"ಹಂಚಿಕೊಳ್ಳಿ", exportPdf:"PDF", jobNotFound:"ಉದ್ಯೋಗ ಕಂಡುಬಂದಿಲ್ಲ", browseAllJobs:"ಎಲ್ಲ ಉದ್ಯೋಗ",
    government:"ಕೇಂದ್ರ ಸರ್ಕಾರ", banking:"ಬ್ಯಾಂಕಿಂಗ್", railway:"ರೈಲ್ವೆ", defence:"ರಕ್ಷಣೆ",
    medical:"ವೈದ್ಯಕೀಯ", teaching:"ಶಿಕ್ಷಣ", engineering:"ಇಂಜಿನಿಯರಿಂಗ್", psu:"PSU", research:"ಸಂಶೋಧನೆ",
  },
  ml: {
    home:"ഹോം", latestJobs:"ഏറ്റവും പുതിയ ജോലികൾ", admitCards:"അഡ്മിറ്റ് കാർഡ്", results:"ഫലങ്ങൾ",
    search:"തിരയുക", bookmarks:"ബുക്ക്‌മാർക്ക്", profile:"പ്രൊഫൈൽ", login:"ലോഗിൻ",
    register:"രജിസ്റ്റർ", logout:"ലോഗ് ഔട്ട്", admin:"അഡ്മിൻ", viewAll:"എല്ലാം കാണുക",
    latestJobsTitle:"ഏറ്റവും പുതിയ ജോലികൾ", latestJobsDesc:"പുതിയ നിയമന അറിയിപ്പുകൾ.",
    latestAdmitCards:"ഏറ്റവും പുതിയ അഡ്മിറ്റ് കാർഡ്", latestAdmitCardsDesc:"ഹാൾ ടിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യുക.",
    latestResults:"ഏറ്റവും പുതിയ ഫലങ്ങൾ", latestResultsDesc:"പരീക്ഷ ഫലങ്ങൾ പരിശോധിക്കുക.",
    topOrganizations:"പ്രധാന സ്ഥാപനങ്ങൾ", popularCategories:"ജനപ്രിയ വിഭാഗങ്ങൾ", closingSoon:"ഉടൻ അവസാനിക്കും",
    heroTitle:"ജോലികൾ, അഡ്മിറ്റ് കാർഡ് & ഫലങ്ങൾ — ഒരിടത്ത്.",
    heroSubtitle:"SSC, UPSC, റെയിൽവേ, ബാങ്കിംഗ്, പ്രതിരോധം, PSU നിയമനം.",
    refreshed:"എല്ലാ 6 മണിക്കൂറിലും അപ്ഡേറ്റ്", searchPlaceholder:"ജോലികൾ, സ്ഥാപനങ്ങൾ തിരയുക…",
    admitCardsTitle:"അഡ്മിറ്റ് കാർഡ്", admitCardsDesc:"സർക്കാർ പരീക്ഷ അഡ്മിറ്റ് കാർഡ്.",
    resultsTitle:"പരീക്ഷ ഫലങ്ങൾ", resultsDesc:"സർക്കാർ പരീക്ഷ ഫലങ്ങൾ.",
    allCategories:"എല്ലാ വിഭാഗങ്ങൾ", found:"കണ്ടെത്തി", previous:"മുൻ", next:"അടുത്ത", pageOf:"പേജ് {p}/{t}",
    downloadAdmitCard:"അഡ്മിറ്റ് കാർഡ് ഡൗൺലോഡ്", viewResult:"ഫലം കാണുക", fullDetails:"പൂർണ്ണ വിവരങ്ങൾ",
    noDataYet:"ഡേറ്റ ഇല്ല.", organization:"സ്ഥാപനം", lastDate:"അവസാന തീയതി",
    vacancies:"ഒഴിവുകൾ", ageLimit:"പ്രായ പരിധി", importantDates:"പ്രധാന തീയതികൾ",
    applicationFee:"അപേക്ഷ ഫീസ്", importantLinks:"പ്രധാന ലിങ്കുകൾ", howToFill:"ഫോം പൂരിപ്പിക്കൽ",
    selectionProcess:"തിരഞ്ഞെടുപ്പ് പ്രക്രിയ", applyOnline:"ഓൺലൈൻ അപേക്ഷ",
    downloadNotification:"അറിയിപ്പ് ഡൗൺലോഡ്", saveJob:"ബുക്ക്‌മാർക്ക്", saved:"സേവ് ചെയ്തു",
    share:"പങ്കിടുക", exportPdf:"PDF", jobNotFound:"ജോലി കണ്ടെത്തിയില്ല", browseAllJobs:"എല്ലാ ജോലികളും",
    government:"കേന്ദ്ര സർക്കാർ", banking:"ബാങ്കിംഗ്", railway:"റെയിൽവേ", defence:"പ്രതിരോധം",
    medical:"വൈദ്യം", teaching:"അധ്യാപനം", engineering:"എഞ്ചിനീയറിംഗ്", psu:"PSU", research:"ഗവേഷണം",
  },
  or: {
    home:"ହୋମ", latestJobs:"ସର୍ବଶେଷ ଚାକିରି", admitCards:"ପ୍ରବେଶ ପତ୍ର", results:"ଫଳାଫଳ",
    search:"ଖୋଜ", bookmarks:"ବୁକ୍‌ମାର୍କ", profile:"ପ୍ରୋଫାଇଲ୍", login:"ଲଗ ଇନ୍",
    register:"ପଞ୍ଜୀକରଣ", logout:"ଲଗ ଆଉଟ୍", admin:"ଆଡ୍ମିନ୍", viewAll:"ସବୁ ଦେଖ",
    latestJobsTitle:"ସର୍ବଶେଷ ଚାକିରି", latestJobsDesc:"ନୂଆ ନିଯୁକ୍ତି ବିଜ୍ଞପ୍ତି।",
    latestAdmitCards:"ସର୍ବଶେଷ ପ୍ରବେଶ ପତ୍ର", latestAdmitCardsDesc:"ହଲ ଟିକଟ ଡାଉନ୍‌ଲୋଡ୍ କରନ୍ତୁ।",
    latestResults:"ସର୍ବଶେଷ ଫଳାଫଳ", latestResultsDesc:"ପରୀକ୍ଷା ଫଳାଫଳ ଦେଖନ୍ତୁ।",
    topOrganizations:"ଶ୍ରେଷ୍ଠ ସଂଗଠନ", popularCategories:"ଲୋକପ୍ରିୟ ବର୍ଗ", closingSoon:"ଶୀଘ୍ର ବନ୍ଦ",
    heroTitle:"ଚାକିରି, ପ୍ରବେଶ ପତ୍ର ଓ ଫଳାଫଳ — ଏକ ଜାଗାରେ।",
    heroSubtitle:"SSC, UPSC, ରେଲୱେ, ବ୍ୟାଙ୍କିଂ, ପ୍ରତିରକ୍ଷା, PSU ନିଯୁକ୍ତି।",
    refreshed:"ପ୍ରତି 6 ଘଣ୍ଟାରେ ଅଦ୍ୟତନ", searchPlaceholder:"ଚାକିରି, ସଂଗଠନ ଖୋଜ…",
    admitCardsTitle:"ପ୍ରବେଶ ପତ୍ର", admitCardsDesc:"ସରକାରୀ ପରୀକ୍ଷା ପ୍ରବେଶ ପତ୍ର।",
    resultsTitle:"ପରୀକ୍ଷା ଫଳାଫଳ", resultsDesc:"ସରକାରୀ ପରୀକ୍ଷା ଫଳାଫଳ।",
    allCategories:"ସବୁ ବର୍ଗ", found:"ମିଳିଲା", previous:"ପୂର୍ବ", next:"ପରବର୍ତ୍ତୀ", pageOf:"ପୃଷ୍ଠା {p}/{t}",
    downloadAdmitCard:"ପ୍ରବେଶ ପତ୍ର ଡାଉନ୍‌ଲୋଡ୍", viewResult:"ଫଳ ଦେଖ", fullDetails:"ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣ",
    noDataYet:"ତଥ୍ୟ ନାହିଁ।", organization:"ସଂଗଠନ", lastDate:"ଶେଷ ତାରିଖ",
    vacancies:"ଖାଲି ପଦ", ageLimit:"ବୟସ ସୀମା", importantDates:"ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ତାରିଖ",
    applicationFee:"ଆବେଦନ ଫି", importantLinks:"ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଲିଙ୍କ", howToFill:"ଫର୍ମ ପୂରଣ",
    selectionProcess:"ଚୟନ ପ୍ରକ୍ରିୟା", applyOnline:"ଅନ୍‌ଲାଇନ ଆବେଦନ",
    downloadNotification:"ବିଜ୍ଞପ୍ତି ଡାଉନ୍‌ଲୋଡ୍", saveJob:"ବୁକ୍‌ମାର୍କ", saved:"ସଞ୍ଚୟ ହୋଇଛି",
    share:"ଶେୟାର", exportPdf:"PDF", jobNotFound:"ଚାକିରି ମିଳିଲା ନାହିଁ", browseAllJobs:"ସବୁ ଚାକିରି",
    government:"କେନ୍ଦ୍ର ସରକାର", banking:"ବ୍ୟାଙ୍କିଂ", railway:"ରେଲୱେ", defence:"ପ୍ରତିରକ୍ଷା",
    medical:"ଚିକିତ୍ସା", teaching:"ଶିକ୍ଷଣ", engineering:"ଇଞ୍ଜିନିୟରିଂ", psu:"PSU", research:"ଗବେଷଣା",
  },
  ur: {
    home:"ہوم", latestJobs:"تازہ ترین ملازمتیں", admitCards:"داخلہ کارڈ", results:"نتائج",
    search:"تلاش", bookmarks:"بُک مارک", profile:"پروفائل", login:"لاگ ان",
    register:"رجسٹر", logout:"لاگ آؤٹ", admin:"ایڈمن", viewAll:"سب دیکھیں",
    latestJobsTitle:"تازہ ترین ملازمتیں", latestJobsDesc:"نئی بھرتی اطلاعات۔",
    latestAdmitCards:"تازہ ترین داخلہ کارڈ", latestAdmitCardsDesc:"ہال ٹکٹ ڈاؤن لوڈ کریں۔",
    latestResults:"تازہ ترین نتائج", latestResultsDesc:"امتحانی نتائج چیک کریں۔",
    topOrganizations:"اعلیٰ ادارے", popularCategories:"مشہور زمرے", closingSoon:"جلد بند",
    heroTitle:"ملازمتیں، داخلہ کارڈ اور نتائج — ایک جگہ۔",
    heroSubtitle:"SSC, UPSC، ریلوے، بینکنگ، دفاع، PSU بھرتی۔",
    refreshed:"ہر 6 گھنٹے میں اپ ڈیٹ", searchPlaceholder:"ملازمتیں، ادارے تلاش کریں…",
    admitCardsTitle:"داخلہ کارڈ", admitCardsDesc:"سرکاری امتحان داخلہ کارڈ ڈاؤن لوڈ کریں۔",
    resultsTitle:"امتحانی نتائج", resultsDesc:"سرکاری امتحانی نتائج۔",
    allCategories:"تمام زمرے", found:"ملے", previous:"پچھلا", next:"اگلا", pageOf:"صفحہ {p}/{t}",
    downloadAdmitCard:"داخلہ کارڈ ڈاؤن لوڈ", viewResult:"نتیجہ دیکھیں", fullDetails:"مکمل تفصیل",
    noDataYet:"کوئی ڈیٹا نہیں۔", organization:"ادارہ", lastDate:"آخری تاریخ",
    vacancies:"آسامیاں", ageLimit:"عمر کی حد", importantDates:"اہم تاریخیں",
    applicationFee:"درخواست فیس", importantLinks:"اہم لنکس", howToFill:"فارم کیسے بھریں",
    selectionProcess:"انتخابی عمل", applyOnline:"آن لائن درخواست",
    downloadNotification:"نوٹیفکیشن ڈاؤن لوڈ", saveJob:"بُک مارک", saved:"محفوظ",
    share:"شیئر", exportPdf:"PDF", jobNotFound:"ملازمت نہیں ملی", browseAllJobs:"تمام ملازمتیں",
    government:"مرکزی حکومت", banking:"بینکنگ", railway:"ریلوے", defence:"دفاع",
    medical:"طبی", teaching:"تعلیم", engineering:"انجینئرنگ", psu:"PSU", research:"تحقیق",
  },
};

// ── Context ────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang: LangCode;
  language: Language;
  setLang: (code: LangCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "deshkiseva.lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    return saved && TRANSLATIONS[saved] ? saved : "en";
  });

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
    const l = LANGUAGES.find(x => x.code === code);
    document.documentElement.lang = code;
    document.documentElement.dir  = l?.dir ?? "ltr";
  }, []);

  useEffect(() => {
    const l = LANGUAGES.find(x => x.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir  = l?.dir ?? "ltr";
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key,
    [lang],
  );

  const language = LANGUAGES.find(x => x.code === lang) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, language, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
