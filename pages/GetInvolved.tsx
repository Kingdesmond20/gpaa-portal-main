import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GetInvolved: React.FC = () => {
  usePageTitle('Get Involved', 'Ways to get involved with GPAA: volunteer, pursue careers and internships, or explore partnership opportunities.');
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  const opportunities = [
    {
      title: 'Volunteer',
      description: 'Make a difference in communities across Ghana through health outreach programs and community initiatives.',
      icon: 'volunteer_activism',
      color: 'bg-blue-500',
      link: '/get-involved/volunteer',
      benefits: ['Gain practical experience', 'Network with professionals', 'Community impact', 'CPD hours']
    },
    {
      title: 'Internship & Careers',
      description: 'Join our team and contribute to advancing the Physician Assistant profession in Ghana.',
      icon: 'work',
      color: 'bg-green-500',
      link: '/get-involved/careers',
      benefits: ['Professional growth', 'Competitive packages', 'Career development', 'Work-life balance']
    },
    {
      title: 'Partnerships',
      description: 'Collaborate with GPAA on programs, research, and initiatives that advance healthcare excellence.',
      icon: 'handshake',
      color: 'bg-purple-500',
      link: '/get-involved/partnerships',
      benefits: ['Strategic collaboration', 'Co-branded programs', 'Healthcare impact', 'Long-term partnership']
    },
    {
      title: 'Sponsorship',
      description: 'Support GPAA programs and initiatives through financial contributions and sponsorship packages.',
      icon: 'payments',
      color: 'bg-orange-500',
      link: '/donate',
      benefits: ['Brand visibility', 'CSR impact', 'Tax benefits', 'Public recognition']
    }
  ];

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-24 bg-linear-to-br from-primary to-primary-dark overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-white">Get Involved</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
          >
            Get Involved with GPAA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
          >
            Join us in advancing healthcare excellence. Whether you want to volunteer, build your career, partner, or sponsor our initiatives, there's a place for you.
          </motion.p>
        </div>
      </motion.section>

      {/* Opportunities */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {opportunities.map((opp, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-white dark:bg-[#14181c] rounded-3xl border-2 border-[#e5e7eb] dark:border-white/10 overflow-hidden hover:border-primary hover:shadow-2xl transition-all group"
            >
              <div className={`${opp.color} p-8 text-white`}>
                <span className="material-symbols-outlined text-6xl mb-4 block">{opp.icon}</span>
                <h3 className="text-3xl font-black mb-3">{opp.title}</h3>
                <p className="text-white/90 leading-relaxed">{opp.description}</p>
              </div>
              <div className="p-8">
                <h4 className="font-black mb-4 text-lg">Key Benefits:</h4>
                <ul className="space-y-2 mb-6">
                  {opp.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#617289] dark:text-gray-400">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  to={opp.link}
                  className="block w-full bg-primary text-white text-center py-4 rounded-xl font-black hover:bg-primary-dark transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Get Involved */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 bg-background-light dark:bg-[#0c0f12] px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Why Get Involved?</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl max-w-3xl mx-auto">
              Being part of GPAA means joining a community dedicated to healthcare excellence and professional growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'diversity_3', title: 'Community', desc: 'Join a network of 10,000+ professionals' },
              { icon: 'trending_up', title: 'Growth', desc: 'Access continuous learning opportunities' },
              { icon: 'health_and_safety', title: 'Impact', desc: 'Make a difference in healthcare delivery' },
              { icon: 'workspace_premium', title: 'Recognition', desc: 'Gain recognition for your contributions' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 text-center hover:shadow-xl transition-all"
              >
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-2xl font-black mb-3 dark:text-white">{item.title}</h3>
                <p className="text-[#617289] dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6"
      >
        <div className="max-w-4xl mx-auto bg-linear-to-br from-primary to-primary-dark rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Choose how you'd like to contribute to advancing healthcare in Ghana
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/get-involved/volunteer"
              className="bg-white text-primary px-8 py-4 rounded-xl font-black hover:bg-slate-100 transition-all shadow-xl"
            >
              Volunteer Now
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-black hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default GetInvolved;
