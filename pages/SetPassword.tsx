import React, { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';
import { getProfile, updatePassword } from '../lib/authApi';
import { useAuth } from '../contexts/AuthContext';

/**
 * Landing page for both the "accept invite" and "reset password" email
 * links (routes /accept-invite and /reset-password). Supabase's invite and
 * recovery emails both redirect here with the visitor already in an
 * authenticated recovery session — this page's only job is to let them set
 * a new password to activate it.
 */
const SetPassword: React.FC = () => {
  usePageTitle('Set Your Password', 'Set your password to access the GPAA member portal.');
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      showToast('Password set — welcome to the GPAA member portal!', 'success');
      // Fetch the role fresh — the context's profile may still be loading, which
      // would send an invited admin to the member dashboard.
      const profile = session ? await getProfile(session.user.id).catch(() => null) : null;
      navigate(profile?.role === 'admin' ? '/admin' : '/membership/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set your password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (!session) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
        <div className="max-w-120 mx-auto text-center bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12">
          <span className="material-symbols-outlined text-primary text-5xl mb-4" aria-hidden="true">link_off</span>
          <h1 className="text-2xl font-black mb-2 dark:text-white">Link Expired or Invalid</h1>
          <p className="text-[#617289] dark:text-gray-400">
            This invite or reset link is no longer valid. Please request a new one, or contact GPAA for help.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-120 mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Set Your Password</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">
            Choose a password for <strong>{session.user.email}</strong> to activate your GPAA portal account.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                ref={errorRef}
                id="set-password-error"
                role="alert"
                tabIndex={-1}
                className="bg-red-50 border-2 border-red-500 text-red-700 dark:bg-red-950/40 dark:border-red-500 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 outline-none"
              >
                <span className="material-symbols-outlined" aria-hidden="true">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="new-password" className="block font-bold mb-2 dark:text-white">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="block font-bold mb-2 dark:text-white">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm-new-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ghana-green text-white py-4 rounded-xl font-black text-lg hover:bg-green-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {submitting ? 'Setting Password…' : 'Set Password & Continue'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SetPassword;
