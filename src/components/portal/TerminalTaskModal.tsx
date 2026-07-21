'use client';

import React, { useState } from 'react';
import styles from './TerminalTaskModal.module.css';

export interface TerminalTask {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  project?: { title: string } | null;
  assignedTo?: { name: string; email: string } | null;
  dueDate?: string | null;
  createdAt?: string | null;
}

interface TerminalTaskModalProps {
  task: TerminalTask | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => Promise<void>;
}

export default function TerminalTaskModal({
  task,
  isOpen,
  onClose,
  onStatusUpdate,
}: TerminalTaskModalProps) {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>(
    task?.status || 'TODO'
  );

  if (!isOpen || !task) return null;

  const handleStatusChange = async (newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    if (newStatus === currentStatus || updating) return;
    setUpdating(true);
    setCurrentStatus(newStatus);

    try {
      if (onStatusUpdate) {
        await onStatusUpdate(task.id, newStatus);
      } else {
        // Fallback default API call
        await fetch(`/api/portal/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const shortId = task.id ? `TSK-${task.id.slice(0, 8).toUpperCase()}` : 'TSK-0000';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>
            Task Details
          </span>
          <button className={styles.closeBtn} onClick={onClose} title="Close window">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.cliPrompt}>
            <span>Viewing Task:</span>
            <span className={styles.cliCommand}>{shortId}</span>
          </div>

          <div className={styles.logBox}>
            <div className={styles.gridRow}>
              <span className={styles.key}>TASK_ID</span>
              <span className={styles.val}>{shortId}</span>
            </div>
            <div className={styles.gridRow}>
              <span className={styles.key}>TITLE</span>
              <span className={styles.val}>{task.title}</span>
            </div>
            <div className={styles.gridRow}>
              <span className={styles.key}>PROJECT</span>
              <span className={styles.val}>{task.project?.title || 'General Operations'}</span>
            </div>
            <div className={styles.gridRow}>
              <span className={styles.key}>ASSIGNED_TO</span>
              <span className={styles.val}>
                {task.assignedTo?.name || 'Unassigned'} ({task.assignedTo?.email || 'N/A'})
              </span>
            </div>
            <div className={styles.gridRow}>
              <span className={styles.key}>PRIORITY</span>
              <span className={styles.val}>[ {task.priority || 'MEDIUM'} ]</span>
            </div>
            <div className={styles.gridRow}>
              <span className={styles.key}>CURRENT_STATUS</span>
              <span className={styles.val}>[ {currentStatus} ]</span>
            </div>

            {task.description && (
              <div className={styles.descriptionBox}>
                <strong>Objective & Scope:</strong>
                <br />
                {task.description}
              </div>
            )}

            <div className={styles.telemetryLogs}>
              <div className={styles.telemetryLine}>
                <span className={styles.ts}>[LOG_01]</span> System initialized audit environment for task {shortId}.
              </div>
              <div className={styles.telemetryLine}>
                <span className={styles.ts}>[LOG_02]</span> Active status recorded as {currentStatus}.
              </div>
              <div className={styles.telemetryLine}>
                <span className={styles.ts}>[LOG_03]</span> Awaiting worker submission & telemetry verification.
              </div>
            </div>
          </div>

          <div className={styles.statusSection}>
            <span className={styles.statusLabel}>Update Status:</span>
            <div className={styles.statusButtons}>
              <button
                className={`${styles.statusBtn} ${
                  currentStatus === 'TODO' ? styles.statusBtnActiveTodo : ''
                }`}
                onClick={() => handleStatusChange('TODO')}
                disabled={updating}
              >
                [ TODO ]
              </button>
              <button
                className={`${styles.statusBtn} ${
                  currentStatus === 'IN_PROGRESS' ? styles.statusBtnActiveProgress : ''
                }`}
                onClick={() => handleStatusChange('IN_PROGRESS')}
                disabled={updating}
              >
                [ IN_PROGRESS ]
              </button>
              <button
                className={`${styles.statusBtn} ${
                  currentStatus === 'DONE' ? styles.statusBtnActiveDone : ''
                }`}
                onClick={() => handleStatusChange('DONE')}
                disabled={updating}
              >
                [ DONE / RESOLVED ]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
