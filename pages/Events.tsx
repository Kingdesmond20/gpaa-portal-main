import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENTS } from '../constants';
import { showToast } from '../components/Toast';

const Events: React.FC = () => {
  usePageTitle('Events', 'Upcoming and past GPAA events, conferences, and CPD workshops for Physician Assistants across Ghana.');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const filteredEvents = filter === 'all'
    ? EVENTS
    : EVENTS.filter(e => e.type === filter);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — swap this for a real POST /api/newsletter/subscribe once Phase 2 lands.
    showToast("Thanks for subscribing! We'll send event updates to your inbox.", 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-primary via-primary-dark to-[#0a4296] py-24"
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
              Events & Conferences
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Join us at our professional development events, annual conferences, and community health outreaches across Ghana
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Filter Tabs */}
      <section className="sticky top-16 bg-white/95 dark:bg-[#14181c]/95 backdrop-blur-md border-b border-[#e5e7eb] dark:border-white/10 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-4">
          {[
            { value: 'all', label: 'All Events' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past Events' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value as any)}
              className={`px-8 py-3 rounded-xl font-bold cursor-pointer transition-all ${
                filter === value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-background-light dark:bg-white/5 text-[#617289] dark:text-gray-400 hover:bg-[#e5e7eb] dark:hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#14181c] rounded-3xl overflow-hidden border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-2xl transition-all group"
            >
              <div className="h-64 overflow-hidden">
                <img
              loading="lazy"
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                    event.type === 'upcoming'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-4 dark:text-white group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-[#617289] dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    <span className="font-bold">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#617289] dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="font-bold">{event.location}</span>
                  </div>
                </div>
                <p className="text-[#617289] dark:text-gray-400 leading-relaxed mb-6">{event.description}</p>
                <button
                  type="button"
                  onClick={() => showToast(
                    event.type === 'upcoming'
                      ? `Registration for "${event.title}" opens soon — check back or contact us for details.`
                      : `Details for "${event.title}" will be published here soon.`,
                    'info'
                  )}
                  className="w-full cursor-pointer bg-primary text-white py-3 rounded-xl font-bold hover:text-primary hover:bg-white hover:border-2 hover:border-primary transition-all"
                >
                  {event.type === 'upcoming' ? 'Register Now' : 'View Details'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conference Archive Teaser */}
      <section className="py-24 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center size-20 bg-primary/10 rounded-full mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">event_available</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white">Explore Our Conference History</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Discover over 20 years of annual conferences that have shaped the PA profession in Ghana
            </p>
            <Link
              to="/events/conference-archive"
              className="inline-block bg-primary cursor-pointer text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
            >
              View Conference Archive
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-225 mx-auto bg-linear-to-br from-primary to-primary-dark rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-6">Don't Miss Our Next Event</h2>
          <p className="text-white/90 text-xl mb-8">
            Subscribe to our newsletter to receive event updates and early registration access
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-lg mx-auto">
            <label htmlFor="events-newsletter-email" className="sr-only">Email address</label>
            <input
              id="events-newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-[#111418] outline-none bg-white placeholder:text-[#617289] transition-all focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            <button type="submit" className="bg-white cursor-pointer text-primary px-4 py-4 rounded-xl font-black hover:bg-primary hover:border-2 hover:text-white transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Events;
