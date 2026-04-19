import { useState } from 'react';
import { Calendar, Download, Sparkles, Clock, BookOpen, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject, TimetableEntry } from '../types';
import { generateTimetable } from '../services/aiService';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

type Props = {
  subjects: Subject[];
  timetable: TimetableEntry[];
  setTimetable: (entries: TimetableEntry[]) => void;
};

export default function Planner({ subjects, timetable, setTimetable }: Props) {
  const [examDate, setExamDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (subjects.length === 0) {
      alert('Please add subjects in the Syllabus section first.');
      return;
    }
    setIsGenerating(true);
    const newTimetable = await generateTimetable(subjects, examDate);
    setTimetable(newTimetable);
    setIsGenerating(false);
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

  const deleteEntry = (id: string) => {
    setTimetable(timetable.filter(e => e.id !== id));
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
            <p className="text-slate-400 font-medium italic">Empty planner. Set your exam date and click Generate!</p>
          </div>
        )}
      </div>
    </div>
  );
}
