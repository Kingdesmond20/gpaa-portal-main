import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  usePageTitle('Page Not Found', 'The page you\'re looking for doesn\'t exist or may have been moved.');
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-[#14181c] px-6 py-20">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center max-w-lg"
      >
        <p className="text-primary font-black text-7xl md:text-8xl mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-black mb-4">Page Not Found</h1>
        <p className="text-[#617289] text-lg mb-10">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black hover:bg-primary-dark transition-all shadow-lg"
          >
            <span className="material-symbols-outlined" aria-hidden="true">home</span>
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-2 border-[#e5e7eb] text-[#111418] px-6 py-3 rounded-xl font-black hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined" aria-hidden="true">support_agent</span>
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
