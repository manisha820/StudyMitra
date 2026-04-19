import { GoogleGenAI, Type } from "@google/genai";
import { Message, Subject, TimetableEntry, DailyRoutine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askProfessor(query: string, history: Message[] = []) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are "Mitra", the expert Study Coach for the StudyMitra app. 
        Your mission is to help students achieve academic excellence through structured planning and effective study techniques.
        
        CRITICAL: All information you provide must be strictly factual, realistic, and verified. 
        You have access to Google Search to gather up-to-date and trusted information for the search queries asked by students.
        Use it whenever you are explaining real-world topics, academic concepts, or gathering resources.
        Never hallucinate. If you are unsure, use the search tool to verify.
        
        Focus on:
        1. Subject-specific strategies (how to tackle hard vs easy subjects).
        2. Unit-wise preparation techniques.
        3. Revision and retention tips.
        Explanations should be simple, encouraging, and exam-oriented.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const response = await chat.sendMessage({
      message: query
    });

    return response.text || "I'm here to help! Let me try that again.";
  } catch (error) {
    console.error("Coach Error:", error);
    return "I'm currently optimizing my teaching modules with trusted sources. Just a moment!";
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

export async function generateSmartTimetable(
  subjects: Subject[],
  routine: DailyRoutine,
  examDate: string
): Promise<TimetableEntry[]> {
  try {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

    const prompt = `You are an expert academic planner. Your job is to build a personalized, realistic 7-day study timetable for a student.

## STUDENT PROFILE
- Wake-up time: ${routine.wakeUpTime}
- Sleep time: ${routine.sleepTime}
- Preferred study session length: ${routine.preferredSessionLength} minutes
- Break between sessions: ${routine.breakBetweenSessions} minutes
- Maximum daily study hours: ${routine.maxDailyStudyHours} hours
- Exam Date: ${examDate}

## FIXED DAILY COMMITMENTS (these time slots are BLOCKED — you must NOT place any study session here)
${routine.commitments.map(c =>
  `• ${c.label} (${c.type}): ${c.startTime}–${c.endTime} on days: ${c.days.join(', ')}`
).join('\n')}

## SUBJECTS TO STUDY
${subjects.map(s => {
  const allTopics = s.units.flatMap(u => u.topics.filter(t => !t.isCompleted).map(t => t.name));
  return `• ${s.name} [${s.difficulty} difficulty] — pending topics: ${allTopics.join(', ') || 'general revision'}`;
}).join('\n')}

## RULES
1. ONLY place study sessions in FREE time windows that fall between wake-up (${routine.wakeUpTime}) and sleep time (${routine.sleepTime}).
2. NEVER overlap with any fixed commitment.
3. Allocate MORE sessions to subjects marked 'hard', FEWER to 'easy'.
4. Respect the preferred session length of ${routine.preferredSessionLength} minutes. Sessions can be slightly shorter if the free slot is tight, but never longer.
5. Leave at least ${routine.breakBetweenSessions} minutes between consecutive study sessions.
6. Do not exceed ${routine.maxDailyStudyHours} hours of total study per day.
7. Distribute subjects evenly across the week — avoid cramming one subject repeatedly.
8. Use specific topic names from the subject's pending topics list as the topicName.
9. Times must be in HH:MM 24-hour format (e.g. "09:00", "14:30").
10. Days must be exactly one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
11. Generate only REALISTIC, non-overlapping entries. Think carefully before placing each session.

Return ONLY a JSON array — no markdown, no explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subjectName: { type: Type.STRING },
              topicName:   { type: Type.STRING },
              startTime:   { type: Type.STRING },
              endTime:     { type: Type.STRING },
              day:         { type: Type.STRING }
            },
            required: ["subjectName", "topicName", "startTime", "endTime", "day"]
          }
        }
      }
    });

    const raw = JSON.parse(response.text) as Omit<TimetableEntry, 'id' | 'subjectId'>[];

    // Hydrate with IDs and subjectId
    return raw.map((entry, i) => ({
      ...entry,
      id: `smart-${Date.now()}-${i}`,
      subjectId: subjects.find(s => s.name === entry.subjectName)?.id ?? '',
      day: days.includes(entry.day) ? entry.day : days[i % 7],
    })) as TimetableEntry[];
  } catch (error) {
    console.error("Smart Timetable AI Error:", error);
    return [];
  }
}
