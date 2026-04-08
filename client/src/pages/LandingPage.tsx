import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const featureCards = [
  {
    title: 'AI-powered parsing',
    description: 'Paste any job description and auto-fill company, role, skills, seniority, and location.',
  },
  {
    title: 'Kanban tracking',
    description: 'Move applications across the board with drag-and-drop status updates.',
  },
  {
    title: 'Resume bullet ideas',
    description: 'Generate polished resume suggestions tailored to the role and skills.',
  },
];

const stats = [
  { label: 'Workflow', value: 'Kanban' },
  { label: 'AI mode', value: 'Groq' },
  { label: 'Stack', value: 'MERN + TS' },
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(15,23,42,0.88),rgba(2,6,23,0.96))]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-sky-100 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI Job Application Tracker
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Track every application with a glassmorphism dashboard and AI assistance.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Organize roles, parse job descriptions, and generate resume bullets in one clean workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? '/board' : '/register'}
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                {isAuthenticated ? 'Open Board' : 'Get Started'}
              </Link>
              <Link
                to={isAuthenticated ? '/board' : '/login'}
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-white/25 hover:bg-white/15"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Login'}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-cyan-400/30 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-28 w-28 rounded-full bg-fuchsia-400/25 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm text-slate-300">Welcome back</p>
                  <h2 className="text-xl font-semibold text-white">Your application pipeline</h2>
                </div>
                <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {featureCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 shadow-lg shadow-black/20"
                  >
                    <h3 className="text-base font-semibold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-5 gap-3">
                {['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-cyan-300/80" />
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</div>
                    <div className="mt-2 text-sm font-semibold text-white">{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
