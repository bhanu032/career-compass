// Script Templates and Presets Library for AuraVoice Studio
// Categorized by themes: Indian Heritage, Tech & AI, Motivation, Peace/Meditation, Bollywood Dialogues

export interface HindiParagraph {
  id: string;
  title: string;
  category: string;
  text: string;
  preview: string;
}

export const HINDI_PARAGRAPHS: HindiParagraph[] = [
  {
    id: 'hindi_heritage',
    title: 'भारतीय संस्कृति और धरोहर',
    category: 'Cultural Heritage',
    text: 'भारतवर्ष विविधताओं का देश है। यहाँ विभिन्न भाषाओं, संस्कृतियों और परंपराओं का अद्भुत संगम देखने को मिलता है। हमारी भाषाएँ और विचार ही हमारी असली पहचान हैं!',
    preview: 'भारतवर्ष विविधताओं का देश है...'
  },
  {
    id: 'hindi_tech_ai',
    title: 'तकनीक और एआई क्रांति',
    category: 'Technology & AI',
    text: 'तकनीक और कृत्रिम बुद्धिमत्ता के क्षेत्र में भारत तेजी से आगे बढ़ रहा है। आज हमारी अपनी भारतीय भाषाएं डिजिटल दुनिया में नए आयाम स्थापित कर रही हैं। यह एक नए डिजिटल भारत का उदय है!',
    preview: 'तकनीक और कृत्रिम बुद्धिमत्ता के क्षेत्र में...'
  },
  {
    id: 'hindi_motivational',
    title: 'सफलता और प्रेरणा',
    category: 'Motivation & Success',
    text: 'सफलता का कोई छोटा रास्ता नहीं होता। जब इरादे पक्के हों और मेहनत में सच्चाई हो, तो हर कठिन लक्ष्य हासिल किया जा सकता है। अपने सपनों पर विश्वास रखो और निरंतर प्रयास करते रहो!',
    preview: 'सफलता का कोई छोटा रास्ता नहीं होता...'
  },
  {
    id: 'hindi_peace_calm',
    title: 'शांति और ध्यान',
    category: 'Mindfulness & Meditation',
    text: 'शांत और एकाग्र मन से हर समस्या का समाधान मिल जाता है। गहरी सांस लें और अपने विचारों को स्थिर करें। शांति, आत्मविश्वास और सकारात्मकता ही जीवन का मूल आधार हैं।',
    preview: 'शांत और एकाग्र मन से हर समस्या का समाधान...'
  },
  {
    id: 'hindi_govt_jobs',
    title: 'सरकारी भर्ती व परीक्षा मार्गदर्शन',
    category: 'Career & Examination',
    text: 'करियर कम्पास पर आपका स्वागत है। यहाँ आपको यूपीएससी, एसएससी, रेलवे, बैंकिंग और सभी राज्य स्तरीय सरकारी भर्तियों की सटीक जानकारी, मॉक टेस्ट और निःशुल्क मार्गदर्शन मिलता है।',
    preview: 'करियर कम्पास पर आपका स्वागत है...'
  },
  {
    id: 'hindi_bollywood_hero',
    title: 'नाटकीय संवाद (Dramatic Dialogue)',
    category: 'Dramatic & Entertainment',
    text: 'असली जीत वो नहीं जो आसानी से मिल जाए। असली मज़ा तो तब है जब मुश्किलें सामने हों और आप अपनी मेहनत से इतिहास रच दें! क्या आप अपनी सफलता के लिए तैयार हैं?',
    preview: 'असली जीत वो नहीं जो आसानी से मिल जाए...'
  }
];

export const EMOTION_PRESETS = [
  { id: 'natural', label: 'Natural (स्वाभाविक)', pitch: 1.0, rate: 1.0, color: 'text-cyan-500' },
  { id: 'dramatic', label: 'Dramatic (नाटकीय)', pitch: 1.15, rate: 1.05, color: 'text-purple-500' },
  { id: 'energetic', label: 'Energetic (ऊर्जावान)', pitch: 1.25, rate: 1.2, color: 'text-amber-500' },
  { id: 'calm', label: 'Calm / Serene (शांत)', pitch: 0.9, rate: 0.85, color: 'text-emerald-500' },
  { id: 'authoritative', label: 'Authoritative (गंभीर)', pitch: 0.85, rate: 0.95, color: 'text-rose-500' },
  { id: 'whispering', label: 'Whisper (फुसफुसाहट)', pitch: 1.0, rate: 0.9, color: 'text-blue-400' }
];
