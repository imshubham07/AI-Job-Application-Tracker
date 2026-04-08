import { useMemo, useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import { APPLICATION_STATUSES, type ApplicationPayload, type ParseJobResponse } from '../types';
import { Modal } from './Modal';

type AddApplicationModalProps = {
  onClose: () => void;
  onCreate: (payload: ApplicationPayload) => Promise<void>;
};

const emptyForm: ApplicationPayload = {
  company: '',
  role: '',
  jdLink: '',
  notes: '',
  dateApplied: new Date().toISOString().slice(0, 10),
  status: 'Applied',
  salaryRange: '',
  requiredSkills: [],
  niceToHaveSkills: [],
  seniority: '',
  location: '',
  resumeSuggestions: [],
};

const splitSkills = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const AddApplicationModal = ({ onClose, onCreate }: AddApplicationModalProps) => {
  const [form, setForm] = useState<ApplicationPayload>(emptyForm);
  const [jdInput, setJdInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredSkillInput = useMemo(() => form.requiredSkills.join(', '), [form.requiredSkills]);
  const niceToHaveInput = useMemo(() => form.niceToHaveSkills.join(', '), [form.niceToHaveSkills]);

  const parseWithAi = async (): Promise<void> => {
    setIsParsing(true);
    setError(null);

    try {
      const parsedResponse = await api.post<ParseJobResponse>('/ai/parse', { jd: jdInput });
      const parsed = parsedResponse.data;

      let resumeSuggestions = form.resumeSuggestions;
      if (parsed.role || parsed.requiredSkills.length > 0) {
        const suggestionsResponse = await api.post<{ suggestions: string[] }>('/ai/suggestions', {
          role: parsed.role,
          requiredSkills: parsed.requiredSkills,
        });
        resumeSuggestions = suggestionsResponse.data.suggestions ?? [];
      }

      setForm((prev) => ({
        ...prev,
        company: parsed.company || prev.company,
        role: parsed.role || prev.role,
        requiredSkills: parsed.requiredSkills,
        niceToHaveSkills: parsed.niceToHaveSkills,
        seniority: parsed.seniority,
        location: parsed.location,
        resumeSuggestions,
      }));
    } catch (parseError) {
      setError(getErrorMessage(parseError));
    } finally {
      setIsParsing(false);
    }
  };

  const submit = async (): Promise<void> => {
    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onCreate(form);
      onClose();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
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
    <Modal title="Add Application" onClose={onClose}>
      <div className="space-y-4 text-slate-900">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Paste Job Description</label>
          <textarea
            className="h-28 w-full rounded-2xl border border-white/40 bg-white/70 p-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40"
            value={jdInput}
            onChange={(event) => setJdInput(event.target.value)}
          />
          <button
            type="button"
            className="mt-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={parseWithAi}
            disabled={isParsing || !jdInput.trim()}
          >
            {isParsing ? 'Parsing...' : 'Parse with AI'}
          </button>
        </div>

        {error ? <div className="rounded-2xl border border-red-200/70 bg-red-50/90 p-3 text-sm font-medium text-red-700">{error}</div> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" placeholder="Company" value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} />
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" placeholder="Role" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} />
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" placeholder="JD Link" value={form.jdLink} onChange={(event) => setForm((prev) => ({ ...prev, jdLink: event.target.value }))} />
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" placeholder="Salary Range" value={form.salaryRange} onChange={(event) => setForm((prev) => ({ ...prev, salaryRange: event.target.value }))} />
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" type="date" value={form.dateApplied} onChange={(event) => setForm((prev) => ({ ...prev, dateApplied: event.target.value }))} />
          <select className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ApplicationPayload['status'] }))}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" placeholder="Seniority" value={form.seniority} onChange={(event) => setForm((prev) => ({ ...prev, seniority: event.target.value }))} />
          <input className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40" placeholder="Location" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40"
            placeholder="Required skills (comma separated)"
            value={requiredSkillInput}
            onChange={(event) => setForm((prev) => ({ ...prev, requiredSkills: splitSkills(event.target.value) }))}
          />
          <input
            className="rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40"
            placeholder="Nice to have skills (comma separated)"
            value={niceToHaveInput}
            onChange={(event) => setForm((prev) => ({ ...prev, niceToHaveSkills: splitSkills(event.target.value) }))}
          />
        </div>

        <textarea
          className="h-24 w-full rounded-2xl border border-white/40 bg-white/70 p-3 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/90 focus:ring-4 focus:ring-cyan-200/40"
          placeholder="Notes"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
        />

        <div>
          <h3 className="text-sm font-semibold text-slate-900">AI Resume Suggestions</h3>
          {form.resumeSuggestions.length === 0 ? (
            <p className="mt-1 text-sm text-slate-500">No suggestions yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {form.resumeSuggestions.map((suggestion) => (
                <li key={suggestion} className="flex items-start justify-between gap-3 rounded-2xl border border-white/40 bg-white/70 p-3 text-sm text-slate-800 shadow-sm backdrop-blur-xl">
                  <span>{suggestion}</span>
                  <button type="button" className="rounded-full border border-slate-300 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-white" onClick={() => copySuggestion(suggestion)}>
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-2xl border border-white/40 bg-white/70 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-white" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="rounded-2xl bg-slate-950 px-4 py-2.5 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60"
            disabled={isSaving}
            onClick={submit}
          >
            {isSaving ? 'Saving...' : 'Save Application'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
