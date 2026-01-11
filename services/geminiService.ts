import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ExplanationData, SearchResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExplanation = async (topic: string): Promise<ExplanationData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Explain the topic: "${topic}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            summary: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING, description: "A single emoji representing this step" },
                },
                required: ["title", "description", "icon"],
              },
            },
            svgDiagram: {
              type: Type.STRING,
              description: "A valid, self-contained <svg> string illustrating the concept. Use a viewBox usually 0 0 800 600. Use flat, modern colors. Ensure text is readable.",
            },
            conceptGraph: {
              type: Type.OBJECT,
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      group: { type: Type.INTEGER },
                    },
                  },
                },
                links: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING },
                      target: { type: Type.STRING },
                      value: { type: Type.INTEGER },
                    },
                  },
                },
              },
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                },
              },
            },
            relatedStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                },
              },
            },
          },
          required: ["topic", "summary", "steps", "svgDiagram", "conceptGraph", "quiz", "relatedStats"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(response.text) as ExplanationData;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateTopicImage = async (topic: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a high-quality, educational illustration explaining: "${topic}". The style should be modern, clean, and suitable for a textbook or documentary.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null; // Fail silently for the UI, main content is more important
  }
};

export const generateTopicVideo = async (topic: string): Promise<string | null> => {
  try {
    // Create a new instance for Veo specifically if key selection is involved,
    // but here we rely on the global env key or the fetch logic below.
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic, educational, abstract visualization explaining: ${topic}. Clear, scientific, high definition, 720p.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    // Fetch with API Key appended
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error("Failed to download video bytes");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Veo Video Error:", error);
    throw error;
  }
};

export const getRelatedResources = async (topic: string, type: 'web' | 'video' = 'web'): Promise<SearchResult[]> => {
  try {
    let prompt = "";
    if (type === 'video') {
      prompt = `Find 3 distinct, high-quality educational YouTube videos specifically about "${topic}". Return the video titles and URLs.`;
    } else {
      prompt = `Find 5 high-quality, educational web resources (articles, documentation, or tutorials) about "${topic}". Do not include videos.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Filter and map chunks that have web data
    const resources = chunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        title: chunk.web!.title,
        url: chunk.web!.uri
      }));

    // Simple deduplication
    const uniqueResources: SearchResult[] = [];
    const seenUrls = new Set<string>();
    
    for (const r of resources) {
        if (!seenUrls.has(r.url)) {
            seenUrls.add(r.url);
            uniqueResources.push(r);
        }
    }
    
    return uniqueResources.slice(0, type === 'video' ? 3 : 5);
  } catch (error) {
    console.error("Grounding API Error:", error);
    return [];
  }
};