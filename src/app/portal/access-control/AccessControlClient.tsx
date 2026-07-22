'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PortalShell from '@/components/portal/PortalShell';
import { Role } from '@prisma/client';
import styles from './access-control.module.css';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  allowedIp: string | null;
  lastLogin: string | null;
}

interface LoginRequest {
  id: string;
  requestedIp: string;
  currentAllowedIp: string | null;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  createdAt: string;
  adminNote: string | null;
  resolvedAt: string | null;
  user: { id: string; name: string; email: string; role: string };
  resolvedBy?: { id: string; name: string } | null;
}

interface AccessControlClientProps {
  sessionName: string;
  sessionRole: Role;
}

export default function AccessControlClient({ sessionName, sessionRole }: AccessControlClientProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [requests, setRequests] = useState<LoginRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('requests');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editIpValue, setEditIpValue] = useState('');
  const [savingIp, setSavingIp] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [denyModalId, setDenyModalId] = useState<string | null>(null);
  const [denyNote, setDenyNote] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [myIp, setMyIp] = useState<string | null>(null);
  const [detectingIp, setDetectingIp] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDetectIp = useCallback(async () => {
    setDetectingIp(true);
    try {
      const res = await fetch('/api/portal/my-ip');
      const data = await res.json();
      if (data.ip) {
        setMyIp(data.ip);
        return data.ip;
      }
    } catch {
      showToast('Failed to detect IP address', 'error');
    } finally {
      setDetectingIp(false);
    }
    return null;
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/access-control');
      const data = await res.json();
      setUsers(data.users || []);
      setRequests(data.requests || []);
    } catch {
      showToast('Failed to load access control data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    handleDetectIp();
  }, [fetchData, handleDetectIp]);

  const handleSaveIp = async (userId: string) => {
    setSavingIp(true);
    try {
      const res = await fetch(`/api/portal/access-control/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowedIp: editIpValue.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, allowedIp: data.user.allowedIp } : u))
      );
      setEditingUserId(null);
      showToast(`IP updated for ${data.user.name}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update IP', 'error');
    } finally {
      setSavingIp(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const res = await fetch('/api/portal/access-control/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'APPROVE' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Login request approved — IP updated');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async () => {
    if (!denyModalId) return;
    setProcessingId(denyModalId);
    try {
      const res = await fetch('/api/portal/access-control/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: denyModalId, action: 'DENY', adminNote: denyNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Login request denied');
      setDenyModalId(null);
      setDenyNote('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to deny', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.allowedIp || '').includes(searchQuery)
  );

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <PortalShell
      userName={sessionName}
      userRole={sessionRole}
      pageTitle="Access Control"
      pageSubtitle="IP-based login security management"
    >
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
          {toast.msg}
        </div>
      )}

      {/* Deny Modal */}
      {denyModalId && (
        <div className={styles.modalOverlay} onClick={() => setDenyModalId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <i className="fas fa-ban" />
              <span>Deny Login Request</span>
            </div>
            <p className={styles.modalDesc}>
              Optionally provide a reason for denial. The user will be notified.
            </p>
            <textarea
              className={styles.denyTextarea}
              placeholder="Reason for denial (optional)..."
              value={denyNote}
              onChange={(e) => setDenyNote(e.target.value)}
              rows={3}
            />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDenyModalId(null)}>
                Cancel
              </button>
              <button
                className={styles.denyBtn}
                onClick={handleDeny}
                disabled={!!processingId}
              >
                {processingId ? <span className={styles.spinner} /> : <i className="fas fa-ban" />}
                Deny Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitle}>
            <i className="fas fa-shield-halved" />
            IP Access Control
          </div>
          <div className={styles.pageSubtitle}>
            Manage which IP addresses users are allowed to login from
          </div>
        </div>
        <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
          <i className={`fas fa-rotate-right ${loading ? styles.spin : ''}`} />
          Refresh
        </button>
      </div>

      {/* IP Detect Banner */}
      <div className={styles.ipDetectBanner}>
        <div className={styles.ipDetectInfo}>
          <i className="fas fa-location-crosshairs" />
          <span>
            Your Detected IP Address:{' '}
            <code className={styles.detectedIpCode}>{myIp || 'Detecting...'}</code>
          </span>
        </div>
        <div className={styles.ipDetectActions}>
          <span className={styles.adminNoticeBadge}>
            <i className="fas fa-shield-check" />
            Admin & CEO logins are always allowed from any IP
          </span>
          <button
            type="button"
            className={styles.detectBtn}
            onClick={handleDetectIp}
            disabled={detectingIp}
          >
            <i className={`fas fa-arrows-rotate ${detectingIp ? styles.spin : ''}`} />
            Re-detect IP
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-type="pending">
            <i className="fas fa-clock" />
          </div>
          <div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Pending Requests</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-type="users">
            <i className="fas fa-users" />
          </div>
          <div>
            <div className={styles.statValue}>{users.length}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-type="restricted">
            <i className="fas fa-lock" />
          </div>
          <div>
            <div className={styles.statValue}>{users.filter((u) => u.allowedIp).length}</div>
            <div className={styles.statLabel}>IP Restricted</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-type="open">
            <i className="fas fa-lock-open" />
          </div>
          <div>
            <div className={styles.statValue}>{users.filter((u) => !u.allowedIp).length}</div>
            <div className={styles.statLabel}>Unrestricted</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <i className="fas fa-bell" />
          Login Requests
          {pendingCount > 0 && <span className={styles.tabBadge}>{pendingCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users-gear" />
          User IP Management
        </button>
      </div>

      {/* ── REQUESTS TAB ─────────────────────────────────────────── */}
      {activeTab === 'requests' && (
        <div className={styles.section}>
          {loading ? (
            <div className={styles.loadingState}>
              <span className={styles.spinner} />
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-shield-check" />
              <div>No login requests found</div>
              <p>All users are accessing from their authorized IP addresses.</p>
            </div>
          ) : (
            <div className={styles.requestsList}>
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`${styles.requestCard} ${styles[`req_${req.status.toLowerCase()}`]}`}
                >
                  <div className={styles.requestCardLeft}>
                    <div className={styles.requestAvatar}>
                      {req.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.requestInfo}>
                      <div className={styles.requestName}>{req.user.name}</div>
                      <div className={styles.requestEmail}>{req.user.email}</div>
                      <span className={styles.requestRoleBadge}>{req.user.role}</span>
                    </div>
                  </div>

                  <div className={styles.requestIpBlock}>
                    <div className={styles.ipRow}>
                      <span className={styles.ipLabel}>Attempted IP</span>
                      <code className={styles.ipCode + ' ' + styles.ipDanger}>{req.requestedIp}</code>
                    </div>
                    <div className={styles.ipRow}>
                      <span className={styles.ipLabel}>Authorized IP</span>
                      <code className={styles.ipCode}>{req.currentAllowedIp || '—'}</code>
                    </div>
                    <div className={styles.ipRow}>
                      <span className={styles.ipLabel}>Requested at</span>
                      <span className={styles.ipTime}>{formatDate(req.createdAt)}</span>
                    </div>
                  </div>

                  <div className={styles.requestStatus}>
                    <span className={`${styles.statusPill} ${styles[`status_${req.status.toLowerCase()}`]}`}>
                      <i
                        className={`fas ${
                          req.status === 'PENDING'
                            ? 'fa-clock'
                            : req.status === 'APPROVED'
                            ? 'fa-circle-check'
                            : 'fa-circle-xmark'
                        }`}
                      />
                      {req.status}
                    </span>
                    {req.status === 'PENDING' && (
                      <div className={styles.requestActions}>
                        <button
                          className={styles.approveBtn}
                          onClick={() => handleApprove(req.id)}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? (
                            <span className={styles.spinner} />
                          ) : (
                            <i className="fas fa-circle-check" />
                          )}
                          Approve
                        </button>
                        <button
                          className={styles.denyBtnSmall}
                          onClick={() => { setDenyModalId(req.id); setDenyNote(''); }}
                          disabled={!!processingId}
                        >
                          <i className="fas fa-ban" />
                          Deny
                        </button>
                      </div>
                    )}
                    {req.status !== 'PENDING' && req.resolvedBy && (
                      <div className={styles.resolvedBy}>
                        Resolved by {req.resolvedBy.name}
                        <br />
                        {formatDate(req.resolvedAt)}
                      </div>
                    )}
                    {req.adminNote && (
                      <div className={styles.adminNote}>
                        <i className="fas fa-note-sticky" /> {req.adminNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── USER IP MANAGEMENT TAB ───────────────────────────────── */}
      {activeTab === 'users' && (
        <div className={styles.section}>
          <div className={styles.searchBar}>
            <i className="fas fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search by name, email or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <span className={styles.spinner} />
              Loading users...
            </div>
          ) : (
            <div className={styles.usersTable}>
              <div className={styles.tableHeader}>
                <div>User</div>
                <div>Role</div>
                <div>Allowed IP</div>
                <div>Last Login</div>
                <div>Action</div>
              </div>
              {filteredUsers.map((u) => (
                <div key={u.id} className={styles.tableRow}>
                  <div className={styles.userCell}>
                    <div className={styles.tableAvatar}>{u.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className={styles.userName}>{u.name}</div>
                      <div className={styles.userEmail}>{u.email}</div>
                    </div>
                  </div>
                  <div>
                    <span className={styles.rolePill}>{u.role}</span>
                  </div>
                  <div className={styles.ipCell}>
                    {editingUserId === u.id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%' }}>
                        <input
                          type="text"
                          className={styles.ipInput}
                          value={editIpValue}
                          onChange={(e) => setEditIpValue(e.target.value)}
                          placeholder="e.g. 192.168.1.1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveIp(u.id);
                            if (e.key === 'Escape') setEditingUserId(null);
                          }}
                        />
                        <button
                          type="button"
                          className={styles.detectBtn}
                          style={{ padding: '6px 8px', fontSize: '11px' }}
                          title="Detect and use my current IP address"
                          onClick={async () => {
                            const detected = await handleDetectIp();
                            if (detected) setEditIpValue(detected);
                          }}
                        >
                          <i className="fas fa-crosshairs" />
                        </button>
                      </div>
                    ) : u.allowedIp ? (
                      <code className={styles.ipCodeTable}>{u.allowedIp}</code>
                    ) : (
                      <span className={styles.noIp}>
                        <i className="fas fa-lock-open" /> Unrestricted
                      </span>
                    )}
                  </div>
                  <div className={styles.lastLogin}>{formatDate(u.lastLogin)}</div>
                  <div className={styles.actionCell}>
                    {editingUserId === u.id ? (
                      <div className={styles.editActions}>
                        <button
                          className={styles.saveBtn}
                          onClick={() => handleSaveIp(u.id)}
                          disabled={savingIp}
                        >
                          {savingIp ? <span className={styles.spinner} /> : <i className="fas fa-check" />}
                          Save
                        </button>
                        <button
                          className={styles.cancelEditBtn}
                          onClick={() => setEditingUserId(null)}
                        >
                          <i className="fas fa-xmark" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditingUserId(u.id);
                          setEditIpValue(u.allowedIp || '');
                        }}
                      >
                        <i className="fas fa-pen-to-square" />
                        {u.allowedIp ? 'Edit IP' : 'Set IP'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className={styles.emptyTable}>No users match your search.</div>
              )}
            </div>
          )}
        </div>
      )}
    </PortalShell>
  );
}
