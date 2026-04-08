import { useMemo, useState } from 'react';
import { APPLICATION_STATUSES, type Application, type ApplicationPayload } from '../types';
import { Modal } from './Modal';

type ApplicationDetailModalProps = {
  application: Application;
  onClose: () => void;
  onSave: (id: string, payload: Partial<ApplicationPayload>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const splitSkills = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const ApplicationDetailModal = ({ application, onClose, onSave, onDelete }: ApplicationDetailModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ApplicationPayload>>({
    company: application.company,
    role: application.role,
    jdLink: application.jdLink,
    notes: application.notes,
    dateApplied: application.dateApplied.slice(0, 10),
    status: application.status,
    salaryRange: application.salaryRange,
    requiredSkills: application.requiredSkills,
    niceToHaveSkills: application.niceToHaveSkills,
    seniority: application.seniority,
    location: application.location,
    resumeSuggestions: application.resumeSuggestions,
  });

  const requiredSkills = useMemo(() => (form.requiredSkills ?? []).join(', '), [form.requiredSkills]);
  const niceToHaveSkills = useMemo(() => (form.niceToHaveSkills ?? []).join(', '), [form.niceToHaveSkills]);

  const save = async (): Promise<void> => {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(application._id, form);
      setIsEditMode(false);
    } catch {
      setError('Failed to save application');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (): Promise<void> => {
    if (!window.confirm('Delete this application?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(application._id);
      onClose();
    } catch {
      setError('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const copySuggestion = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError('Could not copy suggestion');
    }
  };

  return (
    <Modal title={`${application.company} - ${application.role}`} onClose={onClose}>
      {error ? <div className="mb-3 rounded-2xl border border-red-200/70 bg-red-50/90 p-3 text-sm font-medium text-red-700">{error}</div> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.company ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} />
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.role ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} />
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.jdLink ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, jdLink: event.target.value }))} />
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.salaryRange ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, salaryRange: event.target.value }))} />
        <input disabled={!isEditMode} type="date" className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.dateApplied ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, dateApplied: event.target.value }))} />
        <select disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.status ?? 'Applied'} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Application['status'] }))}>
          {APPLICATION_STATUSES.map((status) => (
            <option value={status} key={status}>{status}</option>
          ))}
        </select>
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.seniority ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, seniority: event.target.value }))} />
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.location ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={requiredSkills} onChange={(event) => setForm((prev) => ({ ...prev, requiredSkills: splitSkills(event.target.value) }))} />
        <input disabled={!isEditMode} className="rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={niceToHaveSkills} onChange={(event) => setForm((prev) => ({ ...prev, niceToHaveSkills: splitSkills(event.target.value) }))} />
      </div>

      <textarea disabled={!isEditMode} className="mt-3 h-24 w-full rounded-2xl border border-white/40 bg-white/70 p-3 disabled:bg-white/50" value={form.notes ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-950">Resume Suggestions</h3>
        {(form.resumeSuggestions ?? []).length === 0 ? (
          <p className="mt-1 text-sm text-slate-500">No resume suggestions.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {(form.resumeSuggestions ?? []).map((suggestion) => (
              <li key={suggestion} className="flex items-start justify-between gap-2 rounded-2xl border border-white/40 bg-white/70 p-3 text-sm text-slate-800 shadow-sm backdrop-blur-xl">
                <span>{suggestion}</span>
                <button type="button" className="rounded-full border border-slate-300 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-white" onClick={() => copySuggestion(suggestion)}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex justify-between">
        <button type="button" className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-500 disabled:opacity-60" onClick={remove} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        <div className="flex gap-2">
          <button type="button" className="rounded-2xl border border-white/40 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white" onClick={() => setIsEditMode((prev) => !prev)}>
            {isEditMode ? 'Cancel Edit' : 'Edit'}
          </button>
          {isEditMode ? (
            <button type="button" className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60" onClick={save} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
