import React, { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';
import { signIn, getProfile } from '../lib/authApi';

const Login: React.FC = () => {
  usePageTitle('Log In', 'Log in to your GPAA member portal to access membership benefits and resources.');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { user } = await signIn(formData.email, formData.password);
      showToast('Welcome back!', 'success');
      const profile = user ? await getProfile(user.id).catch(() => null) : null;
      navigate(profile?.role === 'admin' ? '/admin' : '/membership/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-120 mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Welcome Back</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">
            Log in to access your GPAA member portal. New to GPAA? <Link to="/signup" className="text-primary font-bold hover:underline">Learn how to get access</Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12 max-w-120"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                ref={errorRef}
                id="login-error"
                role="alert"
                tabIndex={-1}
                className="bg-red-50 border-2 border-red-500 text-red-700 dark:bg-red-950/40 dark:border-red-500 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 outline-none"
              >
                <span className="material-symbols-outlined" aria-hidden="true">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block font-bold mb-2 dark:text-white">Email Address <span className="text-red-500">*</span></label>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block font-bold mb-2 dark:text-white">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  aria-invalid={!!error}
                  aria-describedby={error ? 'login-error' : undefined}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#617289] dark:text-gray-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="size-5"
                />
                <span className="text-sm font-semibold text-[#617289] dark:text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ghana-green text-white py-4 rounded-xl font-black text-lg hover:bg-green-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {submitting ? 'Logging In…' : 'Log In'}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb] dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#14181c] text-[#617289] dark:text-gray-400 font-semibold">OR</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[#617289] dark:text-gray-400 mb-4">New to GPAA?</p>
              <Link
                to="/membership/join"
                className="inline-block w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
              >
                Apply for Membership
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#e5e7eb] dark:border-white/15 text-sm font-bold text-[#111418] dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">help</span>
                Need Help?
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#e5e7eb] dark:border-white/15 text-sm font-bold text-[#111418] dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">info</span>
                Membership Benefits
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
