import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { StudySession } from '../types';

type Props = {
  activeSubjectId?: string;
  onSessionComplete: (session: StudySession) => void;
};

export default function Pomodoro({ activeSubjectId, onSessionComplete }: Props) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [customStudy, setCustomStudy] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleComplete = () => {
    setIsActive(false);
    if (mode === 'study' && activeSubjectId) {
      onSessionComplete({
        id: Date.now().toString(),
        subjectId: activeSubjectId,
        date: new Date().toISOString(),
        minutes: customStudy
      });
    }
    // Notification logic would go here
    const nextMode = mode === 'study' ? 'break' : 'study';
    setMode(nextMode);
    setMinutes(nextMode === 'study' ? customStudy : customBreak);
    setSeconds(0);
  };

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setMinutes(mode === 'study' ? customStudy : customBreak);
    setSeconds(0);
  };

  return (
    <div className="p-6 pb-32 space-y-8 max-w-xl mx-auto flex flex-col items-center">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-extrabold text-slate-900">Focus Timer</h1>
        <p className="text-slate-500">The effective way to stay productive.</p>
      </header>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle 
            cx="144" cy="144" r="130" 
            className="fill-transparent stroke-slate-100 stroke-[12]" 
          />
          <motion.circle 
            cx="144" cy="144" r="130" 
            className={cn(
              "fill-transparent stroke-[12] stroke-linecap-round transition-colors duration-500",
              mode === 'study' ? "stroke-primary" : "stroke-emerald-500"
            )}
            initial={{ strokeDashoffset: 816 }}
            animate={{ 
              strokeDashoffset: 816 * (1 - (minutes * 60 + seconds) / ((mode === 'study' ? customStudy : customBreak) * 60)) 
            }}
            style={{ strokeDasharray: 816 }}
          />
        </svg>

        <div className="text-center space-y-1 z-10">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
            {mode === 'study' ? <Brain size={14} /> : <Coffee size={14} />}
            {mode === 'study' ? 'Deep Study' : 'Rest Break'}
          </div>
          <div className="text-7xl font-headline font-black text-slate-900 tabular-nums">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={reset}
          className="p-5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all active:scale-90"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggle}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90",
            isActive ? "bg-slate-900 shadow-slate-200" : (mode === 'study' ? "bg-primary shadow-primary/20" : "bg-emerald-500 shadow-emerald-200")
          )}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <div className="p-5 opacity-0 pointer-events-none">
          <RotateCcw size={24} />
        </div>
      </div>

      {/* Settings */}
      <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">Study Length</label>
            <input 
              type="number" 
              value={customStudy}
              onChange={(e) => setCustomStudy(parseInt(e.target.value) || 1)}
              className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">Break Length</label>
            <input 
              type="number" 
              value={customBreak}
              onChange={(e) => setCustomBreak(parseInt(e.target.value) || 1)}
              className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 focus:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
