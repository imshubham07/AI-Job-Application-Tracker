import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { api, getErrorMessage } from '../lib/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const submit = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const response = await api.post<{ token: string }>('/auth/login', { email, password });
      login(response.data.token);
      navigate('/board');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_90%_15%,_rgba(99,102,241,0.18),_transparent_30%),radial-gradient(circle_at_70%_85%,_rgba(168,85,247,0.14),_transparent_30%)]" />
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-white/40 bg-white/35 p-4 backdrop-blur-xl sm:p-6 lg:grid-cols-2 lg:p-8">
        <div className="hidden rounded-3xl bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/30 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Welcome back</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">Track every application with clarity.</h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            Stay organized with one board, one workflow, and AI support whenever you need better resume feedback and smarter next steps.
          </p>
        </div>
        <div className="space-y-4">
          <AuthForm title="Login" submitLabel="Login" onSubmit={submit} error={error} />
          <p className="text-center text-sm text-slate-600">
            No account?{' '}
            <Link to="/register" className="font-semibold text-slate-950 underline decoration-cyan-400 decoration-2 underline-offset-4">
              Register
            </Link>
          </p>
        </div>
      </section>
      <p className="relative mt-4 text-center text-xs text-slate-500 lg:hidden">
        Manage applications and use AI recommendations in one place.
      </p>
    </main>
  );
};
