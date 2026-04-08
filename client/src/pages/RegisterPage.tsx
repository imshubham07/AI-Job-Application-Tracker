import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { api, getErrorMessage } from '../lib/api';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const submit = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const response = await api.post<{ token: string }>('/auth/register', { email, password });
      login(response.data.token);
      navigate('/board');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,_rgba(16,185,129,0.16),_transparent_35%),radial-gradient(circle_at_90%_12%,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_80%_85%,_rgba(168,85,247,0.14),_transparent_30%)]" />
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-white/40 bg-white/35 p-4 backdrop-blur-xl sm:p-6 lg:grid-cols-2 lg:p-8">
        <div className="hidden rounded-3xl bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/30 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Get started</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">Build your job search system.</h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            Create your account to track applications, keep status updates visible, and use AI to sharpen each resume submission.
          </p>
        </div>
        <div className="space-y-4">
          <AuthForm title="Register" submitLabel="Create account" onSubmit={submit} error={error} />
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-950 underline decoration-cyan-400 decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </section>
      <p className="relative mt-4 text-center text-xs text-slate-500 lg:hidden">
        Quick signup and a clean workflow for your applications.
      </p>
    </main>
  );
};
