import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ConferenceArchive: React.FC = () => {
  usePageTitle('Conference Archive', 'Browse GPAA\'s annual conference archive, featuring past national gatherings of Physician Assistants in Ghana.');
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const conferences = [
    { rank: '22nd', year: '2025', theme: 'Digital Health Transformation', location: 'Accra International Conference Centre', attendance: '1200+', link: '/events/conference-archive/22nd' },
    { rank: '21st', year: '2024', theme: 'Universal Health Coverage Now', location: 'Kumasi Convention Centre', attendance: '1100+', link: '/events/conference-archive/21st' },
    { rank: '20th', year: '2023', theme: 'PAs Leading Primary Care', location: 'Labadi Beach Hotel, Accra', attendance: '950+' },
    { rank: '19th', year: '2022', theme: 'Post-Pandemic Healthcare', location: 'Golden Tulip Hotel, Kumasi', attendance: '800+' },
    { rank: '18th', year: '2021', theme: 'Resilience in Crisis', location: 'Virtual Conference', attendance: '1500+' },
    { rank: '17th', year: '2020', theme: 'Innovation & Technology', location: 'Movenpick Ambassador Hotel, Accra', attendance: '900+' },
    { rank: '16th', year: '2019', theme: 'Quality Healthcare for All', location: 'Alisa Hotel, Accra', attendance: '850+' },
    { rank: '15th', year: '2018', theme: 'Professional Excellence', location: 'Miklin Hotel, Kumasi', attendance: '750+' },
    { rank: '14th', year: '2017', theme: 'Community Health Impact', location: 'Coconut Grove Hotel, Accra', attendance: '720+' },
    { rank: '13th', year: '2016', theme: '50 Years of Service', location: 'Tang Palace Hotel, Accra', attendance: '1000+' },
    { rank: '12th', year: '2015', theme: 'Advancing Clinical Practice', location: 'Best Western Plus, Accra', attendance: '680+' },
    { rank: '11th', year: '2014', theme: 'Healthcare Delivery Excellence', location: 'Erata Hotel, Accra', attendance: '650+' },
  ];

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
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/events" className="hover:text-white">Events</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary-light">Conference Archive</span>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
              Annual Conference Archive
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl leading-relaxed">
              Celebrating over 20 years of professional excellence, knowledge sharing, and community building
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Introduction */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-background-light dark:bg-[#0c0f12] p-10 md:p-12 rounded-3xl border border-[#e5e7eb] dark:border-white/10"
        >
          <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed">
            Our Annual General Conference is the flagship event of the Ghana Physician Assistants Association, bringing together PAs from across the nation for continuing professional development, networking, policy discussions, and celebrating our collective impact on Ghana's healthcare system. Each year's conference reflects our commitment to clinical excellence and professional growth.
          </p>
        </motion.div>
      </section>

      {/* Conference Archive Grid */}
      <section className="py-16 px-6 bg-background-light dark:bg-[#0c0f12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conferences.map((conf, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="text-6xl font-black text-primary mb-4 group-hover:scale-110 transition-transform">
                  {conf.year}
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-primary/80 mb-3">
                  {conf.rank} Annual Conference
                </p>
                <h3 className="text-2xl font-black text-[#111418] dark:text-white mb-4 leading-tight">
                  {conf.theme}
                </h3>
                <div className="space-y-2 text-[#617289] dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
                    <span className="text-sm font-bold">{conf.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">groups</span>
                    <span className="text-sm font-bold">{conf.attendance} Attendees</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#e5e7eb] dark:border-white/10">
                  {conf.link ? (
                    <Link to={conf.link} className="text-primary cursor-pointer font-bold text-sm hover:text-primary-dark transition-colors flex items-center gap-2 group-hover:gap-3">
                      View Conference Photos
                      <span className="material-symbols-outlined text-lg transition-all">arrow_forward</span>
                    </Link>
                  ) : (
                    <span className="text-[#617289] dark:text-gray-400 font-bold text-sm flex items-center gap-2">
                      Archive record only
                      <span className="material-symbols-outlined text-lg">inventory_2</span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white dark:bg-[#14181c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Conference Impact</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Our annual conferences continue to grow in reach and influence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '20+', label: 'Years of Conferences', icon: 'event_available' },
              { number: '12,000+', label: 'Total Attendees', icon: 'groups' },
              { number: '500+', label: 'Speaker Sessions', icon: 'mic' },
              { number: '100+', label: 'CPD Hours Delivered', icon: 'school' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background-light dark:bg-[#0c0f12] p-8 rounded-2xl text-center border border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">{stat.icon}</span>
                </div>
                <div className="text-4xl font-black text-primary mb-2">{stat.number}</div>
                <div className="text-sm font-bold text-[#617289] dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-background-light dark:bg-[#0c0f12]">
        <div className="max-w-225 mx-auto bg-linear-to-br from-primary to-primary-dark rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-6">Join Us at the Next Conference</h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Be part of Ghana's premier gathering of Physician Assistants. Register early for the 2026 Annual General Conference in Kumasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <button className="bg-white cursor-pointer text-primary px-10 py-4 rounded-xl font-black hover:bg-primary-light hover:text-white transition-all shadow-lg">
                View Upcoming Events
              </button>
            </Link>
            <Link to="/membership/join">
              <button className="bg-primary-dark/30 cursor-pointer backdrop-blur-md border-2 border-white/40 text-white px-10 py-4 rounded-xl font-black hover:bg-white/10 transition-all">
                Become a Member
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferenceArchive;
