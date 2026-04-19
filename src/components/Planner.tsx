import { useState } from 'react';
import { Calendar, Download, Sparkles, Clock, Trash2, Plus, X, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject, TimetableEntry, DailyRoutine, Commitment, CommitmentType } from '../types';
import { generateSmartTimetable } from '../services/aiService';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

type Props = {
  user: any;
  subjects: Subject[];
  timetable: TimetableEntry[];
  setTimetable: (entries: TimetableEntry[]) => void;
};

export default function Planner({ user, subjects, timetable, setTimetable }: Props) {
  const [examDate, setExamDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [setupMode, setSetupMode] = useState(false);

  const [routine, setRoutine] = useState<DailyRoutine>({
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    commitments: [],
    preferredSessionLength: 60,
    breakBetweenSessions: 15,
    maxDailyStudyHours: 6
  });

  const handleGenerate = async () => {
    if (subjects.length === 0) {
      alert('Please add subjects in the Syllabus section first.');
      return;
    }
    setIsGenerating(true);
    const newTimetable = await generateSmartTimetable(subjects, routine, examDate);
    setTimetable(newTimetable);
    
    if (user) {
      try {
        await supabase.from('timetable_entries').delete().eq('user_id', user.id);
        const inserts = newTimetable.map(t => ({
          id: t.id,
          user_id: user.id,
          subject_id: t.subjectId,
          subject_name: t.subjectName,
          topic_name: t.topicName,
          start_time: t.startTime,
          end_time: t.endTime,
          day_of_week: t.day
        }));
        await supabase.from('timetable_entries').insert(inserts);
      } catch (err) {
        console.error("Failed syncing timetable to cloud", err);
      }
    }
    
    setIsGenerating(false);
    setSetupMode(false);
  };

  const exportPDF = async () => {
    const element = document.getElementById('timetable-content');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`StudyMitra_Timetable_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const deleteEntry = async (id: string) => {
    setTimetable(timetable.filter(e => e.id !== id));
    if (user) {
      await supabase.from('timetable_entries').delete().eq('id', id);
    }
  };

  const addCommitment = () => {
    const newCommitment: Commitment = {
      id: Date.now().toString(),
      label: 'New Commitment',
      type: 'other',
      startTime: '10:00',
      endTime: '12:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    };
    setRoutine({ ...routine, commitments: [...routine.commitments, newCommitment] });
  };

  const removeCommitment = (id: string) => {
    setRoutine({ ...routine, commitments: routine.commitments.filter(c => c.id !== id) });
  };

  const groupedByDay = timetable.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-6 pb-32 space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-slate-900">AI Planner</h1>
          <p className="text-slate-500">Your AI-generated roadmap to exam success.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm outline-none focus:border-primary"
          />
          <button 
            onClick={() => setSetupMode(!setupMode)}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-bold group relative"
          >
            <Settings2 size={20} />
            {setupMode && <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />}
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Sparkles size={18} />}
            Generate
          </button>
        </div>
      </header>

      <AnimatePresence>
        {setupMode && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6">Daily Routine Setup</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Wake Up Time</label>
                <input type="time" value={routine.wakeUpTime} onChange={e => setRoutine({...routine, wakeUpTime: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sleep Time</label>
                <input type="time" value={routine.sleepTime} onChange={e => setRoutine({...routine, sleepTime: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Study Hours/Day</label>
                <input type="number" min="1" max="16" value={routine.maxDailyStudyHours} onChange={e => setRoutine({...routine, maxDailyStudyHours: Number(e.target.value)})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Length (mins)</label>
                <input type="number" step="15" value={routine.preferredSessionLength} onChange={e => setRoutine({...routine, preferredSessionLength: Number(e.target.value)})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-700">Fixed Commitments</h4>
                <button onClick={addCommitment} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 flex items-center gap-2">
                  <Plus size={14}/> Add
                </button>
              </div>
              
              <div className="space-y-3">
                {routine.commitments.map((c, i) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-2xl flex flex-wrap gap-4 items-end relative group border border-slate-100 hover:border-primary/20 transition-all">
                    <button onClick={() => removeCommitment(c.id)} className="absolute right-3 top-3 text-slate-300 hover:text-red-500 bg-white p-1 rounded-full shadow-sm">
                      <X size={14}/>
                    </button>
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                      <input type="text" value={c.label} onChange={e => {
                        const newC = [...routine.commitments];
                        newC[i].label = e.target.value;
                        setRoutine({...routine, commitments: newC});
                      }} className="w-full p-3 bg-white rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="w-32 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Type</label>
                      <select value={c.type} onChange={e => {
                        const newC = [...routine.commitments];
                        newC[i].type = e.target.value as CommitmentType;
                        setRoutine({...routine, commitments: newC});
                      }} className="w-full p-3 bg-white rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="college">College</option>
                        <option value="meal">Meal</option>
                        <option value="exercise">Exercise</option>
                        <option value="travel">Commute</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="w-48 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Start & End</label>
                      <div className="flex items-center gap-2">
                         <input type="time" value={c.startTime} onChange={e => {
                          const newC = [...routine.commitments];
                          newC[i].startTime = e.target.value;
                          setRoutine({...routine, commitments: newC});
                        }} className="w-full p-3 bg-white rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none" />
                        <span className="text-slate-300">-</span>
                        <input type="time" value={c.endTime} onChange={e => {
                          const newC = [...routine.commitments];
                          newC[i].endTime = e.target.value;
                          setRoutine({...routine, commitments: newC});
                        }} className="w-full p-3 bg-white rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
                {routine.commitments.length === 0 && (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-sm font-medium">
                    No fixed commitments added yet. Add classes or meals here so they aren't scheduled over.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {timetable.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      )}

      <div id="timetable-content" className="space-y-12 bg-slate-50/50 p-6 rounded-[2.5rem]">
        {days.map((day) => groupedByDay[day] && (
          <section key={day} className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 pl-2">{day}</h3>
            <div className="space-y-3">
              {groupedByDay[day].map((entry, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">{entry.subjectName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-slate-400">{entry.startTime} - {entry.endTime}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">{entry.topicName}</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-200 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {timetable.length === 0 && !isGenerating && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <Calendar size={40} />
            </div>
            <p className="text-slate-400 font-medium italic">Empty planner. Configure setup & click Generate!</p>
          </div>
        )}
      </div>
    </div>
  );
}
