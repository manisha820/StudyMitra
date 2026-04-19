import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Target, Zap, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { Subject, StudySession } from '../types';
import { cn } from '../lib/utils';

type Props = {
  subjects: Subject[];
  sessions: StudySession[];
};

export default function Analytics({ subjects, sessions }: Props) {
  // Calculate total hours
  const totalMinutes = sessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Group by subject
  const subjectData = subjects.map(s => {
    const minutes = sessions
      .filter(sess => sess.subjectId === s.id)
      .reduce((acc, sess) => acc + sess.minutes, 0);
    return { name: s.name, minutes, hours: (minutes / 60).toFixed(1) };
  }).filter(d => d.minutes > 0);

  // Completion calculation
  const totalTopics = subjects.reduce((acc, s) => acc + s.units.reduce((uAcc, u) => uAcc + u.topics.length, 0), 0);
  const completedTopics = subjects.reduce((acc, s) => acc + s.units.reduce((uAcc, u) => uAcc + u.topics.filter(t => t.isCompleted).length, 0), 0);
  const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Streak calculation (mock for now based on session dates)
  const streak = sessions.length > 0 ? 5 : 0;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 pb-32 space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900">Statistics</h1>
        <p className="text-slate-500">Track your progress and growth over time.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: `${totalHours}h`, icon: Clock, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Completion', value: `${completionRate}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Streak', value: `${streak}d`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Topics Done', value: completedTopics, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{stat.label}</div>
              <div className="text-2xl font-black text-slate-800">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Time Allocation Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Time Allocation</h3>
          <div className="h-64 mt-4">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <ReTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                No study data yet.
              </div>
            )}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Growth Areas</h3>
          <div className="space-y-4">
            {subjects.length > 0 ? subjects.map((s, i) => {
              const comp = s.units.reduce((acc, u) => acc + u.topics.filter(t => t.isCompleted).length, 0);
              const total = s.units.reduce((acc, u) => acc + u.topics.length, 0);
              const prg = total > 0 ? Math.round((comp / total) * 100) : 0;
              
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-600">{s.name}</span>
                    <span className="text-xs font-bold text-slate-400">{prg}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        prg < 30 ? "bg-red-400" : prg < 70 ? "bg-amber-400" : "bg-emerald-400"
                      )}
                      style={{ width: `${prg}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="py-10 text-center text-slate-300 italic text-sm">
                Add subjects to track focus.
              </div>
            )}
          </div>
        </div>
      </div>

      {subjects.some(s => s.difficulty === 'hard' && s.units.every(u => u.topics.every(t => !t.isCompleted))) && (
         <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4 items-start">
            <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-amber-900">Next Focus Suggestion</h4>
              <p className="text-sm text-amber-700/80 leading-relaxed">
                You haven't started any hard subjects yet. Mitra recommends tackling a session of {subjects.find(s => s.difficulty === 'hard')?.name} today to build momentum.
              </p>
            </div>
         </div>
      )}
    </div>
  );
}
