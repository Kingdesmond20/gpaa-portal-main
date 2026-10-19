import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const images = [
  '/images/21st-conference/21st Annual Confrence GPAA-138.jpg',
  '/images/21st-conference/21st Annual Confrence GPAA-148.jpg',
  '/images/21st-conference/21st Annual Confrence GPAA-179.jpg',
  '/images/21st-conference/21st Annual Confrence GPAA-185.jpg',
];

const Conference21st: React.FC = () => {
  usePageTitle('21st Annual Conference', 'Highlights from the 21st Annual GPAA Conference.');
  return (
    <div className="bg-white dark:bg-[#14181c]">
      <section className="bg-linear-to-br from-primary via-primary-dark to-[#0a4296] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/events" className="hover:text-white">Events</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/events/conference-archive" className="hover:text-white">Conference Archive</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary-light">21st Conference</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">21st Annual Conference</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl">
            Highlights and moments captured from the 21st GPAA Annual Conference.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-background-light dark:bg-[#0c0f12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {images.map((image, idx) => (
              <motion.figure
                key={image}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-[#14181c] rounded-2xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all group"
              >
                <div className="overflow-hidden">
                  <img
                    src={image}
                    alt={`21st conference photo ${idx + 1}`}
                    className="w-full h-72 md:h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </motion.figure>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/events/conference-archive"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Conference21st;
