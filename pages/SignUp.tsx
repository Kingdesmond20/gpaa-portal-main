import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * GPAA portal accounts aren't self-registered — membership is applied for
 * and vetted (/membership/join), and portal access (member or admin) is
 * granted by an invite email once an admin creates it. This page used to be
 * a real signup form with no backend behind it; it's now the explanation +
 * hand-off to the two real entry points.
 */
const SignUp: React.FC = () => {
  usePageTitle('Get Portal Access', 'How to get access to the GPAA member portal.');

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-120 mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Get Portal Access</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">
            GPAA member portal accounts aren't self-registered — here's how access works.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12 space-y-8"
        >
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-ghana-green text-3xl shrink-0" aria-hidden="true">
              assignment_turned_in
            </span>
            <div>
              <h2 className="text-xl font-black mb-2 dark:text-white">Applying for GPAA membership?</h2>
              <p className="text-[#617289] dark:text-gray-400 mb-4">
                Submit a membership application. Once it's reviewed and approved, you'll receive an email
                invite to set up your portal login.
              </p>
              <Link
                to="/membership/join"
                className="inline-block bg-ghana-green text-white px-6 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg"
              >
                Start Membership Application
              </Link>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] dark:border-white/10" />

          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0" aria-hidden="true">
              mark_email_unread
            </span>
            <div>
              <h2 className="text-xl font-black mb-2 dark:text-white">Already been invited?</h2>
              <p className="text-[#617289] dark:text-gray-400">
                Check your email for a GPAA portal invite and click the link inside to set your password —
                it'll take you straight in.
              </p>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] dark:border-white/10" />

          <div className="text-center">
            <p className="text-[#617289] dark:text-gray-400">
              Already have a password? <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#e5e7eb] dark:border-white/10 text-sm font-bold text-[#111418] dark:text-white hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">help</span>
              Need Help?
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#e5e7eb] dark:border-white/10 text-sm font-bold text-[#111418] dark:text-white hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">info</span>
              Membership Benefits
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
