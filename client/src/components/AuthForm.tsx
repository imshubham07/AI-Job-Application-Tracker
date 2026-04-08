import { useState } from 'react';
import type { FormEvent } from 'react';

type AuthFormProps = {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
};

export const AuthForm = ({ title, submitLabel, onSubmit, error }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = title.toLowerCase() === 'login';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/40 bg-white/75 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl sm:p-9">
      <div className="mb-7">
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
          AI Job Tracker
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {isLogin
            ? 'Welcome back. Continue tracking applications and get AI-driven suggestions.'
            : 'Create your account to organize applications and unlock AI-assisted insights.'}
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/40"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="auth-password" className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            required
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/40"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-2xl bg-slate-950 py-3.5 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : submitLabel}
        </button>
        <p className="text-center text-xs text-slate-500">Protected with secure token-based authentication.</p>
      </form>
    </div>
  );
};
