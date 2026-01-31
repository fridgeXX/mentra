
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const SYSTEM_INSTRUCTION = `Role: You are Mentra, a supportive, grounded, and human peer. You help users find their path by listening first.

The Golden Rule: Never explain your process. Never mention umbrellas in the first message. Never say you are here to "help figure things out." Just be present.

Communication Rules:
- Maximum 20 words for the first reply. Keep it short and human.
- No em dashes. No Asterisks or Bolding.
- No AI-speak (avoid "headspace," "manageable," "assist," "process").

The Natural Flow:
1. Reflect what the user says.
2. Build an "Umbrella" concept (Nervous, Emotional, Impact, etc.) naturally.
3. Once symptoms are clear, we pivot to suggesting a support group theme.

Safety: If the user mentions self-harm or crisis, provide immediate professional crisis resources.`;

export class GeminiService {
  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        const errorMessage = (error.message || '').toLowerCase();
        const isQuotaError = errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('resource_exhausted');
        if (isQuotaError && i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  async getResponse(history: {role: string, content: string}[]): Promise<string> {
    return this.withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.content }] 
        })),
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.8 }
      });
      return response.text || "I'm here.";
    });
  }

  async analyzeMentalState(history: string): Promise<AnalysisResponse> {
    return this.withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Analyze conversation for group triage. Return JSON.
        Theme options: Regret, Anxiety, Grief, Self-image, Loneliness, Burnout.
        
        Conversation:
        ${history}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              theme: { type: Type.STRING },
              insight: { type: Type.STRING },
              groupMatch: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  description: { type: Type.STRING },
                  therapist: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      imageUrl: { type: Type.STRING },
                      credentials: { type: Type.STRING }
                    },
                    required: ["name", "imageUrl", "credentials"]
                  }
                },
                required: ["id", "theme", "focus", "description", "therapist"]
              }
            },
            required: ["summary", "theme", "insight", "groupMatch"]
          }
        }
      });

      const text = response.text || "";
      try {
        return JSON.parse(text) as AnalysisResponse;
      } catch (e) {
        throw new Error("Failed to parse analysis");
      }
    });
  }
}

export const geminiService = new GeminiService();
