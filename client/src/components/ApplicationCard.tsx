import type { Application } from '../types';

type ApplicationCardProps = {
  application: Application;
  onClick: () => void;
};

export const ApplicationCard = ({ application, onClick }: ApplicationCardProps) => {
  const formattedDate = new Date(application.dateApplied).toLocaleDateString();

  return (
    <button
      type="button"
      className="group w-full rounded-2xl border border-white/45 bg-white/90 p-4 text-left shadow-lg shadow-slate-900/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/70 hover:bg-white"
      onClick={onClick}
    >
      <div className="text-sm font-semibold text-slate-950 transition group-hover:text-cyan-950">{application.company}</div>
      <div className="mt-1 text-sm text-slate-700">{application.role}</div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        <span className="rounded-full bg-slate-900/5 px-2 py-1 font-medium text-slate-600">Applied {formattedDate}</span>
        <span className="rounded-full bg-cyan-500/10 px-2 py-1 font-semibold text-cyan-700">{application.status}</span>
      </div>
    </button>
  );
};
