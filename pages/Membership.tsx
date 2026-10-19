import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Membership: React.FC = () => {
  usePageTitle('Membership', 'Discover GPAA membership categories, benefits, and requirements for Physician Assistants practicing in Ghana.');
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-primary to-primary-dark py-24 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Join the GPAA Family
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Become part of Ghana's largest professional network of Physician Assistants. Together, we're shaping the future of healthcare.
            </p>
            <Link 
              to="/membership/join"
              className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-xl font-black text-xl hover:bg-slate-100 transition-all shadow-xl"
            >
              Register Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Membership Categories & Requirements */}
      <section id="categories" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Membership Categories
          </motion.h2>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-[#617289] dark:text-gray-400 text-xl max-w-3xl mx-auto">
            Membership of the Union is open to all Physician Assistants duly registered with the Ghana Medical and Dental Council
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-8"
        >
          {/* Full Members */}
          <motion.div variants={fadeInUp} className="bg-background-light dark:bg-[#0c0f12] p-10 rounded-3xl border-2 border-primary/20 hover:border-primary transition-all">
            <div className="flex items-start gap-6">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-4xl">badge</span>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-4">Full Membership</h3>
                <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed mb-6">
                  Open to all Physician Assistants duly registered with the Ghana Medical and Dental Council or the Statutory Body responsible for the registration of Physician Assistants practicing in Ghana.
                </p>
                <div className="bg-white dark:bg-[#14181c] p-6 rounded-2xl">
                  <h4 className="font-black text-xl mb-3 text-primary">Requirements:</h4>
                  <ul className="space-y-2 text-[#617289] dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Valid registration with Ghana Medical and Dental Council</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Currently practicing as a Physician Assistant in Ghana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Payment of prescribed membership fees and dues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Fulfillment of all constitutional conditions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Overseas Members */}
          <motion.div variants={fadeInUp} className="bg-background-light dark:bg-[#0c0f12] p-10 rounded-3xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary transition-all">
            <div className="flex items-start gap-6">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-4xl">flight</span>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-4">Overseas Membership</h3>
                <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed mb-6">
                  For qualified Physician Assistants residing abroad who are registrable with the Ghana Physician Assistants Regulatory Body and hold valid registration in their country of practice.
                </p>
                <div className="bg-white dark:bg-[#14181c] p-6 rounded-2xl">
                  <h4 className="font-black text-xl mb-3 text-primary">Requirements:</h4>
                  <ul className="space-y-2 text-[#617289] dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Registrable with Ghana Physician Assistants Regulatory Body</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Valid registration with equivalent statutory body in country of practice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Payment of prescribed overseas membership fees and dues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-1">check_circle</span>
                      <span>Fulfillment of constitutional conditions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Honorary/Associate Membership */}
          <motion.div variants={fadeInUp} className="bg-background-light dark:bg-[#0c0f12] p-10 rounded-3xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary transition-all">
            <div className="flex items-start gap-6">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-4xl">military_tech</span>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-4">Honorary/Associate Membership</h3>
                <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed">
                  May be accorded to individuals and groups as decided by the Annual General Conference on recommendations by the National Council. This category recognizes outstanding contributions to the Physician Assistant profession and healthcare delivery in Ghana.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Good Standing */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-primary/5 border-2 border-primary/20 p-10 rounded-3xl"
        >
          <h3 className="text-3xl font-black mb-6 text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">verified</span>
            Member in Good Standing
          </h3>
          <p className="text-[#617289] dark:text-gray-400 text-lg mb-6">A member is deemed to be in Good Standing if such a member:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white dark:bg-[#14181c] p-6 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-2xl mt-1">check_circle</span>
              <span className="text-[#617289] dark:text-gray-400 text-lg">Has fully registered with the Association</span>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-[#14181c] p-6 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-2xl mt-1">check_circle</span>
              <span className="text-[#617289] dark:text-gray-400 text-lg">Has paid union dues in full</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Membership Benefits */}
      <section id="benefits" className="py-24 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Membership Benefits</h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-[#617289] dark:text-gray-400 text-xl max-w-3xl mx-auto">
              Notable benefits to all dues paying members
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: 'info', title: 'Information & Communication', desc: 'Stay updated with latest industry news and policy changes' },
              { icon: 'handshake', title: 'Collective Bargaining Power', desc: 'Stronger voice in salary negotiations and working conditions' },
              { icon: 'account_balance', title: 'Institutional & Financial Benefits', desc: 'Access to special financial services and institutional support' },
              { icon: 'workspace_premium', title: 'Dignity & Professional Pride', desc: 'Recognition and respect as a certified professional' },
              { icon: 'badge', title: 'Professional Recognition & Identity', desc: 'Official membership card and professional credentials' },
              { icon: 'gavel', title: 'Legal & Professional Protection', desc: 'Legal support and professional indemnity coverage' },
              { icon: 'how_to_vote', title: 'Participation in Governance & Leadership', desc: 'Vote and run for leadership positions' },
              { icon: 'group', title: 'Networking & Collaboration', desc: 'Connect with 6,000+ PAs nationwide' },
              { icon: 'trending_up', title: 'Career Development & Progression', desc: 'Job opportunities and career advancement resources' },
              { icon: 'campaign', title: 'Advocacy & Representation', desc: 'Strong voice in healthcare policy-making' },
              { icon: 'health_and_safety', title: 'Welfare & Social Support', desc: 'Mental health programs and social support systems' },
              { icon: 'school', title: 'Continuing Professional Development (CPD)', desc: 'Access to world-class training and workshops' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all group"
              >
                <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                </div>
                <h3 className="text-xl font-black mb-3">{benefit.title}</h3>
                <p className="text-[#617289] dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Requirements */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Application Requirements</h2>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-background-light dark:bg-[#0c0f12] p-10 rounded-3xl border border-[#e5e7eb] dark:border-white/10"
          >
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <span className="material-symbols-outlined text-4xl">description</span>
            </div>
            <h3 className="text-2xl font-black mb-6">Registration Requirements</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-1">check_circle</span>
                <span className="text-[#617289] dark:text-gray-400 text-lg">Completion of membership registration form</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-1">check_circle</span>
                <span className="text-[#617289] dark:text-gray-400 text-lg">Valid Physician Assistant license from MDC</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-1">check_circle</span>
                <span className="text-[#617289] dark:text-gray-400 text-lg">Government-issued photo identification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-1">check_circle</span>
                <span className="text-[#617289] dark:text-gray-400 text-lg">Recent passport-size photograph</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-1">check_circle</span>
                <span className="text-[#617289] dark:text-gray-400 text-lg">Payment of applicable membership fees</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-primary text-white p-10 rounded-3xl"
          >
            <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl">card_membership</span>
            </div>
            <h3 className="text-2xl font-black mb-6">After Registration</h3>
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              A fully registered member shall be issued with a membership card duly signed by the National President and General Secretary.
            </p>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-white/90 text-sm">
                Your membership card serves as official proof of membership and grants you access to all GPAA benefits, events, and services.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Process */}
      <section className="py-24 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-250 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Simple Registration Process</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Get started in just a few steps</p>
          </div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Complete Online Form', desc: 'Fill out the membership registration form with your professional details and credentials' },
              { step: '02', title: 'Submit Documents', desc: 'Upload required documents (PA license, ID, passport photo)' },
              { step: '03', title: 'Pay Membership Dues', desc: 'Complete payment of applicable fees via Mobile Money, Bank Transfer, or Cash' },
              { step: '04', title: 'Get Verified', desc: 'Our membership team verifies your credentials within 48-72 hours' },
              { step: '05', title: 'Welcome to GPAA!', desc: 'Receive your official membership card signed by the National President and General Secretary' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 items-start bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-lg transition-all"
              >
                <div className="size-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                  <p className="text-[#617289] dark:text-gray-400 text-lg">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/membership/join"
              className="inline-flex items-center gap-3 bg-primary text-white px-12 py-6 rounded-xl font-black text-xl hover:bg-primary-dark transition-all shadow-xl"
            >
              Start Your Application
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-250 mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Questions About Membership?
          </h2>
          <p className="text-white/90 text-xl mb-10">
            Our membership team is ready to assist you
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/contact"
              className="bg-white text-primary px-10 py-5 rounded-xl font-black text-lg hover:bg-slate-100 transition-all"
            >
              Contact Us
            </Link>
            <a
              href="tel:+233302937118"
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-white/20 transition-all"
            >
              Call: +233 302 937 118
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
