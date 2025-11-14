
import { GoogleGenAI, Type } from "@google/genai";
import { AIEnhancement } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not be available.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const enhanceIdeaWithAI = async (title: string, description: string): Promise<AIEnhancement> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const prompt = `
    Analyze the following business idea and provide enhancements.
    Title: "${title}"
    Description: "${description}"

    Your tasks are:
    1.  Rewrite the description to be more compelling, clear, and professional. Make it concise but impactful.
    2.  Suggest a primary target market for this idea. Be specific.
    3.  Provide a realistic potential annual revenue estimation (e.g., "$50k - $100k", "startup phase, pre-revenue", "$1M+").

    Return the response in a structured JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "The enhanced, compelling description of the business idea.",
            },
            targetMarket: {
              type: Type.STRING,
              description: "The suggested primary target market for the idea.",
            },
            potentialRevenue: {
              type: Type.STRING,
              description: "A realistic potential annual revenue estimation.",
            },
          },
          required: ["description", "targetMarket", "potentialRevenue"],
        },
      },
    });

    const jsonText = response.text.trim();
    // In case the response is wrapped in markdown ```json ... ```
    const cleanJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const enhancedData = JSON.parse(cleanJsonText);
    
    return enhancedData as AIEnhancement;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get enhancement from AI. The model may be overloaded or the prompt was blocked.");
  }
};
