// IndicVoices (AI4Bharat) 22 Indian Languages Acoustic & Dataset Integration Engine
// Connects IndicVoices dataset configurations (22 official Indian languages) into AuraVoice AI's acoustic synthesis pipeline.

export interface IndicLanguage {
  code: string;
  name: string;
  native: string;
  region: string;
  speakers: string;
  script: string;
  sampleText: string;
  romanized: string;
}

export const INDICVOICES_LANGUAGES: IndicLanguage[] = [
  {
    code: 'hi-IN',
    name: 'Hindi',
    native: 'हिंदी',
    region: 'North / Central India',
    speakers: '528M',
    script: 'Devanagari',
    sampleText: 'नमस्ते! इंडिकवॉइसेस एआई मॉडल्स और करियर कम्पास में आपका स्वागत है।',
    romanized: 'Namaste! IndicVoices AI models aur Career Compass me aapka swagat hai.'
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    native: 'বাংলা',
    region: 'East / West Bengal',
    speakers: '97M',
    script: 'Bengali',
    sampleText: 'নমস্কার! ইন্ডিকেভয়েসেস এআই মডেলে আপনাকে স্বাগতম।',
    romanized: 'Namoṣkār! IndicVoices AI modele aapnake swagatom.'
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    native: 'தமிழ்',
    region: 'South / Tamil Nadu',
    speakers: '69M',
    script: 'Tamil',
    sampleText: 'வணக்கம்! இண்டிக்வாய்ஸஸ் ஏஐ மாடல்களுக்கு உங்களை வரவேற்கிறோம்.',
    romanized: 'Vanakkam! IndicVoices AI modelgalukku ungalai varaverkirom.'
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    native: 'తెలుగు',
    region: 'South / Andhra & Telangana',
    speakers: '81M',
    script: 'Telugu',
    sampleText: 'నమస్కారం! ఇండిక్‌వాయిసెస్ ఏఐ మోడల్స్‌కి స్వాగతం.',
    romanized: 'Namaskaram! IndicVoices AI models ki swagatam.'
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    native: 'मराठी',
    region: 'West / Maharashtra',
    speakers: '83M',
    script: 'Devanagari',
    sampleText: 'नमस्कार! इंडिकव्हॉइसेस एआय मॉडेल्समध्ये आपले सहर्ष स्वागत आहे.',
    romanized: 'Namaskar! IndicVoices AI models madhye aple saharsh swagat aahe.'
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    native: 'ગુજરાતી',
    region: 'West / Gujarat',
    speakers: '55M',
    script: 'Gujarati',
    sampleText: 'નમસ્તે! ઈન્ડિકવોઈસીસ એઆઈ મોડેલ્સમાં આપનું હાર્દિક સ્વાગત છે.',
    romanized: 'Namaste! IndicVoices AI models ma aapnu hardik swagat chhe.'
  },
  {
    code: 'kn-IN',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    region: 'South / Karnataka',
    speakers: '44M',
    script: 'Kannada',
    sampleText: 'ನಮಸ್ಕಾರ! ಇಂಡಿಕ್‌ವಾಯ್ಸಸ್ ಎಐ ಮಾಡೆಲ್‌ಗಳಿಗೆ ಸುಸ್ವಾಗತ.',
    romanized: 'Namaskara! IndicVoices AI modelgalige suswagatha.'
  },
  {
    code: 'ml-IN',
    name: 'Malayalam',
    native: 'മലയാളം',
    region: 'South / Kerala',
    speakers: '34M',
    script: 'Malayalam',
    sampleText: 'നമസ്കാരം! ഇൻഡിക് വോയ്സസ് എഐ മോഡലുകളിലേക്ക് സ്വാഗതം.',
    romanized: 'Namaskaram! IndicVoices AI modelukalilekku swagatham.'
  },
  {
    code: 'pa-IN',
    name: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    region: 'North / Punjab',
    speakers: '33M',
    script: 'Gurmukhi',
    sampleText: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਇੰਡਿਕਵਾਇਸਿਸ ਏਆਈ ਮਾਡਲਾਂ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।',
    romanized: 'Sat Sri Akaal! IndicVoices AI modalaan vich tuhada swagat hai.'
  },
  {
    code: 'or-IN',
    name: 'Odia',
    native: 'ଓଡ଼ିଆ',
    region: 'East / Odisha',
    speakers: '38M',
    script: 'Odia',
    sampleText: 'ନମସ୍କାର! ଇଣ୍ଡିକଭଏସେସ୍ AI ମଡେଲଗୁଡ଼ିକରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।',
    romanized: 'Namaskara! IndicVoices AI modelgudikare aapnanku swagat.'
  },
  {
    code: 'as-IN',
    name: 'Assamese',
    native: 'অসমীয়া',
    region: 'Northeast / Assam',
    speakers: '15M',
    script: 'Assamese',
    sampleText: 'নমস্কাৰ! ইণ্ডিকভয়েচ এআই মডেললৈ আপোনাক স্বাগতম।',
    romanized: 'Nomoskar! IndicVoices AI modeloloi aponak swagatom.'
  },
  {
    code: 'ne-IN',
    name: 'Nepali',
    native: 'नेपाली',
    region: 'North / Sikkim & Gorkhaland',
    speakers: '3M',
    script: 'Devanagari',
    sampleText: 'नमस्ते! इन्डिकभोइसेस एआई मोडेलमा यहाँलाई हार्दिक स्वागत छ।',
    romanized: 'Namaste! IndicVoices AI modelma yahanlai hardik swagat chha.'
  },
  {
    code: 'ur-IN',
    name: 'Urdu',
    native: 'اردو',
    region: 'Pan-India',
    speakers: '51M',
    script: 'Perso-Arabic',
    sampleText: 'السلام علیکم! انڈک وائسز اے آئی ماڈلز میں خوش آمدید۔',
    romanized: 'Assalam-o-Alaikum! IndicVoices AI models me khush aamdeed.'
  },
  {
    code: 'sa-IN',
    name: 'Sanskrit',
    native: 'संस्कृतम्',
    region: 'Classical / Pan-India',
    speakers: '25K',
    script: 'Devanagari',
    sampleText: 'नमो नमः! इन्डिक्वाइसेस एआई प्रति भवतां सर्वेषां स्वागतम्।',
    romanized: 'Namo Namah! IndicVoices AI prati bhavataam sarvesham swagatam.'
  },
  {
    code: 'kok-IN',
    name: 'Konkani',
    native: 'कोंकणी',
    region: 'West / Goa & Coastal Konkan',
    speakers: '2.3M',
    script: 'Devanagari',
    sampleText: 'नमस्कार! इंडिकव्हॉइसेस एआय मॉडलांत तुमकां येवकार।',
    romanized: 'Namaskar! IndicVoices AI modlant tumkam yevkar.'
  },
  {
    code: 'mai-IN',
    name: 'Maithili',
    native: 'मैथिली',
    region: 'East / Bihar & Mithila',
    speakers: '14M',
    script: 'Devanagari',
    sampleText: 'प्रणाम! इन्डिकभ्वाइसेस एआई मोडल्समे अपनेक स्वागत अछि।',
    romanized: 'Pranam! IndicVoices AI models me apne k swagat achhi.'
  },
  {
    code: 'mni-IN',
    name: 'Manipuri / Meitei',
    native: 'মৈতৈলোন্',
    region: 'Northeast / Manipur',
    speakers: '1.8M',
    script: 'Bengali / Meitei',
    sampleText: 'খুরুমজরি! ইন্দিকভোইসেস এআই মোদেলদা তরাম্না ওকচরি।',
    romanized: 'Khurumjari! IndicVoices AI modelda taramna okchari.'
  },
  {
    code: 'brx-IN',
    name: 'Bodo',
    native: 'बर\'',
    region: 'Northeast / Bodoland, Assam',
    speakers: '1.4M',
    script: 'Devanagari',
    sampleText: 'खुलुमबाय! इन्डिकभइसेस एआई मदेलो नोंथांखौ बरायबाय।',
    romanized: 'Khulumbay! IndicVoices AI modelo nongthangkho boraybay.'
  },
  {
    code: 'doi-IN',
    name: 'Dogri',
    native: 'डोगरी',
    region: 'North / Jammu',
    speakers: '2.6M',
    script: 'Devanagari',
    sampleText: 'नमस्ते! इन्डिकवाइसिज एआई माडलें च तुंदा स्वागत ऐ।',
    romanized: 'Namaste! IndicVoices AI modelen ch tunda swagat ai.'
  },
  {
    code: 'ks-IN',
    name: 'Kashmiri',
    native: 'कश्मीरी / کٲشُر',
    region: 'North / Kashmir Valley',
    speakers: '6.8M',
    script: 'Devanagari / Arabic',
    sampleText: 'नमस्कार! इन्डिकवॉइसेस एआई मॉडलन मंज़ छु त्वहि खुश आमदीद।',
    romanized: 'Namaskar! IndicVoices AI modelan manz chhu twahi khush aamdeed.'
  },
  {
    code: 'sat-IN',
    name: 'Santali',
    native: 'ᱥᱟᱱᱛᱟᱲᱤ',
    region: 'East / Jharkhand & Bengal',
    speakers: '7.3M',
    script: 'Ol Chiki',
    sampleText: 'ᱡᱚᱦᱟᱨ! ᱤᱱᱰᱤᱠᱵᱷᱚᱭᱥᱮᱥ ᱮᱟᱭ ᱢᱚᱰᱮᱞ ᱨᱮ ᱟᱯᱮᱭᱟᱜ ᱥᱟᱜᱩᱱ ᱫᱟᱨᱟᱢ।',
    romanized: 'Johar! IndicVoices AI model re apeyag sagun daram.'
  },
  {
    code: 'sd-IN',
    name: 'Sindhi',
    native: 'सिन्धी / سنڌي',
    region: 'West / Pan-India',
    speakers: '2.8M',
    script: 'Devanagari / Arabic',
    sampleText: 'नमस्ते! इन्डिकवॉइसेस एआई मॉडेल्स में तव्हांजो स्वागत आहे।',
    romanized: 'Namaste! IndicVoices AI models me tavhanjo swagat aahe.'
  }
];

export interface IndicPersona {
  id: string;
  name: string;
  gender: string;
  age: string;
  lang: string;
  accent: string;
  tag: string;
  defaultEmotion: string;
  pitch: number;
  rate: number;
  avatar: string;
  description: string;
  isIndicVoices: boolean;
}

export function getIndicPersona(langCode: string): IndicPersona {
  const langObj = INDICVOICES_LANGUAGES.find((l) => l.code === langCode) || INDICVOICES_LANGUAGES[0];
  return {
    id: `indicvoices_${langObj.code}`,
    name: `IndicVoices ${langObj.name}`,
    gender: 'Multilingual Native Voice',
    age: 'Adult Native Speaker',
    lang: langObj.code,
    accent: `${langObj.name} (IndicVoices AI4Bharat)`,
    tag: `${langObj.region} • ${langObj.script} Script`,
    defaultEmotion: 'natural',
    pitch: 1.0,
    rate: 1.0,
    avatar: '🇮🇳',
    description: `AI4Bharat IndicVoices trained acoustic model for ${langObj.name} (${langObj.speakers} speakers, ${langObj.script} script).`,
    isIndicVoices: true
  };
}
