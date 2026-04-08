import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddApplicationModal } from '../components/AddApplicationModal';
import { ApplicationDetailModal } from '../components/ApplicationDetailModal';
import { KanbanBoard } from '../components/KanbanBoard';
import { useAuth } from '../contexts/AuthContext';
import { api, getErrorMessage } from '../lib/api';
import type { Application, ApplicationPayload, ApplicationStatus } from '../types';

const APPLICATIONS_KEY = ['applications'];

export const BoardPage = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const applicationsQuery = useQuery({
    queryKey: APPLICATIONS_KEY,
    queryFn: async () => {
      const response = await api.get<Application[]>('/applications');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ApplicationPayload) => {
      const response = await api.post<Application>('/applications', payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
    onError: (error) => setToast(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ApplicationPayload> }) => {
      const response = await api.put<Application>(`/applications/${id}`, payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
    onError: (error) => setToast(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/applications/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
    onError: (error) => setToast(getErrorMessage(error)),
  });

  const applications = useMemo(() => applicationsQuery.data ?? [], [applicationsQuery.data]);
  const interviewPipelineCount = useMemo(
    () => applications.filter((item) => item.status === 'Phone Screen' || item.status === 'Interview').length,
    [applications],
  );
  const offerCount = useMemo(() => applications.filter((item) => item.status === 'Offer').length, [applications]);

  const onStatusChange = (id: string, status: ApplicationStatus): void => {
    updateMutation.mutate({ id, payload: { status } });
  };

  const onAdd = async (payload: ApplicationPayload): Promise<void> => {
    await createMutation.mutateAsync(payload);
  };

  const onSave = async (id: string, payload: Partial<ApplicationPayload>): Promise<void> => {
    await updateMutation.mutateAsync({ id, payload });
    const refreshed = (queryClient.getQueryData<Application[]>(APPLICATIONS_KEY) ?? []).find((item) => item._id === id) ?? null;
    setSelectedApplication(refreshed);
  };

  const onDelete = async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
    setSelectedApplication(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_20%),radial-gradient(circle_at_50%_90%,_rgba(16,185,129,0.14),_transparent_22%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]" />
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[30px] border border-white/50 bg-white/60 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">AI Job Application Tracker</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Keep your search momentum with a clear pipeline view, quick status updates, and AI-powered application support.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                onClick={() => setIsAddOpen(true)}
              >
                Add Application
              </button>
              <button
                type="button"
                className="rounded-2xl border border-white/40 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-white"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/50 bg-white/75 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Applications</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{applications.length}</p>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/75 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">In Interview Pipeline</p>
              <p className="mt-2 text-2xl font-bold text-indigo-700">{interviewPipelineCount}</p>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/75 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Offers</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">{offerCount}</p>
            </div>
          </div>
        </header>

        {toast ? <div className="mb-4 rounded-2xl border border-red-200/70 bg-red-50/90 p-3 text-sm text-red-700 shadow-sm backdrop-blur-xl">{toast}</div> : null}

        {applicationsQuery.isLoading ? (
          <div className="rounded-[28px] border border-white/40 bg-white/60 p-8 text-center text-slate-600 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">Loading applications...</div>
        ) : applicationsQuery.isError ? (
          <div className="rounded-[28px] border border-red-200/70 bg-red-50/90 p-8 text-center text-red-700 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
            {getErrorMessage(applicationsQuery.error)}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-[28px] border border-white/40 bg-white/60 p-8 text-center text-slate-700 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-2xl">
              ✨
            </div>
            <div className="text-lg font-semibold text-slate-950">No applications yet</div>
            <p className="mt-2 text-sm text-slate-600">Click "Add Application" to create your first card and let AI fill in the details.</p>
          </div>
        ) : (
          <section className="rounded-[30px] border border-white/45 bg-white/50 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Application Board</h2>
              <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700">Drag and drop to update status</span>
            </div>
            <KanbanBoard
              applications={applications}
              onStatusChange={onStatusChange}
              onCardClick={(application) => setSelectedApplication(application)}
            />
          </section>
        )}

        {isAddOpen ? (
          <AddApplicationModal
            onClose={() => setIsAddOpen(false)}
            onCreate={onAdd}
          />
        ) : null}

        {selectedApplication ? (
          <ApplicationDetailModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onSave={onSave}
            onDelete={onDelete}
          />
        ) : null}
      </div>
    </main>
  );
};
