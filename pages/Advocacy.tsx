import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Advocacy: React.FC = () => {
  usePageTitle('Advocacy', 'GPAA\'s advocacy work fighting for the rights, recognition, and professional standards of Physician Assistants in Ghana.');
  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-[#0a4296] to-primary py-24 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 100,100" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
              Advocacy & Policy
            </h1>
            <p className="text-white/90 text-xl md:text-2xl leading-relaxed">
              Fighting for better working conditions, legislative reforms, and professional recognition for Physician Assistants across Ghana
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Focus Areas */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Our Advocacy Focus Areas</h2>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'CHPS Zones Implementation',
              description: 'Ensuring adequate deployment and support for PAs in Community-based Health Planning and Services zones across all districts.',
              icon: 'home_health',
              color: 'bg-primary'
            },
            {
              title: 'Universal Health Coverage (UHC)',
              description: 'Advocating for PAs central role in achieving UHC goals and expanding access to quality healthcare nationwide.',
              icon: 'health_and_safety',
              color: 'bg-primary'
            },
            {
              title: 'NHIA Integration',
              description: 'Working with the National Health Insurance Authority to ensure fair compensation and service recognition for PA consultations.',
              icon: 'credit_card',
              color: 'bg-primary'
            },
            {
              title: 'Rural Health Incentives',
              description: 'Petitioning for improved allowances, accommodation, and career progression for PAs in hard-to-reach areas.',
              icon: 'landscape',
              color: 'bg-primary'
            },
            {
              title: 'Scope of Practice Expansion',
              description: 'Legislative advocacy for expanded clinical responsibilities aligned with international PA standards and training.',
              icon: 'verified',
              color: 'bg-primary'
            },
            {
              title: 'SDG 3 Achievement',
              description: 'Contributing PAs expertise toward Ghana achieving Sustainable Development Goal 3: Good Health and Well-being.',
              icon: 'public',
              color: 'bg-primary'
            },
          ].map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#14181c] rounded-3xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary p-8 hover:shadow-2xl transition-all group"
            >
              <div className={`size-16 ${area.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-4xl">{area.icon}</span>
              </div>
              <h3 className="text-2xl font-black mb-4 dark:text-white">{area.title}</h3>
              <p className="text-[#617289] dark:text-gray-400 leading-relaxed">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Wins */}
      <section className="py-24 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-275 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white">Recent Policy Wins</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Tangible results from our advocacy efforts</p>
          </div>

          <div className="space-y-6">
            {[
              {
                year: '2025',
                title: 'PA Prescribing Rights Expanded',
                description: 'Successfully lobbied for expanded prescribing authority for independently practicing PAs in rural health facilities.'
              },
              {
                year: '2024',
                title: 'NHIA Reimbursement Rate Increase',
                description: '40% increase in NHIA capitation rates for PA consultations, bringing us closer to parity with other healthcare professionals.'
              },
              {
                year: '2023',
                title: 'Rural Posting Allowance Approved',
                description: 'Government approved special hardship allowance for PAs posted to deprived districts, effective nationwide.'
              },
              {
                year: '2022',
                title: 'Professional Indemnity Coverage',
                description: 'Negotiated group indemnity insurance coverage for all practicing GPAA members at subsidized rates.'
              },
            ].map((win, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-lg transition-all"
              >
                <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center font-black text-3xl shrink-0">
                  <span className="material-symbols-outlined text-5xl">check_circle</span>
                </div>
                <div>
                  <div className="text-primary font-black text-sm mb-2">{win.year}</div>
                  <h3 className="text-2xl font-black mb-3 dark:text-white">{win.title}</h3>
                  <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed">{win.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Position Papers */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 dark:text-white">Position Papers & Statements</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl">Official GPAA positions on key healthcare issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'GPAA Position on Primary Healthcare Restructuring',
              date: 'February 2026',
              summary: 'Our comprehensive recommendations for strengthening Ghana Health Service primary care delivery through optimal PA utilization.',
              icon: 'description'
            },
            {
              title: 'Mental Health Support for Healthcare Workers',
              date: 'January 2026',
              summary: 'Advocating for mandatory psychological support services and wellness programs for all health sector employees.',
              icon: 'psychology_alt'
            },
            {
              title: 'Response to Proposed Medical & Dental Act Amendment',
              date: 'December 2025',
              summary: 'GPAA formal statement on legislative changes affecting scope of practice and professional autonomy.',
              icon: 'gavel'
            },
            {
              title: 'Rural Healthcare Workforce Retention Strategy',
              date: 'November 2025',
              summary: 'Evidence-based policy recommendations to address critical staffing shortages in underserved areas.',
              icon: 'villa'
            },
          ].map((paper, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background-light dark:bg-[#0c0f12] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:bg-white dark:hover:bg-[#14181c] hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">{paper.icon}</span>
                </div>
                <div>
                  <div className="text-primary text-sm font-bold mb-2">{paper.date}</div>
                  <h3 className="text-xl font-black mb-3 dark:text-white group-hover:text-primary transition-colors">{paper.title}</h3>
                </div>
              </div>
              <p className="text-[#617289] dark:text-gray-400 mb-6 leading-relaxed">{paper.summary}</p>
              <div className="flex items-center text-primary font-bold gap-2 group-hover:gap-4 transition-all">
                Read Full Paper
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-225 mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Strengthen Our Voice
          </h2>
          <p className="text-white/90 text-xl mb-10">
            Your membership powers our advocacy. Join us in fighting for the rights and recognition PAs deserve.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/membership/join"
              className="bg-white text-primary px-10 py-5 rounded-xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl"
            >
              Become a Member
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-white/20 transition-all"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Advocacy;
