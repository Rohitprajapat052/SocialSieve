import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/ui/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(loginData);
      localStorage.setItem('token', res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.signup(signupData);
      localStorage.setItem('token', res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

      {/* LEFT SIDE – BRAND */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-12">
        <Logo size="lg" className="mb-8" />
        <h2 className="text-4xl font-bold mb-6 text-center">SocialSieve</h2>
        <p className="text-purple-100 text-center max-w-md text-lg">Summarize audio and text into concise, actionable insights — fast.</p>
      </div>

      {/* RIGHT SIDE – AUTH Card */}
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg border border-purple-100 bg-white">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Logo size="md" />
              <CardTitle className="text-2xl font-bold text-slate-900">SocialSieve</CardTitle>
            </div>
            <p className="text-sm text-slate-500">Sign in or create your account</p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 flex flex-row">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center border rounded-md px-3 bg-white">
                      <Mail className="text-slate-400 mr-2" size={18} />
                      <Input
                        type="email"
                        className="border-0 focus-visible:ring-0 bg-white"
                        required
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Password</Label>
                    <div className="flex items-center border rounded-md px-3 bg-white">
                      <Lock className="text-slate-400 mr-2" size={18} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="border-0 focus-visible:ring-0 bg-white"
                        required
                        minLength={8}
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 ml-2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700" disabled={loading}>
                    {loading ? 'Signing in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              {/* SIGNUP */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <div className="flex items-center border rounded-md px-3 bg-white">
                      <User className="text-slate-400 mr-2" size={18} />
                      <Input
                        className="border-0 focus-visible:ring-0 bg-white"
                        required
                        value={signupData.name}
                        onChange={(e) =>
                          setSignupData({ ...signupData, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center border rounded-md px-3 bg-white">
                      <Mail className="text-slate-400 mr-2" size={18} />
                      <Input
                        type="email"
                        className="border-0 focus-visible:ring-0 bg-white"
                        required
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Password</Label>
                    <div className="flex items-center border rounded-md px-3 bg-white">
                      <Lock className="text-slate-400 mr-2" size={18} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="border-0 focus-visible:ring-0 bg-white"
                        required
                        minLength={8}
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 ml-2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
