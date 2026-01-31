import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const SYSTEM_INSTRUCTION = `Role: You are Mentra, a supportive, grounded, and human peer. You help users find their path by listening first.

The Golden Rule: Never explain your process. Never mention umbrellas in the first message. Never say you are here to "help figure things out" or "identify categories." Just be present.

Communication Rules:
- Maximum 20 words for the first reply. Keep it short and human.
- No em dashes: Never use em dashes (—). Use commas, periods, or colons.
- No Asterisks or Bolding: Do not use **bold** or *italics*. The user hates seeing asterisks in the text.
- No Forced Emphasis: Do not use ALL CAPS for emphasis. Speak naturally.
- No AI-speak: Avoid "headspace," "manageable," "To get us started," "how can I assist," or "process."

The Natural Flow:
1. The Initial Greeting: If the user says hi, just say hi back warmly and ask a short, casual question about their day.
2. The Mirror Technique: Reflect what the user says in your own words so they feel heard.
3. Building the Umbrella: Only mention an umbrella category (like the Nervous Umbrella or Emotional Umbrella) once the user has described actual symptoms. Weave it in naturally as a comparison, not a diagnosis.
4. Transitions: Use soft phrases like "I'm wondering" or "Does that feel right?"

Internal Reference (Do not list these to the user):
- Mood Disorders (Emotional Umbrella)
- Anxiety (Nervous Umbrella)
- Trauma (Impact Umbrella)
- Reality (Reality Umbrella)
- Cognitive (Functional Umbrella)
- Personality (Identity Umbrella)

Safety: If the user mentions self-harm or crisis, drop the persona and provide immediate professional crisis resources.`;

export class GeminiService {
  // Pool of API keys to cycle through to mitigate rate limits
  private apiKeys: string[];
  private currentKeyIndex = 0;
  private ai: GoogleGenAI;

  constructor() {
    // Attempt to collect multiple keys from environment for rotation
    this.apiKeys = [
      process.env.API_KEY || '',
      (process.env as any).API_KEY_2 || '',
      (process.env as any).API_KEY_3 || '',
      (process.env as any).API_KEY_4 || '',
      (process.env as any).API_KEY_5 || ''
    ].filter(key => key.length > 0);

    // Initialize with the first key
    this.ai = new GoogleGenAI({ apiKey: this.apiKeys[this.currentKeyIndex] || process.env.API_KEY || '' });
  }

  /**
   * Rotates to the next available API key in the pool and re-initializes the client
   */
  private rotateKey() {
    if (this.apiKeys.length <= 1) return;
    
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    const nextKey = this.apiKeys[this.currentKeyIndex];
    
    // Re-initialize Gemini with the fresh key
    this.ai = new GoogleGenAI({ apiKey: nextKey });
    console.debug(`🔄 API limit hit. Switched to key #${this.currentKeyIndex + 1} of ${this.apiKeys.length}`);
  }

  /**
   * Helper to perform API calls with rotation and exponential backoff for quota errors
   */
  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || '';
        const isQuotaError = errorMessage.includes('429') || 
                            errorMessage.includes('quota') || 
                            errorMessage.includes('RESOURCE_EXHAUSTED');
        
        if (isQuotaError) {
          // If multiple keys are available, swap keys immediately and try again
          if (this.apiKeys.length > 1 && i < this.apiKeys.length) {
            this.rotateKey();
            // Brief pause to allow the environment to stabilize
            await new Promise(r => setTimeout(r, 250));
            continue;
          }

          // If rotation is exhausted or only one key exists, perform exponential backoff
          if (i < maxRetries - 1) {
            const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        throw error;
      }
    }
    throw lastError;
  }

  async getResponse(history: {role: string, content: string}[]): Promise<string> {
    return this.withRetry(async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.8,
        }
      });
      return response.text || "Hey. I'm listening.";
    });
  }

  async analyzeMentalState(history: string): Promise<AnalysisResponse> {
    return this.withRetry(async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Final Triage Reveal. Provide the final reveal in JSON format.
        
        Conversation: ${history}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suggestedAction: { type: Type.STRING },
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    specialty: { type: Type.STRING },
                    matchScore: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                    imageUrl: { type: Type.STRING }
                  },
                  required: ["name", "specialty", "matchScore", "description", "imageUrl"]
                }
              }
            },
            required: ["summary", "matches", "suggestedAction"]
          }
        }
      });

      const text = response.text || "";
      try {
        return JSON.parse(text) as AnalysisResponse;
      } catch (e) {
        console.error("Failed to parse analysis response", e);
        throw new Error("Analysis failed");
      }
    });
  }
}

export const geminiService = new GeminiService();