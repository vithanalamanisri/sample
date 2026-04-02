import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSAnalysis, InterviewQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const aiService = {
  async generateResumeContent(prompt: string): Promise<Partial<ResumeData>> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeATS(resumeText: string, jobDescription: string): Promise<ATSAnalysis> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this resume against the job description. Resume: ${resumeText}. Job Description: ${jobDescription}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            grammarIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            impactSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["score", "feedback", "missingKeywords", "grammarIssues", "impactSuggestions"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  },

  async generateInterviewQuestions(resumeData: ResumeData): Promise<InterviewQuestion[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 interview questions based on this resume: ${JSON.stringify(resumeData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["technical", "hr"] },
              expectedAnswer: { type: Type.STRING },
            },
            required: ["id", "question", "type"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  },
};
