export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic = {
  id: string;
  name: string;
  isCompleted: boolean;
};

export type Unit = {
  id: string;
  name: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  name: string;
  difficulty: Difficulty;
  units: Unit[];
};

export type TimetableEntry = {
  id: string;
  subjectId: string;
  subjectName: string;
  topicName: string;
  startTime: string;
  endTime: string;
  day: string; // e.g. "Monday"
};

export type StudySession = {
  id: string;
  subjectId: string;
  date: string;
  minutes: number;
};

export type Message = {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};

export type Screen = 'dashboard' | 'syllabus' | 'planner' | 'coach' | 'timer' | 'analytics';
