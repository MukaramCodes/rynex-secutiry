'use client';

import { useState, useEffect, useCallback } from 'react';
import PortalShell from '@/components/portal/PortalShell';
import StatusBadge, { statusVariantForTaskStatus } from '@/components/portal/StatusBadge';
import TerminalTaskModal, { TerminalTask } from '@/components/portal/TerminalTaskModal';
import TerminalAssignTaskModal from '@/components/portal/TerminalAssignTaskModal';
import { Role } from '@prisma/client';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  assignedTo?: { id: string; name: string; email: string } | null;
  assignedBy?: { id: string; name: string } | null;
  project?: { id: string; title: string } | null;
}

interface CurrentUser {
  userId: string;
  name: string;
  role: Role;
  email: string;
  mustChangePassword: boolean;
}

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE'];

const PRIORITY_BADGE: Record<string, 'neutral' | 'info' | 'warning' | 'danger'> = {
  LOW: 'neutral',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate: string | null, status: string) {
  if (!dueDate || status === 'DONE') return false;
  return new Date(dueDate) < new Date();
}

export default function TasksPage() {
  const [session, setSession] = useState<CurrentUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TerminalTask | null>(null);
  const [showInspectModal, setShowInspectModal] = useState(false);

  const [users, setUsers] = useState<{ id: string; name: string; role: string; email?: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);

  const fetchSession = useCallback(async () => {
    const res = await fetch('/api/portal/auth/me');
    if (res.ok) {
      const data = await res.json();
      setSession({ userId: data.user.id, name: data.user.name, role: data.user.role, email: data.user.email, mustChangePassword: data.user.mustChangePassword });
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/portal/tasks');
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSession();
    fetchTasks();

    Promise.all([
      fetch('/api/portal/users').then((r) => r.json()),
      fetch('/api/portal/projects').then((r) => r.json()),
    ]).then(([uData, pData]) => {
      setUsers(uData.users ?? []);
      setProjects(pData.projects ?? []);
    });
  }, [fetchSession, fetchTasks]);

  const canCreate = session && ['CEO', 'ADMIN', 'DEVELOPER', 'HEAD', 'DIRECTOR'].includes(session.role);

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleInspectTask = (task: Task) => {
    setSelectedTask({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project: task.project,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt,
    });
    setShowInspectModal(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    await fetch('/api/portal/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, status: newStatus }),
    });
    fetchTasks();
  };

  if (!session) return null;

  const grouped = {
    TODO: filtered.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: filtered.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: filtered.filter((t) => t.status === 'DONE'),
  };

  return (
    <PortalShell
      userName={session.name}
      userRole={session.role}
      pageTitle="Tasks"
      pageSubtitle={session.role === 'INTERN' ? 'Your assigned tasks' : 'Team task board'}
    >
      <div className="portal-page-header">
        <div>
          <div className="portal-page-title">Tasks Board</div>
          <div className="portal-page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} registered</div>
        </div>
        {canCreate && (
          <button id="create-task-btn" className="btn btn-primary" onClick={() => setShowAssignModal(true)}>
            <i className="fas fa-plus" /> Assign New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="portal-card" style={{ marginBottom: 20 }}>
        <div className="portal-card-body" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <i className="fa fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-muted)', fontSize: 13 }} />
              <input type="text" className="form-control" placeholder="Search task telemetry…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 34 }} id="task-search" />
            </div>
            <select id="task-status-filter" className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: 130 }}>
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <select id="task-priority-filter" className="form-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ width: 'auto', minWidth: 130 }}>
              <option value="ALL">All Priorities</option>
              {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="portal-empty"><div className="portal-spinner portal-spinner-lg" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((col) => (
            <div key={col}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid var(--portal-border)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: col === 'TODO' ? 'var(--status-warning)' :
                    col === 'IN_PROGRESS' ? 'var(--status-info)' : 'var(--status-success)',
                }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--portal-text-primary)' }}>
                  [ {col.replace('_', ' ')} ]
                </span>
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--portal-bg-secondary)',
                  color: 'var(--portal-text-primary)',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 10,
                  border: '1px solid var(--portal-border)',
                }}>
                  {grouped[col].length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {grouped[col].length === 0 ? (
                  <div style={{
                    border: '1px dashed var(--portal-border)',
                    borderRadius: 'var(--portal-radius)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--portal-text-muted)',
                    fontSize: 12,
                  }}>
                    No tasks in queue
                  </div>
                ) : (
                  grouped[col].map((task) => (
                    <div
                      key={task.id}
                      className="portal-card"
                      style={{ padding: 16, cursor: 'pointer' }}
                      onClick={() => handleInspectTask(task)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, flex: 1, marginRight: 8, color: 'var(--portal-text-primary)' }}>
                          {task.title}
                        </div>
                        <StatusBadge label={task.priority} variant={PRIORITY_BADGE[task.priority] ?? 'neutral'} />
                      </div>

                      {task.description && (
                        <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
                          {task.description.slice(0, 80)}{task.description.length > 80 ? '…' : ''}
                        </p>
                      )}

                      <div style={{ fontSize: 11.5, color: 'var(--portal-text-muted)', marginBottom: 10 }}>
                        {task.project && (
                          <div style={{ marginBottom: 3 }}>
                            <i className="fa fa-folder-open" style={{ marginRight: 5, color: 'var(--portal-accent)' }} />
                            {task.project.title}
                          </div>
                        )}
                        {task.assignedTo && (
                          <div style={{ marginBottom: 3 }}>
                            <i className="fa fa-user" style={{ marginRight: 5, color: 'var(--portal-text-primary)' }} />
                            {task.assignedTo.name}
                          </div>
                        )}
                        {task.dueDate && (
                          <div style={{ color: isOverdue(task.dueDate, task.status) ? 'var(--status-danger)' : 'inherit' }}>
                            <i className="fa fa-calendar" style={{ marginRight: 5 }} />
                            {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate, task.status) && ' (overdue)'}
                          </div>
                        )}
                      </div>

                      {/* Action trigger */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid var(--portal-border-light)' }}>
                        <span style={{ fontSize: 11, color: 'var(--portal-accent)', fontWeight: 600 }}>
                          View Details &rarr;
                        </span>
                        {col !== 'DONE' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 11, padding: '2px 8px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, col === 'TODO' ? 'IN_PROGRESS' : 'DONE');
                            }}
                          >
                            {col === 'TODO' ? 'Start' : 'Mark Done'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Terminal Assign Task Modal */}
      <TerminalAssignTaskModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        users={users}
        projects={projects}
        onTaskCreated={fetchTasks}
      />

      {/* Terminal Task Inspector Modal */}
      <TerminalTaskModal
        task={selectedTask}
        isOpen={showInspectModal}
        onClose={() => setShowInspectModal(false)}
        onStatusUpdate={handleStatusChange}
      />
    </PortalShell>
  );
}
