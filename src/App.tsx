import { useState, useEffect } from 'react';
import { Screen, Subject, TimetableEntry, StudySession } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SyllabusManager from './components/SyllabusManager';
import Planner from './components/Planner';
import Pomodoro from './components/Pomodoro';
import MitraCoach from './components/MitraCoach';
import Analytics from './components/Analytics';
import Login from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, LogOut, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // App State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // 1. Listen for Supabase Auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data when user is logged in
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch Subjects with nested Relations (units, topics)
        const { data: subData } = await supabase
          .from('subjects')
          .select(`
            id, name, difficulty,
            units ( id, name, topics ( id, name, is_completed ) )
          `);
        
        if (subData) {
          // ensure sorting or default empty arrays if postgrest returns null for empty relations
          const parsedSubjects = subData.map((s: any) => ({
            id: s.id,
            name: s.name,
            difficulty: s.difficulty,
            units: (s.units || []).map((u: any) => ({
              id: u.id,
              name: u.name,
              topics: u.topics || []
            }))
          }));
          setSubjects(parsedSubjects);
        }

        const { data: timeData } = await supabase.from('timetable_entries').select('*');
        if (timeData) {
          setTimetable(timeData.map(t => ({
            id: t.id,
            subjectId: t.subject_id,
            subjectName: t.subject_name,
            topicName: t.topic_name,
            startTime: t.start_time.substring(0, 5), // 'HH:MM:SS' -> 'HH:MM'
            endTime: t.end_time.substring(0, 5),
            day: t.day_of_week
          })));
        }

        const { data: sessData } = await supabase.from('study_sessions').select('*');
        if (sessData) {
          setSessions(sessData.map(s => ({
            id: s.id,
            subjectId: s.subject_id,
            date: s.session_date,
            minutes: s.minutes_studied
          })));
        }
      } catch (e) {
        console.error("Data fetch error", e);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSessionComplete = async (session: StudySession) => {
    // Optimistic update
    setSessions(prev => [...prev, session]);
    setActiveScreen('analytics');
    
    // Remote Database update
    if (user) {
      await supabase.from('study_sessions').insert({
        id: session.id,
        user_id: user.id,
        subject_id: session.subjectId,
        session_date: new Date().toISOString(),
        minutes_studied: session.minutes
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-primary"><Loader2 size={32} className="animate-spin" /></div>;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
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
          {isDataLoading && <Loader2 size={14} className="text-primary animate-spin ml-2" />}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-slate-400 max-w-[100px] truncate">{user.email}</div>
          <div className="flex -space-x-2">
            {[1].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
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
              <SyllabusManager user={user} subjects={subjects} setSubjects={setSubjects} />
            )}
            {activeScreen === 'planner' && (
              <Planner 
                user={user}
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
                activeSubjectId={subjects[0]?.id}
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
