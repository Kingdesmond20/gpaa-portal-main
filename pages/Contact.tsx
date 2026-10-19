import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';

const Contact: React.FC = () => {
  usePageTitle('Contact Us', 'Get in touch with the Ghana Physician Assistants Association — office location, phone, and email.');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — swap this for a real POST /api/contact once Phase 2 lands.
    showToast('Thank you for contacting us! We will respond within 24 hours.', 'success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-linear-to-br from-primary to-primary-dark py-20"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition= {{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        {/* Contact Form & Map */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block font-bold mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-bold mb-2">Email <span className="text-red-500">*</span></label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block font-bold mb-2">Phone Number</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="+233 XXX XXX XXX"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block font-bold mb-2">Subject <span className="text-red-500">*</span></label>
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                >
                  <option value="">Select inquiry type</option>
                  <option value="Membership Inquiry">Membership Inquiry (New/Renewal)</option>
                  <option value="CPD Programs">CPD Programs & Training</option>
                  <option value="Advocacy">Advocacy & Policy Matters</option>
                  <option value="Events">Events & Conferences</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Media Request">Media & Press Relations</option>
                  <option value="Partnership">Partnership & Collaboration</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-bold mb-2">Message <span className="text-red-500">*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Map & Social */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-black mb-8">Find Us on the Map</h2>
              <div className="bg-background-light dark:bg-[#0c0f12] rounded-2xl overflow-hidden border-2 border-[#e5e7eb] dark:border-white/10 h-75">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.2896842468186!2d-0.1429!3d5.7487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNDQnNTUuMyJOIDDCsDA4JzM0LjQiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GPAA Office Location - Ashiyie, Off Adenta-Dodowa Road"
                ></iframe>
              </div>
              <p className="text-sm text-[#617289] dark:text-gray-400 mt-3 font-semibold text-center">📍 Ashiyie, Off Adenta-Dodowa Road, Accra North</p>
            </div>

            <div>
              <h3 className="text-2xl font-black mb-6">Connect on Social Media</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Facebook', handle: 'Ghana Physician Assistants Association', icon: 'thumb_up', color: 'bg-[#1877F2]', url: 'https://www.facebook.com/Ghana-Physician-Assistants-Association' },
                  { name: 'Instagram', handle: '@gpaaofficial', icon: 'photo_camera', color: 'bg-[#E4405F]', url: 'https://www.instagram.com/gpaa_official' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-6 rounded-xl font-bold hover:opacity-90 transition-all hover:-translate-y-1 shadow-lg`}
                    title={social.handle}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="material-symbols-outlined">{social.icon}</span>
                      <span>{social.name}</span>
                    </div>
                    <div className="text-xs opacity-90 font-normal">{social.handle}</div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regional Branches */}
      {/* <section className="py-20 bg-background-light px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Regional Branch Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: 'Greater Accra', contact: '+233 XXX XXX XXX', email: 'accra@gpaa.org.gh' },
              { region: 'Ashanti', contact: '+233 XXX XXX XXX', email: 'ashanti@gpaa.org.gh' },
              { region:'Northern', contact: '+233 XXX XXX XXX', email: 'northern@gpaa.org.gh' },
              { region: 'Western', contact: '+233 XXX XXX XXX', email: 'western@gpaa.org.gh' },
              { region: 'Eastern', contact: '+233 XXX XXX XXX', email: 'eastern@gpaa.org.gh' },
              { region: 'Central', contact: '+233 XXX XXX XXX', email: 'central@gpaa.org.gh' },
              { region: 'Volta', contact: '+233 XXX XXX XXX', email: 'volta@gpaa.org.gh' },
              { region: 'Upper East', contact: '+233 XXX XXX XXX', email: 'uppereast@gpaa.org.gh' },
            ].map((branch, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-xl border border-[#e5e7eb] hover:shadow-lg transition-all"
              >
                <h4 className="font-black text-lg mb-3 text-primary">{branch.region}</h4>
                <div className="space-y-2 text-sm text-[#617289]">
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">phone</span>
                    {branch.contact}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">mail</span>
                    {branch.email}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;
