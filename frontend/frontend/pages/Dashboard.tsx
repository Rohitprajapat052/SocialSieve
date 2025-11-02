import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, FileText, History, LogOut, Sparkles, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import type { User } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/ui/Logo';


export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const voiceProgress = (user!.usage.voice_minutes_used / user!.limits.voice_minutes_per_month) * 100;
  const textProgress = (user!.usage.comments_analyzed / user!.limits.comments_per_month) * 100;

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
<Logo size={30} />            
  </div>
           
 

              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SocialSieve
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {user?.plan} Plan
                  </Badge>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {getInitials(user?.name || 'U')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-700 hover:text-red-600 hover:bg-red-50"
              >
                <span className="bg-gray-100 py-2 px-4 border border-gray-600 rounded-lg">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-slate-600">
            Let's analyze some content today
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Voice Usage Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Voice Minutes</CardTitle>
                  <CardDescription className="text-2xl font-bold text-slate-900 mt-2">
                    {user?.usage.voice_minutes_used}
                    <span className="text-lg text-slate-400 font-normal"> / {user?.limits.voice_minutes_per_month}</span>
                  </CardDescription>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mic className="text-gray-600" size={24} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={voiceProgress} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">
                {Math.round(100 - Math.min(voiceProgress, 100))}% remaining this month
              </p>
            </CardContent>
          </Card>

          {/* Text Usage Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Text Analyses</CardTitle>
                  <CardDescription className="text-2xl font-bold text-slate-900 mt-2">
                    {user?.usage.comments_analyzed}
                    <span className="text-lg text-slate-400 font-normal"> / {user?.limits.comments_per_month}</span>
                  </CardDescription>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="text-green-600" size={24} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={textProgress} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">
                {Math.round(100 - Math.min(textProgress, 100))}% remaining this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Voice Analysis */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/voice')}>
            <CardHeader>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="text-gray-600" size={28} />
              </div>
              <CardTitle className="text-xl">Voice Analysis</CardTitle>
              <CardDescription>
                Upload audio files and get AI-powered transcripts, summaries, and action items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50">
                Start analyzing
                <ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>

          {/* Text Analysis */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/text')}>
            <CardHeader>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-green-600" size={28} />
              </div>
              <CardTitle className="text-xl">Text Analysis</CardTitle>
              <CardDescription>
                Paste any text and extract intelligent summaries and actionable insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group-hover:bg-green-50">
                Start analyzing
                <ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/history')}>
            <CardHeader>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <History className="text-purple-600" size={28} />
              </div>
              <CardTitle className="text-xl">History</CardTitle>
              <CardDescription>
                View and manage all your past voice and text analyses in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group-hover:bg-purple-50">
                View history
                <ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
