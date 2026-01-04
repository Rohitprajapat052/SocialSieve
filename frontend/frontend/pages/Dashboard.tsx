import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, FileText, History, LogOut } from 'lucide-react';
import { authAPI } from '../services/api';
import type { User } from '../types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/ui/Logo';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setUser(await authAPI.getCurrentUser());
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-100">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  const voiceProgress =
    (user!.usage.voice_minutes_used / user!.limits.voice_minutes_per_month) * 100;

  const textProgress =
    (user!.usage.comments_analyzed / user!.limits.comments_per_month) * 100;



  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="w-full mx-auto w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm">
              SocialSieve
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
            

              <Button
                variant="ghost"
                onClick={() => {
                  authAPI.logout();
                  navigate('/');
                }}
                className="flex items-center gap-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="w-full mx-auto px-6 py-8 space-y-10">
        {/* TOP ACTION TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* VOICE */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/voice')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') navigate('/voice'); }}
            className="cursor-pointer rounded-3xl p-6 text-white
                       bg-gradient-to-br from-purple-500 to-purple-700
                       shadow-lg hover:shadow-xl hover:-translate-y-1 transition
                       focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            <Mic size={28} />
            <h3 className="mt-6 text-xl">Voice</h3>
            <p className="text-purple-100 mt-1">Analyze audio & calls</p>

            <div className="mt-6">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/voice'); }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm"
                aria-label="Open Voice analysis"
              >
                Open Voice
              </button>
            </div>
          </div>

          {/* TEXT */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/text')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') navigate('/text'); }}
            className="cursor-pointer rounded-3xl p-6 text-white
                       bg-gradient-to-br from-pink-500 to-pink-700
                       shadow-lg hover:shadow-xl hover:-translate-y-1 transition
                       focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            <FileText size={28} />
            <h3 className="mt-6 text-xl">Text</h3>
            <p className="text-pink-100 mt-1">Analyze comments & text</p>

            <div className="mt-6">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/text'); }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm"
                aria-label="Open Text analysis"
              >
                Open Text
              </button>
            </div>
          </div>

          {/* HISTORY */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/history')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') navigate('/history'); }}
            className="cursor-pointer rounded-3xl p-6 text-white
                       bg-gradient-to-br from-purple-600 to-pink-600
                       shadow-lg hover:shadow-xl hover:-translate-y-1 transition
                       focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            <History size={28} />
            <h3 className="mt-6 text-xl">History</h3>
            <p className="text-purple-100 mt-1">View past analysis</p>

            <div className="mt-6">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/history'); }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm"
                aria-label="Open History"
              >
                Open History
              </button>
            </div>
          </div>
        </div>

        {/* USAGE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VOICE USAGE */}
          <div className="rounded-3xl p-6 bg-purple-50 border border-purple-100">
            <div className="flex justify-between items-center mb-3">
              <p className="text-purple-700">Voice usage</p>
              <span className="text-sm text-purple-500">
                {user!.usage.voice_minutes_used} /{' '}
                {user!.limits.voice_minutes_per_month} min
              </span>
            </div>

            <Progress value={voiceProgress} />

            <p className="mt-4 text-3xl text-blue-700">
              {Math.round(voiceProgress)}%
            </p>
          </div>

          {/* TEXT USAGE */}
          <div className="rounded-3xl p-6 bg-pink-50 border border-pink-100">
            <div className="flex justify-between items-center mb-3">
              <p className="text-pink-700">Text usage</p>
              <span className="text-sm text-pink-500">
                {user!.usage.comments_analyzed} /{' '}
                {user!.limits.comments_per_month}
              </span>
            </div>

            <Progress value={textProgress} />

            <p className="mt-4 text-3xl text-emerald-700">
              {Math.round(textProgress)}%
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
