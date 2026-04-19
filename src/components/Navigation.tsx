import { LayoutDashboard, BookOpen, Calendar, Lightbulb, Timer, BarChart } from 'lucide-react';
import { Screen } from '../types';
import { cn } from '../lib/utils';

type Props = {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
};

export default function Navigation({ activeScreen, onScreenChange }: Props) {
  const items: { screen: Screen; label: string; icon: any }[] = [
    { screen: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { screen: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { screen: 'planner', label: 'Planner', icon: Calendar },
    { screen: 'coach', label: 'Mitra AI', icon: Lightbulb },
    { screen: 'timer', label: 'Timer', icon: Timer },
    { screen: 'analytics', label: 'Stats', icon: BarChart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-2 pb-6 pt-2 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      {items.map((item) => (
        <button
          key={item.screen}
          onClick={() => onScreenChange(item.screen)}
          className={cn(
            "flex flex-col items-center justify-center min-w-[60px] py-2 rounded-2xl transition-all duration-300 active:scale-90",
            activeScreen === item.screen
              ? "text-primary scale-110"
              : "text-slate-400 hover:text-primary/60"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl mb-1 transition-colors",
            activeScreen === item.screen ? "bg-primary/10" : "bg-transparent"
          )}>
            <item.icon size={22} className={cn(activeScreen === item.screen && "fill-current/10")} />
          </div>
          <span className="font-body text-[10px] font-bold tracking-tight">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
