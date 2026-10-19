import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { WELFARE_PAYMENT_METHODS } from '../constants';

const Welfare: React.FC = () => {
  usePageTitle('Welfare', 'GPAA\'s member welfare programs, including bereavement, medical emergency, and hardship support.');
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-linear-to-br from-ghana-green to-green-dark py-20"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              GPAA Welfare Fund
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto">
              Supporting our members in times of need with comprehensive welfare benefits and financial assistance.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Welfare Benefits */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-background-light dark:bg-[#0c0f12]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Welfare Benefits</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl max-w-3xl mx-auto">
              The GPAA Welfare Fund is designed to provide financial support to members during critical life events.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'favorite', title: 'Bereavement Support', description: 'Financial assistance for members who lose immediate family members', amount: 'Up to GH₵ 5,000' },
              { icon: 'local_hospital', title: 'Medical Emergency', description: 'Support for members facing critical illness or emergency medical procedures', amount: 'Up to GH₵ 10,000' },
              { icon: 'celebration', title: 'Marriage Support', description: 'One-time marriage grant for members entering matrimony', amount: 'GH₵ 1,000' },
              { icon: 'child_care', title: 'New Baby Grant', description: 'Congratulatory grant for welcoming a new child', amount: 'GH₵ 500' },
              { icon: 'elderly', title: 'Retirement Package', description: 'Recognition package for members retiring from active service', amount: 'GH₵ 2,000' },
              { icon: 'volunteer_activism', title: 'Hardship Support', description: 'Emergency assistance for members facing financial difficulties', amount: 'Case-by-case basis' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-[#14181c] p-8 rounded-2xl shadow-lg border-2 border-ghana-gold/20 hover:border-primary transition-all"
              >
                <div className="size-16 rounded-2xl bg-ghana-green/10 flex items-center justify-center text-ghana-green mb-6">
                  <span className="material-symbols-outlined text-4xl">{benefit.icon}</span>
                </div>
                <h3 className="text-2xl font-black mb-3">{benefit.title}</h3>
                <p className="text-[#617289] dark:text-gray-400 mb-4">{benefit.description}</p>
                <div className="text-ghana-green font-black text-xl">{benefit.amount}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Payment Methods */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-white dark:bg-[#14181c]"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Payment Methods</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">
              Multiple convenient options to make your welfare contributions
            </p>
          </motion.div>

          <motion.div variants={stagger} className="space-y-6">
            {WELFARE_PAYMENT_METHODS.map((method, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-background-light dark:bg-[#0c0f12] p-8 rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-ghana-gold transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-14 rounded-full bg-ghana-green/10 flex items-center justify-center text-ghana-green shrink-0">
                      <span className="material-symbols-outlined text-3xl">
                        {method.type === 'Mobile Money' ? 'phone_android' : method.type === 'Bank' ? 'account_balance' : 'dialpad'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary uppercase tracking-wide">{method.type}</div>
                      <div className="text-2xl font-black">{method.name}</div>
                      <div className="text-[#617289] dark:text-gray-400">{method.details}</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#14181c] px-6 py-4 rounded-xl border-2 border-ghana-gold">
                    <div className="text-sm text-[#617289] dark:text-gray-400 mb-1">Account/Number</div>
                    <div className="text-2xl font-black text-ghana-green">{method.number}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How to Apply */}
      <motion.section
        id="apply"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-primary/5"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">How to Apply for Welfare</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">
              Simple steps to access your welfare benefits when you need them
            </p>
          </motion.div>

          <motion.div variants={stagger} className="space-y-6">
            {[
              { step: '1', title: 'Submit Application', description: 'Complete the welfare application form available from your regional secretary or online portal' },
              { step: '2', title: 'Provide Documentation', description: 'Attach required supporting documents (medical reports, death certificate, marriage certificate, etc.)' },
              { step: '3', title: 'Committee Review', description: 'The Welfare Committee reviews your application within 7-14 working days' },
              { step: '4', title: 'Receive Payment', description: 'Upon approval, funds are disbursed directly to your mobile money or bank account' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-[#14181c] p-8 rounded-2xl flex items-start gap-6 shadow-lg border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="size-16 rounded-full bg-ghana-green text-white flex items-center justify-center text-3xl font-black shrink-0 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                  <p className="text-[#617289] dark:text-gray-400 text-lg">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Welfare Committee */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-6 bg-white dark:bg-[#14181c]"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Need Assistance?</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl mb-10">
            Contact the GPAA Welfare Committee for inquiries or support
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="mailto:welfare@gpaa.org.gh" className="bg-ghana-green text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-green-dark transition-all shadow-lg flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">email</span>
              welfare@gpaa.org.gh
            </a>
            <a href="tel:+233302937118" className="bg-ghana-gold text-[#111418] px-8 py-5 rounded-2xl font-black text-xl hover:bg-gold-dark transition-all shadow-lg flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">call</span>
              +233 30 293 7118
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Welfare;
