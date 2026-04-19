import { GoogleGenAI, Type } from "@google/genai";
import { Message, Subject, TimetableEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askProfessor(query: string, history: Message[] = []) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are "Mitra", the expert Study Coach for the StudyMitra app. 
        Your mission is to help students achieve academic excellence through structured planning and effective study techniques.
        Focus on:
        1. Subject-specific strategies (how to tackle hard vs easy subjects).
        2. Unit-wise preparation techniques.
        3. Revision and retention tips.
        Explanations should be simple, encouraging, and exam-oriented.`,
      }
    });

    const response = await chat.sendMessage({
      message: query
    });

    return response.text || "I'm here to help! Let me try that again.";
  } catch (error) {
    console.error("Coach Error:", error);
    return "I'm currently optimizing my teaching modules. Just a moment!";
  }
}

export async function generateTimetable(subjects: Subject[], examDate: string) {
  try {
    const prompt = `Generate a realistic study timetable based on these subjects: ${JSON.stringify(subjects)}.
    Exam Date: ${examDate}.
    Difficulty levels are provided. Allocate more time to 'hard' subjects.
    Focus on specific topics from the units.
    Return a list of daily slots for the next 7 days in a clean JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subjectName: { type: Type.STRING },
              topicName: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              day: { type: Type.STRING }
            },
            required: ["subjectName", "topicName", "startTime", "endTime", "day"]
          }
        }
      }
    });

    return JSON.parse(response.text) as TimetableEntry[];
  } catch (error) {
    console.error("Timetable AI Error:", error);
    return [];
  }
}
