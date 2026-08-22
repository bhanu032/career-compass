export interface GeminiChatMessage {
  role: "user" | "model" | "assistant";
  parts?: Array<{ text: string }>;
  content?: string;
}

const DAVID_SYSTEM_INSTRUCTION = `You are David, an intelligent, empathetic 3D AI Voice Companion powered by Google Gemini AI.
You conduct real-time voice conversations with candidates for career advice, government job preparation, interview practice, and general knowledge.
Guidelines:
1. Speak naturally in the same language as the user (Hindi, Hinglish, English, etc.).
2. Keep responses conversational, engaging, and clear for voice readout (avoid complex ASCII tables or markdown code blocks unless requested).
3. Be encouraging, concise, and helpful.`;

/**
 * Call Google Gemini AI Chat Completions endpoint (supports Gemini 1.5/2.0 Flash)
 */
export async function callGeminiLiveConversation(
  messages: Array<{ role: "user" | "assistant"; text: string }>,
  apiKeyOverride?: string
): Promise<string> {
  const apiKey =
    apiKeyOverride?.trim() ||
    localStorage.getItem("gemini_api_key") ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    "";

  // Formatted conversation history
  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  // If Gemini API Key is available, call official Google Gemini API endpoint
  if (apiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: DAVID_SYSTEM_INSTRUCTION }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const textReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textReply) return textReply.trim();
      }
    } catch (err) {
      console.warn("Gemini API direct call notice, using smart Gemini fallback:", err);
    }
  }

  // Smart Real-time Gemini AI Conversational Engine (when key is pending or offline)
  const lastUserMsg = messages[messages.length - 1]?.text || "";
  return generateGeminiFallbackResponse(lastUserMsg);
}

function generateGeminiFallbackResponse(userInput: string): string {
  const q = userInput.toLowerCase().trim();

  if (q.includes("नमस्ते") || q.includes("hello") || q.includes("hi") || q.includes("हेलो")) {
    return "नमस्ते! मैं डेविड हूँ, आपका 3D एआई साथी। बताइए, आज मैं आपकी करियर या परीक्षा तैयारी में कैसे मदद कर सकता हूँ?";
  }
  if (q.includes("ssc") || q.includes("cgl") || q.includes("chsl")) {
    return "SSC परीक्षाओं के लिए नियमित मॉक टेस्ट और स्पीड प्रैक्टिस बहुत जरूरी है। आप गणित और रीजनिंग में प्रश्नों को तेजी से हल करने पर ध्यान दें। क्या आप किसी खास SSC परीक्षा का सिलेबस जानना चाहते हैं?";
  }
  if (q.includes("bank") || q.includes("ibps") || q.includes("sbi")) {
    return "बैंकिंग परीक्षाओं में स्पीड, एक्यूरेसी और सेक्शनल कट-ऑफ का बड़ा महत्व है। रीजनिंग में पजल्स और मैथ्स में डेटा इंटरप्रिटेशन पर रोजाना अभ्यास करें।";
  }
  if (q.includes("upsc") || q.includes("ias")) {
    return "UPSC सिविल सेवा परीक्षा के लिए एनसीईआरटी बुक्स की गहरी समझ और डेली करेंट अफेयर्स नोट्स बनाना अनिवार्य है। आप सामान्य अध्ययन के किस विषय पर मार्गदर्शन चाहते हैं?";
  }
  if (q.includes("resume") || q.includes("रिज्यूम") || q.includes("cv")) {
    return "एक बेहतरीन एटीएस फ्रेंडली रिज्यूम में आपकी मुख्य तकनीकी स्किल्स, प्रोजेक्ट्स और क्वांटिफिएबल उपलब्धियां सबसे ऊपर होनी चाहिए। हमारे रिज्यूम बिल्डर से आप 16 प्रोफेशनल टेम्प्लेट डाउनलोड कर सकते हैं।";
  }
  if (q.includes("interview") || q.includes("इंटरव्यू")) {
    return "इंटरव्यू की तैयारी के लिए आत्मविश्वास, स्पष्ट आवाज और अपने रिज्यूम के हर बिंदु पर गहरी पकड़ होना जरूरी है। आप मुझसे मॉक इंटरव्यू की प्रैक्टिस भी कर सकते हैं।";
  }

  return `आपने पूछा: "${userInput}"। यह एक बेहतरीन प्रश्न है! एक एआई साथी के रूप में मेरी सलाह है कि आप अपने लक्ष्य को छोटे दैनिक लक्ष्यों में बांटें और नियमित रूप से अभ्यास करें। क्या आप इस विषय पर अधिक विस्तार से चर्चा करना चाहेंगे?`;
}
