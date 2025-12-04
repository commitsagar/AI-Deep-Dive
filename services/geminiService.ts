
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export async function getAccessoryRecommendations(dressImageBase64: string, preferences?: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const imagePart = fileToGenerativePart(dressImageBase64.split(',')[1], dressImageBase64.split(';')[0].split(':')[1]);
    
    let prompt = `You are a world-class fashion stylist. Analyze the dress in the image. 
    1.  **Describe the dress:** Briefly describe its style, color, fabric, and pattern.
    2.  **Recommend Accessories:** Suggest a list of complementary items including shoes, a handbag, and jewelry (earrings, necklace, bracelet). Explain why each item complements the dress.
    3.  **Occasions:** List 2-3 occasions where this outfit would be appropriate.
    
    Format your response in clear, readable markdown. Use headings and bullet points.`;
    
    if (preferences && preferences.trim().length > 0) {
        prompt += `\n\n**User Preferences:** Please tailor your recommendations based on the following user preferences: "${preferences}". If a preference doesn't work well with the dress, please explain why and suggest a better alternative that still aligns with the user's desired style.`;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, { text: prompt }] },
    });

    return response.text;
}

export async function generateVirtualTryOn(userImageBase64: string, dressImageBase64: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    const userImagePart = fileToGenerativePart(userImageBase64.split(',')[1], userImageBase64.split(';')[0].split(':')[1]);
    const dressImagePart = fileToGenerativePart(dressImageBase64.split(',')[1], dressImageBase64.split(';')[0].split(':')[1]);

    const prompt = `Take the dress from the second image and realistically place it on the person in the first image. 
    The person's pose and background should be preserved as much as possible. 
    The focus is on accurately rendering the dress on their body, including fabric drape and fit.
    The final image should only contain the person wearing the new dress. Do not include any text or artifacts.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: { parts: [userImagePart, dressImagePart, { text: prompt }] },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("Image generation failed. No image data received.");
}

export async function getDressDescription(dressImageBase64: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const imagePart = fileToGenerativePart(dressImageBase64.split(',')[1], dressImageBase64.split(';')[0].split(':')[1]);
    
    const prompt = `Briefly describe the dress in the image in one or two sentences. Focus on its main characteristics like color, style, and pattern. This description will be used as context for a fashion chatbot. Example: "A knee-length, A-line blue dress with a floral pattern and short sleeves."`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, { text: prompt }] },
    });

    return response.text;
}


export function createStylistChat(dressDescription: string): Chat {
  const model = 'gemini-2.5-flash';
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are an expert fashion stylist. A user has provided an image of a dress, which is described as: "${dressDescription}". 
      Your role is to answer their questions about the dress's suitability for various occasions, weather, and provide styling advice. 
      Be friendly, helpful, and provide detailed, actionable advice.`,
    },
  });
  return chat;
}
