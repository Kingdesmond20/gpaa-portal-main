import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';
import { resetPasswordForEmail } from '../lib/authApi';

const ForgotPassword: React.FC = () => {
  usePageTitle('Reset Password', 'Reset your GPAA member portal password.');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resetPasswordForEmail(email);
    } catch {
      // Deliberately swallowed: we always show the same message below
      // regardless of whether the account exists, so this can't be used
      // to enumerate registered emails.
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      showToast("If an account exists for that email, we've sent password reset instructions.", 'success');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-120 mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Reset Your Password</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">
            Enter the email on your account and we'll send you reset instructions.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12"
        >
          {submitted ? (
            <div className="text-center py-4">
              <span className="material-symbols-outlined text-ghana-green text-5xl mb-4" aria-hidden="true">mark_email_read</span>
              <h2 className="text-2xl font-black mb-2 dark:text-white">Check Your Email</h2>
              <p className="text-[#617289] dark:text-gray-400 mb-6">
                If an account exists for <strong>{email}</strong>, you'll receive reset instructions shortly.
              </p>
              <Link to="/login" className="text-primary font-bold hover:underline">
                Back to Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reset-email" className="block font-bold mb-2 dark:text-white">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reset-email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:bg-primary-dark transition-all shadow-lg disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p className="text-center">
                <Link to="/login" className="text-sm font-bold text-primary hover:underline">
                  Back to Log In
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
