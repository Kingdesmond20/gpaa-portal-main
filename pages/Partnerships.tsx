import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';

const Partnerships: React.FC = () => {
  usePageTitle('Partnerships', 'Partner with GPAA to advance healthcare excellence in Ghana through educational, institutional, and international collaborations.');
  const [formData, setFormData] = useState({
    organization: '',
    contact: '',
    email: '',
    phone: '',
    partnershipType: '',
    objectives: '',
    message: ''
  });

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — swap this for a real POST /api/partnerships once Phase 2 lands.
    showToast('Thank you for your interest in partnering with GPAA! Our team will review your proposal and contact you soon.', 'success');
    setFormData({ organization: '', contact: '', email: '', phone: '', partnershipType: '', objectives: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const partnershipTypes = [
    {
      title: 'Educational Partnerships',
      description: 'Collaborate on training programs, research initiatives, and academic development for PAs.',
      icon: 'school',
      color: 'bg-primary',
      benefits: [
        'Access to PA talent pool',
        'Joint research opportunities',
        'Co-branded training programs',
        'Knowledge exchange platforms'
      ]
    },
    {
      title: 'Healthcare Institutions',
      description: 'Partner to improve PA practice, clinical standards, and healthcare service delivery.',
      icon: 'local_hospital',
      color: 'bg-primary',
      benefits: [
        'Enhanced workforce development',
        'Quality improvement initiatives',
        'Professional practice standards',
        'Collaborative patient care models'
      ]
    },
    {
      title: 'Technology & Innovation',
      description: 'Provide tech solutions, digital tools, or innovation support for GPAA operations and member services.',
      icon: 'lightbulb',
      color: 'bg-primary',
      benefits: [
        'Product testing with professionals',
        'User feedback and insights',
        'Healthcare sector market access',
        'Innovation showcase opportunities'
      ]
    },
    {
      title: 'International Organizations',
      description: 'Collaborate on global health initiatives, capacity building, and knowledge transfer programs.',
      icon: 'public',
      color: 'bg-primary',
      benefits: [
        'Local implementation support',
        'Cultural competence and context',
        'Stakeholder engagement facilitation',
        'Sustainable program design'
      ]
    },
    {
      title: 'Media & Communications',
      description: 'Partner to amplify GPAA\'s voice, share healthcare stories, and raise public awareness.',
      icon: 'campaign',
      color: 'bg-primary',
      benefits: [
        'Exclusive healthcare content',
        'Expert interviews and insights',
        'Health education campaigns',
        'Community impact stories'
      ]
    }
  ];

  const currentPartners = [
    'Ministry of Health',
    'Medical and Dental Council',
    'Ghana Health Service',
    'Teaching Hospitals',
    'International PA Federation',
    'Pharmaceutical Companies',
    'Health Insurance Providers',
    'Academic Institutions'
  ];

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-primary to-primary-dark py-24 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/get-involved" className="hover:text-white">Get Involved</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-white">Partnerships</span>
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-white mb-8"
          >
            Partnerships
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Collaborate with GPAA to advance healthcare excellence and create lasting impact across Ghana
          </motion.p>
        </div>
      </motion.section>

      {/* Value Proposition */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Why Partner with GPAA?</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl max-w-3xl mx-auto">
            Align your organization with a respected healthcare association driving positive change
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: 'groups', title: '10,000+ Members', desc: 'Access to healthcare professionals nationwide' },
            { icon: 'trending_up', title: 'Growing Impact', desc: 'Expanding influence in Ghana\'s health sector' },
            { icon: 'verified', title: 'Credibility', desc: 'Registered with TUC and regulated by MDC' },
            { icon: 'public', title: 'National Reach', desc: 'Active presence in all 15 regions' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background-light dark:bg-[#0c0f12] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 text-center hover:shadow-xl transition-all"
            >
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>
              <h3 className="text-2xl font-black mb-2 text-primary">{item.title}</h3>
              <p className="text-[#617289] dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partnership Types */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 bg-background-light dark:bg-[#0c0f12] px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Partnership Opportunities</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Explore different ways to collaborate with GPAA</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnershipTypes.map((type, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-[#14181c] rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 overflow-hidden hover:border-primary hover:shadow-xl transition-all"
              >
                <div className={`${type.color} p-6 text-white`}>
                  <span className="material-symbols-outlined text-5xl mb-3 block">{type.icon}</span>
                  <h3 className="text-2xl font-black mb-2">{type.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-[#617289] dark:text-gray-400 mb-4 leading-relaxed">{type.description}</p>
                  <h4 className="font-black text-sm mb-3 uppercase tracking-wide">Partnership Benefits:</h4>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#617289] dark:text-gray-400">
                        <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sponsorship Packages - Redirect to Donate */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-background-light dark:bg-[#0c0f12]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Looking for Sponsorship Opportunities?</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl mb-8 leading-relaxed">
            If you're interested in financially supporting GPAA through sponsorship packages, please visit our Donations page for sponsorship tiers and benefits.
          </p>
          <Link
            to="/donate"
            className="inline-block bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl"
          >
            View Sponsorship Options
          </Link>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-24 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our Partners</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Proud to collaborate with leading organizations</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentPartners.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-[#14181c] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 text-center hover:shadow-lg transition-all"
              >
                <p className="font-bold text-[#617289] dark:text-gray-400">{partner}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section id="partnership-form" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Start a Partnership</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl">Let's discuss how we can work together</p>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-2xl p-8 md:p-12 border border-[#e5e7eb] dark:border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="partner-organization" className="block font-bold mb-2">Organization Name <span className="text-red-500">*</span></label>
              <input
                id="partner-organization"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
                placeholder="Your organization"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="partner-contact" className="block font-bold mb-2">Contact Person <span className="text-red-500">*</span></label>
                <input
                  id="partner-contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="partner-email" className="block font-bold mb-2">Email <span className="text-red-500">*</span></label>
                <input
                  id="partner-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
                  placeholder="email@organization.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="partner-phone" className="block font-bold mb-2">Phone Number <span className="text-red-500">*</span></label>
              <input
                id="partner-phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
                placeholder="+233 XXX XXX XXX"
              />
            </div>

            <div>
              <label htmlFor="partner-partnershipType" className="block font-bold mb-2">Partnership Type <span className="text-red-500">*</span></label>
              <select
                id="partner-partnershipType"
                name="partnershipType"
                required
                value={formData.partnershipType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <option value="">Select partnership type</option>
                <option value="Educational Partnership">Educational Partnership</option>
                <option value="Healthcare Institution">Healthcare Institution</option>
                <option value="Technology & Innovation">Technology & Innovation</option>
                <option value="International Organization">International Organization</option>
                <option value="Media & Communications">Media & Communications</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="partner-objectives" className="block font-bold mb-2">Partnership Objectives</label>
              <textarea
                id="partner-objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
                placeholder="What would you like to achieve through this partnership?"
              ></textarea>
            </div>

            <div>
              <label htmlFor="partner-message" className="block font-bold mb-2">Additional Information</label>
              <textarea
                id="partner-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] focus:border-primary outline-none transition-all dark:border-white/15 dark:bg-white/5 dark:text-white"
                placeholder="Tell us more about your proposal or any questions you have..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl"
            >
              Submit Partnership Inquiry
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default Partnerships;
