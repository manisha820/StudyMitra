/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Screen, Subject, TimetableEntry, StudySession } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SyllabusManager from './components/SyllabusManager';
import Planner from './components/Planner';
import Pomodoro from './components/Pomodoro';
import MitraCoach from './components/MitraCoach';
import Analytics from './components/Analytics';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  
  // State with persistence
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('study-mitra-subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('study-mitra-timetable');
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('study-mitra-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('study-mitra-subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('study-mitra-timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('study-mitra-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSessionComplete = (session: StudySession) => {
    setSessions(prev => [...prev, session]);
    setActiveScreen('analytics'); // Go to stats to see growth
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Header based on screen could be here, but components handle their own titles */}
      
      {/* Brand Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveScreen('dashboard')}
        >
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Sparkles size={18} className="fill-current" />
          </div>
          <span className="font-headline font-black text-xl text-slate-900 tracking-tighter">StudyMitra</span>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
               <img src={`https://picsum.photos/seed/stud${i}/100/100`} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1"
          >
            {activeScreen === 'dashboard' && (
              <Dashboard 
                subjects={subjects} 
                timetable={timetable} 
                sessions={sessions} 
                onNavigate={setActiveScreen} 
              />
            )}
            {activeScreen === 'syllabus' && (
              <SyllabusManager subjects={subjects} setSubjects={setSubjects} />
            )}
            {activeScreen === 'planner' && (
              <Planner 
                subjects={subjects} 
                timetable={timetable} 
                setTimetable={setTimetable} 
              />
            )}
            {activeScreen === 'coach' && (
              <MitraCoach subjects={subjects} />
            )}
            {activeScreen === 'timer' && (
              <Pomodoro 
                activeSubjectId={subjects[0]?.id} // Simple default for demo
                onSessionComplete={handleSessionComplete} 
              />
            )}
            {activeScreen === 'analytics' && (
              <Analytics subjects={subjects} sessions={sessions} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
    </div>
  );
}
