'use client';

import React, { useState } from 'react';
import styles from './TerminalAssignTaskModal.module.css';

interface TerminalAssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: { id: string; name: string; role: string; email?: string }[];
  projects: { id: string; title: string }[];
  onTaskCreated: () => void;
}

export default function TerminalAssignTaskModal({
  isOpen,
  onClose,
  users,
  projects,
  onTaskCreated,
}: TerminalAssignTaskModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedToId: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task Title is required.');
      return;
    }

    setError('');
    setLoading(true);
    setLogs([
      '[SYS_INIT] Initializing Security Audit Dispatcher...',
      `[SYS_CHECK] Validating operator clearance for project: ${form.projectId || 'GENERAL'}...`,
    ]);

    try {
      const res = await fetch('/api/portal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          projectId: form.projectId || undefined,
          assignedToId: form.assignedToId || undefined,
          priority: form.priority,
          dueDate: form.dueDate || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch task assignment.');
      }

      setLogs((prev) => [
        ...prev,
        '[OK] Target clearance check PASSED.',
        '[OK] Task record registered & telemetry dispatched to security kernel.',
      ]);

      setTimeout(() => {
        onTaskCreated();
        onClose();
        setForm({ title: '', description: '', projectId: '', assignedToId: '', priority: 'MEDIUM', dueDate: '' });
        setLogs([]);
      }, 750);
    } catch (err: any) {
      setError(err.message || 'Execution error.');
      setLogs((prev) => [...prev, `[FAIL] Task dispatch failed: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>
            Assign New Task
          </span>
          <button className={styles.closeBtn} onClick={onClose} title="Close window">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.promptBanner}>
            <strong>Task Assignment:</strong> Fill in the task parameters below to assign a new item.
          </div>

          {error && <div className={styles.errorAlert}>[ERROR] {error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="task-title">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                className={styles.input}
                placeholder="e.g. Conduct External VAPT Scan on Subnet 192.168.1.0/24"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="task-desc">
                Description
              </label>
              <textarea
                id="task-desc"
                className={styles.textarea}
                rows={3}
                placeholder="Scope details, target hosts, vulnerability criteria..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="task-assignee">
                  Assign To
                </label>
                <select
                  id="task-assignee"
                  className={styles.select}
                  value={form.assignedToId}
                  onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                  disabled={loading}
                >
                  <option value="">-- UNASSIGNED --</option>
                  {users
                    .filter((u) => ['DEVELOPER', 'HEAD', 'INTERN'].includes(u.role))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} [{u.role}]
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="task-project">
                  Project
                </label>
                <select
                  id="task-project"
                  className={styles.select}
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  disabled={loading}
                >
                  <option value="">-- GENERAL AUDIT --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="task-priority">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className={styles.select}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  disabled={loading}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="task-due">
                  Due Date
                </label>
                <input
                  id="task-due"
                  type="date"
                  className={styles.input}
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {logs.length > 0 && (
              <div className={styles.logsOutput}>
                {logs.map((log, idx) => (
                  <div key={idx}>
                    {log.includes('[OK]') ? (
                      <span className={styles.logOk}>{log}</span>
                    ) : log.includes('[FAIL]') ? (
                      <span className={styles.logErr}>{log}</span>
                    ) : (
                      log
                    )}
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Task...' : 'Create Task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
