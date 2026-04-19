import { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

type Props = {
  onLogin: (user: any) => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    setErrorText('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        
        if (data.user) {
          // Initialize empty profile
          const { error: profileError } = await supabase.from('user_profiles').insert({
            user_id: data.user.id
          });
          if (profileError && profileError.code !== '23505') {
            console.error("Profile creation error:", profileError);
          }
          onLogin(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user);
        }
      }
    } catch (err: any) {
      setErrorText(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 relative z-10 border border-slate-100"
      >
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg mb-2">
            <Sparkles size={32} className="fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {isSignUp ? 'Sign up to start planning intelligently.' : 'Sign in to access your StudyMitra dashboard.'}
            </p>
          </div>
        </div>

        {errorText && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
            <AlertCircle size={20} />
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] outline-none transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] outline-none transition-all font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-xl hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Register' : 'Sign In'} 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setErrorText(''); }} 
            className="text-primary font-bold hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Create one'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
