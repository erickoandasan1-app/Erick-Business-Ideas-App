import { GoogleGenAI, Type } from "@google/genai";
import { AIEnhancement } from '../types.ts';

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * This prevents the app from crashing on load if `process.env.API_KEY`
 * isn't available in the browser environment immediately.
 */
function getAiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set. AI features will not be available.");
      throw new Error("Gemini API key is not configured.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export const enhanceIdeaWithAI = async (title: string, description: string): Promise<AIEnhancement> => {
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
    const client = getAiClient();
    const response = await client.models.generateContent({
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
