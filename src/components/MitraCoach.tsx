import { useState, useRef, useEffect } from 'react';
import { Lightbulb, Send, Brain, Sparkles, BookOpen, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askProfessor } from '../services/aiService';
import { Message, Subject } from '../types';
import { cn } from '../lib/utils';

type Props = {
  subjects: Subject[];
};

export default function MitraCoach({ subjects }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Namaste! I'm Mitra, your personal AI Study Coach. How can I help you excel today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    const query = text.trim();
    if (!query || isLoading) return;

    const userMsg: Message = { role: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await askProfessor(query, messages);
    const aiMsg: Message = { role: 'model', text: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const suggestions = [
    { title: "Study Strategy", icon: Target, prompt: "How should I study for my upcoming exams effectively?" },
    { title: "Hard Subjects", icon: Brain, prompt: "Give me tips to master hard subjects faster." },
    { title: "Revision Tips", icon: Clock, prompt: "How can I improve my memory and retention during revision?" },
    { title: "Subject Specific", icon: BookOpen, prompt: `Can you suggest a preparation strategy for ${subjects[0]?.name || 'my subjects'}?` }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto px-4 md:px-6">
      <header className="py-6 space-y-1">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
          <Sparkles size={14} className="fill-current" />
          AI Powered Guidance
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900">Study Mitra</h1>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] px-5 py-4 rounded-3xl text-sm md:text-base leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-slate-900 text-white rounded-br-md" 
                  : "bg-white border border-slate-100 text-slate-700 rounded-bl-md"
              )}>
                {msg.text.split('\n').map((line, lid) => (
                  <p key={lid} className={cn(line.startsWith('#') ? "font-bold text-lg mt-2 mb-1" : "mb-2")}>
                    {line.replace(/^#+ /, '')}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest p-4">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              </div>
              Mitra is thinking...
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Input */}
      <div className="pt-4 space-y-4">
        {messages.length < 3 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.prompt)}
                className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary hover:shadow-md transition-all text-left"
              >
                <div className="p-2 bg-primary/5 text-primary rounded-xl">
                  <s.icon size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700">{s.title}</span>
              </button>
            ))}
          </div>
        )}

        <div className="relative mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Mitra about study techniques..."
            className="w-full pl-6 pr-16 py-5 bg-white border-2 border-slate-100 rounded-full shadow-lg outline-none focus:border-primary transition-all font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
