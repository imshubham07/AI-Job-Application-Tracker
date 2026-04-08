import { type PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  title: string;
  onClose: () => void;
}>;

export const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/25 bg-white/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <button
            type="button"
            className="rounded-full border border-white/40 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
