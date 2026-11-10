import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { Button } from '../components/UI';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Once logged in -> proceed to Onboarding / Dashboard
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#00E5BE] selection:text-[#070a12]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="flex justify-center mb-5">
          <Logo size="lg" showText={false} />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Sign In to SHEcurity
        </h1>
        <p className="mt-2 text-sm text-stone-300">
          Enter your credentials to access your secure dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#0d1424] py-8 px-6 sm:px-10 rounded-2xl border border-stone-800 shadow-xl shadow-black/50">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111c2e] border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5BE] focus:ring-1 focus:ring-[#00E5BE]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111c2e] border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5BE] focus:ring-1 focus:ring-[#00E5BE]"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full justify-center gap-2 text-sm font-bold shadow-md shadow-teal-500/20 py-3"
              >
                Sign In & Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-800 text-center">
            <p className="text-xs text-stone-300">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#00E5BE] hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-[#00E5BE]" />
          <span>Local SQLite authentication. Zero external third-party tracking.</span>
        </div>
      </div>
    </div>
  );
};

