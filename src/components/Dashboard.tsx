import { LayoutDashboard, Timer, Calendar, BookOpen, ChevronRight, Zap, Trophy, Goal, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Subject, TimetableEntry, Screen, StudySession } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

type Props = {
  subjects: Subject[];
  timetable: TimetableEntry[];
  sessions: StudySession[];
  onNavigate: (screen: Screen) => void;
};

export default function Dashboard({ subjects, timetable, sessions, onNavigate }: Props) {
  const today = format(new Date(), 'EEEE');
  const todaysTasks = timetable.filter(e => e.day === today);

  // Stats
  const totalTopics = subjects.reduce((acc, s) => acc + s.units.reduce((uAcc, u) => uAcc + u.topics.length, 0), 0);
  const completedTopics = subjects.reduce((acc, s) => acc + s.units.reduce((uAcc, u) => uAcc + u.topics.filter(t => t.isCompleted).length, 0), 0);
  const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Smart Recommendation Logic
  let nextRecommendation = null;
  const hardSubjects = subjects.filter(s => s.difficulty === 'hard');
  for (const sub of hardSubjects) {
     const pendingTopic = sub.units.flatMap(u => u.topics).find(t => !t.isCompleted);
     if (pendingTopic) {
        nextRecommendation = { subject: sub.name, topic: pendingTopic.name };
        break;
     }
  }
  if (!nextRecommendation) {
    const defaultPending = subjects.flatMap(s => s.units.flatMap(u => u.topics)).find(t => !t.isCompleted);
    if (defaultPending) nextRecommendation = { subject: "Any Subject", topic: defaultPending.name };
  }

  return (
    <div className="p-6 pb-32 space-y-10 max-w-7xl mx-auto">
      {/* Hero / Welcome */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-slate-900 tracking-tight">
            Hi There!
          </h1>
          <p className="text-slate-500 text-lg">
            Ready to crush your study goals today?
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl text-white flex items-center gap-6 min-w-[300px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="fill-transparent stroke-white/10 stroke-8" />
              <motion.circle 
                cx="32" cy="32" r="28" 
                className="fill-transparent stroke-primary stroke-8 stroke-linecap-round"
                initial={{ strokeDashoffset: 176 }}
                animate={{ strokeDashoffset: 176 * (1 - completionRate / 100) }}
                style={{ strokeDasharray: 176 }}
              />
            </svg>
            <span className="text-xs font-black">{completionRate}%</span>
          </div>
          <div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Total Mastery</div>
            <div className="text-xl font-bold font-headline">{completedTopics} / {totalTopics} Topics</div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Planner (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Today's Plan</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{today}, {format(new Date(), 'dd MMMM')}</p>
              </div>
              <button 
                onClick={() => onNavigate('planner')}
                className="p-4 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {todaysTasks.length > 0 ? todaysTasks.map((entry, i) => (
                <div key={i} className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-3xl group border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 font-bold shadow-sm group-hover:text-primary transition-colors">
                    {entry.startTime.split(':')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-primary/60">{entry.subjectName}</div>
                    <h4 className="font-bold text-slate-800 text-lg">{entry.topicName}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">{entry.endTime}</div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center space-y-4 bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-100">
                   <Calendar size={48} className="mx-auto text-slate-100" />
                   <p className="text-slate-400 font-medium italic text-sm">No tasks for today. Head to Planner to create a schedule!</p>
                   <button 
                    onClick={() => onNavigate('planner')}
                    className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                   >
                     Setup Plan
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => onNavigate('timer')}
              className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/10 flex flex-col justify-between min-h-[220px] text-left group hover:scale-[1.02] transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center p-3">
                <Timer size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-1">Focus Timer</h3>
                <p className="text-white/70 text-sm">Start a 25min Pomodoro session now.</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('syllabus')}
              className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/10 flex flex-col justify-between min-h-[220px] text-left group hover:scale-[1.02] transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center p-3">
                <BookOpen size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-1">My Syllabus</h3>
                <p className="text-white/70 text-sm">Review subjects, units and topics.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Mitra AI Tip */}
          <div 
            onClick={() => onNavigate('coach')}
            className="bg-purple-50 p-8 rounded-[2.5rem] border border-purple-100 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-600 rounded-xl text-white">
                <Zap size={20} className="fill-current" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Mitra's Advice</h4>
            </div>
            <p className="text-slate-600 italic text-sm leading-relaxed mb-6">
              "Focusing on your hardest subjects before noon can improve your retention by up to 40%."
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
              Talk to Mitra <ChevronRight size={14} />
            </div>
          </div>

          {/* Smart Recommendation Widget */}
          {nextRecommendation && (
             <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <AlertCircle size={80} className="text-amber-500" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">
                   <AlertCircle size={16} /> Action Required
                 </div>
                 <h4 className="text-2xl font-black text-amber-950 mb-2 leading-tight">Focus on {nextRecommendation.subject}</h4>
                 <p className="text-amber-800/80 text-sm font-medium mb-6">
                   You're falling behind on <strong className="text-amber-900">{nextRecommendation.topic}</strong>. Dedicate your next Pomodoro session here.
                 </p>
                 <button 
                  onClick={() => onNavigate('timer')}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all w-full"
                 >
                   Start Session
                 </button>
               </div>
             </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h4 className="text-center font-black uppercase tracking-widest text-xs text-slate-300">Milestones</h4>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Trophy size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Streak</div>
                  <div className="text-xl font-bold font-headline">5 Days</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Goal size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Study Hours</div>
                  <div className="text-xl font-bold font-headline">{(sessions.reduce((acc, s) => acc + s.minutes, 0) / 60).toFixed(1)}h</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('analytics')}
              className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
            >
              Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
