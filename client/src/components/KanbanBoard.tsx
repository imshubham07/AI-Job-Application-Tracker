import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '../types';
import { ApplicationCard } from './ApplicationCard';

type KanbanBoardProps = {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onCardClick: (application: Application) => void;
};

export const KanbanBoard = ({ applications, onStatusChange, onCardClick }: KanbanBoardProps) => {
  const grouped = APPLICATION_STATUSES.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((application) => application.status === status);
      return acc;
    },
    {
      Applied: [],
      'Phone Screen': [],
      Interview: [],
      Offer: [],
      Rejected: [],
    },
  );

  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return;
    }

    const destinationStatus = result.destination.droppableId as ApplicationStatus;

    if (result.destination.droppableId === result.source.droppableId) {
      return;
    }

    onStatusChange(result.draggableId, destinationStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {APPLICATION_STATUSES.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-[24px] border p-3.5 shadow-xl backdrop-blur-2xl transition ${snapshot.isDraggingOver ? 'border-cyan-300/70 bg-cyan-50/80 shadow-cyan-950/10' : 'border-white/50 bg-white/75 shadow-slate-900/10'}`}
              >
                <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/60 px-3 py-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">{status}</h3>
                  <span className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {grouped[status].length}
                  </span>
                </div>
                <div className="min-h-[220px] space-y-3">
                  {grouped[status].map((application, index) => (
                    <Draggable draggableId={application._id} index={index} key={application._id}>
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <ApplicationCard
                            application={application}
                            onClick={() => onCardClick(application)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
