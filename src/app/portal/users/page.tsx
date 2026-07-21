'use client';

import React, { useState, useEffect } from 'react';
import styles from './users.module.css';
import { DEPARTMENT_LABELS } from '@/lib/portal/permissions';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string | null;
  teamId: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  originalEmail?: string | null;
  joiningDate?: string | null;
  probationStart?: string | null;
  probationEnd?: string | null;
}

interface TeamData {
  id: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INTERN');
  const [department, setDepartment] = useState('TECHNICAL');
  const [teamId, setTeamId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Current session
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [probationStart, setProbationStart] = useState('');
  const [probationEnd, setProbationEnd] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const meRes = await fetch('/api/portal/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUserRole(meData.user.role);
      }

      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      if (!usersRes.ok) throw new Error(usersData.error || 'Failed to fetch users');
      setUsers(usersData.users || []);

      const teamsRes = await fetch('/api/teams');
      const teamsData = await teamsRes.json();
      if (teamsRes.ok) {
        setTeams(teamsData.teams || []);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role,
          department,
          password,
          teamId: teamId || null,
          originalEmail: originalEmail || null,
          joiningDate: joiningDate || null,
          probationStart: probationStart || null,
          probationEnd: probationEnd || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      await fetchData();
      setShowCreateModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('INTERN');
      setDepartment('TECHNICAL');
      setTeamId('');
      setOriginalEmail('');
      setJoiningDate('');
      setProbationStart('');
      setProbationEnd('');
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle status');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitError('');
    setSubmitLoading(true);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetPassword: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setShowResetModal(false);
      setNewPassword('');
      setSelectedUser(null);
      alert(`Password for ${selectedUser.name} reset successfully! Credentials sent to their email.`);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user ${userName}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === 'ALL' || (u.department || 'TECHNICAL') === departmentFilter;
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchDept && matchRole;
  });

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Personnel Operations</h1>
          <p className={styles.pageSubtitle}>Review team rosters across Red Team, Blue Team, Technical &amp; GRC departments.</p>
        </div>
        {currentUserRole === 'ADMIN' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className={styles.createBtn}
          >
            <i className="fas fa-user-plus" aria-hidden="true"></i>
            <span>Create Account</span>
          </button>
        )}
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search personnel by name/email..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          <option value="RED_TEAM">🔴 Red Team (Offensive)</option>
          <option value="BLUE_TEAM">🔵 Blue Team (Defensive)</option>
          <option value="TECHNICAL">🟢 Technical (Engineering)</option>
          <option value="GRC">🟣 GRC (Compliance)</option>
          <option value="OPERATIONS">🟡 Operations</option>
        </select>
        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="CEO">CEO</option>
          <option value="ADMIN">ADMIN</option>
          <option value="DIRECTOR">DIRECTOR</option>
          <option value="HEAD">HEAD</option>
          <option value="DEVELOPER">DEVELOPER</option>
          <option value="INTERN">INTERN</option>
          <option value="CLIENT">CLIENT</option>
        </select>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <div className={styles.loadingArea}>Retrieving user roster...</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Team</th>
                <th>Status</th>
                <th>Last Login</th>
                {(currentUserRole === 'CEO' || currentUserRole === 'ADMIN') && (
                  <>
                    <th>Original Email</th>
                    <th>Joining Date</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const deptKey = user.department || 'TECHNICAL';
                return (
                  <tr key={user.id}>
                    <td className={styles.primaryCell}>{user.name}</td>
                    <td className={styles.monoCell}>{user.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.departmentBadge} ${styles[deptKey.toLowerCase()]}`}>
                        {DEPARTMENT_LABELS[deptKey] || deptKey}
                      </span>
                    </td>
                    <td>
                      {teams.find((t) => t.id === user.teamId)?.name || <span className={styles.none}>Unassigned</span>}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`${styles.statusToggle} ${user.isActive ? styles.active : styles.inactive}`}
                        title={user.isActive ? 'Deactivate Account' : 'Activate Account'}
                      >
                        {user.isActive ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className={styles.dateCell}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    {(currentUserRole === 'CEO' || currentUserRole === 'ADMIN') && (
                      <>
                        <td className={styles.monoCell}>{user.originalEmail || <span className={styles.none}>None</span>}</td>
                        <td className={styles.dateCell}>{user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : '—'}</td>
                      </>
                    )}
                    <td>
                      {currentUserRole === 'ADMIN' && (
                        <div className={styles.actions}>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowResetModal(true);
                            }}
                            className={styles.resetBtn}
                            title="Reset password"
                          >
                            <i className="fas fa-key" aria-hidden="true"></i> Reset Pass
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className={styles.deleteBtn}
                            title="Delete user"
                          >
                            <i className="fas fa-trash" aria-hidden="true"></i> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={10} className={styles.empty}>No personnel records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CREATE USER MODAL --- */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Create Custom Account</h3>
              <button onClick={() => { setShowCreateModal(false); setSubmitError(''); }} className={styles.closeBtn}>
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
            
            {submitError && <div className={styles.modalError}>{submitError}</div>}

            <form onSubmit={handleCreateUser} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.modalInput}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.modalInput}
                  placeholder="e.g. john@rynexsecurity.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={styles.modalSelect}
                >
                  <option value="INTERN">INTERN</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="HEAD">HEAD</option>
                  <option value="DIRECTOR">DIRECTOR</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="CEO">CEO</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={styles.modalSelect}
                >
                  <option value="RED_TEAM">🔴 Red Team (Offensive VAPT)</option>
                  <option value="BLUE_TEAM">🔵 Blue Team (Defensive SOC)</option>
                  <option value="TECHNICAL">🟢 Technical (Engineering)</option>
                  <option value="GRC">🟣 GRC (Compliance)</option>
                  <option value="OPERATIONS">🟡 Operations</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>Assigned Team (Optional)</label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className={styles.modalSelect}
                >
                  <option value="">No Team Assigned</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>Temporary Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.modalInput}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setSubmitError(''); }}
                  className={styles.cancelBtn}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESET PASSWORD MODAL --- */}
      {showResetModal && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Reset Password for {selectedUser.name}</h3>
              <button onClick={() => { setShowResetModal(false); setSubmitError(''); }} className={styles.closeBtn}>
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
            
            {submitError && <div className={styles.modalError}>{submitError}</div>}

            <form onSubmit={handleResetPassword} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.modalLabel}>New Temporary Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.modalInput}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => { setShowResetModal(false); setSubmitError(''); }}
                  className={styles.cancelBtn}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Updating...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
