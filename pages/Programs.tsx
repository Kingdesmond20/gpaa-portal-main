
import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';

const Programs: React.FC = () => {
  usePageTitle('Programs & Initiatives', 'GPAA\'s core programs: advocacy and policy, professional development and CPD, member welfare, and community health outreach.');
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-24 bg-primary overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 border-40 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-40 border-white rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
          >
            Programs & Initiatives
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Empowering Physician Assistants across Ghana through legislative advocacy, continuous education, and community-focused healthcare excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-5"
          >
            <button className="bg-white text-primary px-10 py-5 rounded-xl font-black text-xl hover:bg-slate-100 transition-all shadow-xl">
              Get Involved
            </button>
            <button className="bg-transparent border-2 border-white/40 text-white px-10 py-5 rounded-xl font-black text-xl hover:bg-white/10 transition-all">
              View Calendar
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="relative -mt-12 px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'CME SESSIONS', value: '50+', icon: 'school' },
            { label: 'ACTIVE MEMBERS', value: '10K+', icon: 'groups' },
            { label: 'HEALTH OUTREACHES', value: '120+', icon: 'volunteer_activism' },
            { label: 'POLICY WINS', value: '12+', icon: 'emoji_events' }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="bg-white dark:bg-[#14181c] p-8 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-white/10 flex flex-col items-center text-center group hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-primary text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</span>
              <p className="text-3xl font-black text-[#111418] dark:text-white mb-1">{stat.value}</p>
              <p className="text-xs font-black text-[#617289] dark:text-gray-400 tracking-widest uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Focus Areas */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h2 className="text-4xl font-black">Core Focus Areas</h2>
          <div className="flex bg-[#f0f2f4] dark:bg-white/5 p-1 rounded-xl">
            <button type="button" aria-pressed="true" className="px-6 py-2 bg-primary text-white rounded-lg font-bold">Active</button>
            <button
              type="button"
              aria-pressed="false"
              onClick={() => showToast('Upcoming programs will be listed here soon.', 'info')}
              className="px-6 py-2 text-[#617289] dark:text-gray-400 font-bold"
            >
              Upcoming
            </button>
          </div>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Advocacy Card */}
          <motion.div variants={fadeInUp} className="bg-white dark:bg-[#14181c] rounded-3xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 hover:shadow-2xl transition-all group">
            <div className="h-64 overflow-hidden">
              <img
              loading="lazy"
                src="/images/stock/advocacy-handshake.jpg"
                alt="Advocacy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h3 className="text-3xl font-black mb-4">Advocacy & Policy</h3>
              <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed mb-8">
                We represent the voice of Ghana's Physician Assistants at the legislative level, fighting for workplace rights and professional recognition.
              </p>
              <div className="flex items-center justify-between">
                <Link to="/advocacy" className="text-primary font-black hover:underline flex items-center gap-2">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-black px-3 py-1 rounded-full">3 Active Cases</span>
              </div>
            </div>
          </motion.div>

          {/* Development Card */}
          <motion.div variants={fadeInUp} className="bg-white dark:bg-[#14181c] rounded-3xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 hover:shadow-2xl transition-all group">
            <div className="h-64 overflow-hidden">
              <img
              loading="lazy"
                src="/images/stock/cpd-training-center-1.jpg"
                alt="Professional Development"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="text-3xl font-black mb-4">Professional Development</h3>
              <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed mb-8">
                Access world-class Continuing Medical Education (CME). Our platform offers accredited courses and clinical workshops.
              </p>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => showToast('The CME portal is launching soon — see CPD benefits on the Membership page in the meantime.', 'info')}
                  className="bg-primary text-white font-black px-6 py-3 rounded-xl hover:bg-primary-dark transition-all"
                >
                  CME Portal Access
                </button>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-full">24 New Courses</span>
              </div>
            </div>
          </motion.div>

          {/* Welfare Card */}
          <motion.div variants={fadeInUp} className="bg-white dark:bg-[#14181c] rounded-3xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 hover:shadow-2xl transition-all group">
            <div className="h-64 overflow-hidden">
              <img
              loading="lazy"
                src="/images/stock/rural-labor-ward.jpg"
                alt="Member Welfare"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">health_and_safety</span>
              </div>
              <h3 className="text-3xl font-black mb-4">Member Welfare</h3>
              <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed mb-8">
                We look after those who look after the nation. Our welfare programs include group insurance and legal assistance for members.
              </p>
              <div className="flex items-center justify-between">
                <Link to="/welfare" className="text-primary font-black hover:underline flex items-center gap-2">
                  Benefits Guide <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <Link to="/welfare#apply" className="text-[#617289] dark:text-gray-400 font-bold text-sm hover:text-primary transition-colors">Apply for Support</Link>
              </div>
            </div>
          </motion.div>

          {/* Outreach Card */}
          <motion.div variants={fadeInUp} className="bg-white dark:bg-[#14181c] rounded-3xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 hover:shadow-2xl transition-all group">
            <div className="h-64 overflow-hidden">
              <img
              loading="lazy"
                src="/images/stock/community-outreach-mothers.jpg"
                alt="Community Outreach"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">public</span>
              </div>
              <h3 className="text-3xl font-black mb-4">Community Outreach</h3>
              <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed mb-8">
                Bridging the gap in rural healthcare. Join our nationwide missions to provide essential medical services to underserved communities.
              </p>
              <div className="flex items-center justify-between">
                <Link to="/get-involved/volunteer" className="bg-primary/10 text-primary font-black px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
                  Volunteer Now
                </Link>
                <span className="text-[#617289] dark:text-gray-400 text-sm font-bold italic">Next: Upper West Region</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Join CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-slate-900 text-center px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-4xl md:text-6xl font-black mb-10 leading-tight">Ready to shape the future of healthcare in Ghana?</h2>
          <p className="text-white/60 text-xl md:text-2xl mb-12">
            Whether you are a practicing PA, a student, or a partner organization, there is a place for you in our mission to improve lives.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-primary text-white font-black px-12 py-6 rounded-2xl text-xl hover:bg-primary-dark transition-all shadow-xl hover:-translate-y-1">
              Become a Member
            </button>
            <button className="bg-white/10 text-white border border-white/20 font-black px-12 py-6 rounded-2xl text-xl hover:bg-white/20 transition-all">
              Partner With Us
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Programs;
