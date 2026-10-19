import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { showToast } from '../../components/Toast';
import { getInvitations, inviteUser } from '../../lib/authApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Invitation, UserRole } from '../../types';

const STATUS_STYLES: Record<Invitation['status'], string> = {
  pending: 'bg-ghana-gold/15 text-ghana-gold',
  accepted: 'bg-ghana-green/15 text-ghana-green',
  revoked: 'bg-red-500/10 text-red-500',
};

const AdminDashboard: React.FC = () => {
  usePageTitle('Admin Dashboard', 'Manage GPAA portal invitations and members.');
  const { profile } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [inviting, setInviting] = useState(false);

  const loadInvitations = async () => {
    setInvitationsLoading(true);
    try {
      setInvitations(await getInvitations());
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not load invitations.', 'error');
    } finally {
      setInvitationsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await inviteUser(email, role);
      showToast(`Invitation sent to ${email}.`, 'success');
      setEmail('');
      setRole('member');
      loadInvitations();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not send invitation.', 'error');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-2 dark:text-white">Admin Dashboard</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg mb-4">
            Signed in as <strong>{profile?.email}</strong>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black hover:bg-primary-dark transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-lg">assignment</span>
              Review Membership Applications
            </Link>
            <Link
              to="/admin/documents"
              className="inline-flex items-center gap-2 bg-ghana-green text-white px-5 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-lg">folder</span>
              Manage Documents
            </Link>
            <Link
              to="/admin/awards"
              className="inline-flex items-center gap-2 bg-ghana-gold text-[#111418] px-5 py-3 rounded-xl font-black hover:opacity-90 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-lg">emoji_events</span>
              Manage Awards
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-black mb-4 dark:text-white">Invite Someone</h2>
          <form onSubmit={handleInvite} className="grid sm:grid-cols-[1fr_auto_auto] gap-4 items-end">
            <div>
              <label htmlFor="invite-email" className="block font-bold mb-2 text-sm dark:text-white">
                Email Address
              </label>
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                placeholder="person@example.com"
              />
            </div>
            <div>
              <label htmlFor="invite-role" className="block font-bold mb-2 text-sm dark:text-white">
                Role
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting}
              className="bg-ghana-green text-white px-6 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg disabled:opacity-60"
            >
              {inviting ? 'Sending…' : 'Send Invite'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-black mb-4 dark:text-white">Invitations</h2>
          {invitationsLoading ? (
            <p className="text-[#617289] dark:text-gray-400">Loading…</p>
          ) : invitations.length === 0 ? (
            <p className="text-[#617289] dark:text-gray-400">No invitations sent yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] dark:border-white/10 text-sm font-bold text-[#617289] dark:text-gray-400">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invite) => (
                    <tr key={invite.id} className="border-b border-[#f0f2f4] dark:border-white/5">
                      <td className="py-3 pr-4 font-semibold dark:text-white">{invite.email}</td>
                      <td className="py-3 pr-4 capitalize dark:text-gray-300">{invite.role}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[invite.status]}`}>
                          {invite.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm text-[#617289] dark:text-gray-400">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
