import { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, Unit, Difficulty } from '../types';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

type Props = {
  user: any;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
};

export default function SyllabusManager({ user, subjects, setSubjects }: Props) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [addingUnit, setAddingUnit] = useState<string | null>(null);
  const [addingTopic, setAddingTopic] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const addSubject = async () => {
    if (!newSubjectName.trim()) return;
    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      difficulty: 'medium',
      units: []
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
    setExpandedSubject(newSub.id);
    
    if (user) {
      await supabase.from('subjects').insert({
        id: newSub.id,
        user_id: user.id,
        name: newSub.name,
        difficulty: newSub.difficulty
      });
    }
  };

  const deleteSubject = async (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    if (user) await supabase.from('subjects').delete().eq('id', id);
  };

  const updateDifficulty = async (id: string, difficulty: Difficulty) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, difficulty } : s));
    if (user) await supabase.from('subjects').update({ difficulty }).eq('id', id);
  };

  const submitAddUnit = async (subjectId: string) => {
    if (!draftName.trim()) return;
    const unitName = draftName;
    setAddingUnit(null);
    setDraftName('');
    const unitId = Date.now().toString();
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          units: [...s.units, { id: unitId, name: unitName, topics: [] }]
        };
      }
      return s;
    }));
    if (user) {
      await supabase.from('units').insert({ id: unitId, subject_id: subjectId, name: unitName });
    }
  };

  const submitAddTopic = async (subjectId: string, unitId: string) => {
    if (!draftName.trim()) return;
    const topicName = draftName;
    setAddingTopic(null);
    setDraftName('');
    const topicId = Date.now().toString();
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          units: s.units.map(u => {
            if (u.id === unitId) {
              return {
                ...u,
                topics: [...u.topics, { id: topicId, name: topicName, isCompleted: false }]
              };
            }
            return u;
          })
        };
      }
      return s;
    }));
    if (user) {
      await supabase.from('topics').insert({ id: topicId, unit_id: unitId, name: topicName, is_completed: false });
    }
  };

  const toggleTopic = async (subjectId: string, unitId: string, topicId: string) => {
    let newStatus = false;
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          units: s.units.map(u => {
            if (u.id === unitId) {
              return {
                ...u,
                topics: u.topics.map(t => {
                  if (t.id === topicId) {
                    newStatus = !t.isCompleted;
                    return { ...t, isCompleted: newStatus };
                  }
                  return t;
                })
              };
            }
            return u;
          })
        };
      }
      return s;
    }));
    if (user) {
      await supabase.from('topics').update({ is_completed: newStatus }).eq('id', topicId);
    }
  };

  return (
    <div className="p-6 pb-32 space-y-8 max-w-2xl mx-auto">
      <header>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900">Syllabus</h1>
        <p className="text-slate-500">Manage your subjects, units, and topics.</p>
      </header>

      {/* Add Subject Input */}
      <div className="relative group">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Enter new subject name..."
          className="w-full pl-6 pr-16 py-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm focus:border-primary focus:ring-0 transition-all outline-none text-lg font-medium"
          onKeyPress={(e) => e.key === 'Enter' && addSubject()}
        />
        <button
          onClick={addSubject}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  subject.difficulty === 'hard' ? "bg-red-50 text-red-500" :
                  subject.difficulty === 'medium' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                )}>
                  {expandedSubject === subject.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{subject.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {subject.units.length} Units • {subject.difficulty}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}
                className="p-3 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <AnimatePresence>
              {expandedSubject === subject.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 space-y-6"
                >
                  {/* Difficulty selector */}
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => updateDifficulty(subject.id, d)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                          subject.difficulty === d 
                            ? "bg-slate-900 text-white shadow-md scale-105" 
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Units */}
                  <div className="space-y-4">
                    {subject.units.map((unit) => (
                      <div key={unit.id} className="bg-slate-50/50 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-700">{unit.name}</h4>
                          <button 
                            onClick={() => { setAddingTopic(unit.id); setAddingUnit(null); setDraftName(''); }}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            + Topic
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {unit.topics.map((topic) => (
                            <button
                              key={topic.id}
                              onClick={() => toggleTopic(subject.id, unit.id, topic.id)}
                              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
                            >
                              {topic.isCompleted ? (
                                <CheckCircle2 className="text-emerald-500" size={18} />
                              ) : (
                                <Circle className="text-slate-200" size={18} />
                              )}
                              <span className={cn(
                                "text-sm",
                                topic.isCompleted ? "text-slate-400 line-through" : "text-slate-600 font-medium"
                              )}>
                                {topic.name}
                              </span>
                            </button>
                          ))}
                          {addingTopic === unit.id && (
                            <div className="flex items-center gap-2 mt-2">
                              <input 
                                autoFocus
                                type="text" 
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                placeholder="Topic name..." 
                                className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
                                onKeyPress={(e) => e.key === 'Enter' && submitAddTopic(subject.id, unit.id)}
                              />
                              <button onClick={() => submitAddTopic(subject.id, unit.id)} className="bg-primary text-white p-2 rounded-lg"><Plus size={16}/></button>
                              <button onClick={() => setAddingTopic(null)} className="text-slate-400 p-2 hover:text-red-500 text-xs font-bold uppercase tracking-wider">Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {addingUnit === subject.id ? (
                      <div className="flex items-center gap-2 mt-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <input 
                          autoFocus
                          type="text" 
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          placeholder="Enter Unit Name..." 
                          className="flex-1 text-sm bg-transparent outline-none px-2"
                          onKeyPress={(e) => e.key === 'Enter' && submitAddUnit(subject.id)}
                        />
                        <button onClick={() => submitAddUnit(subject.id)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90">Save</button>
                        <button onClick={() => setAddingUnit(null)} className="text-slate-400 px-3 hover:text-red-500 text-xs font-bold uppercase tracking-wider">Cancel</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setAddingUnit(subject.id); setAddingTopic(null); setDraftName(''); }}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                      >
                        + Add Unit
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="text-slate-200" size={40} />
          </div>
          <p className="text-slate-400 font-medium italic">Your syllabus is empty. Start adding subjects above!</p>
        </div>
      )}
    </div>
  );
}
