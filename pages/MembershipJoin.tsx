import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MEMBERSHIP_CATEGORIES, GHANA_REGIONS, EMPLOYER_CATEGORIES } from '../constants';
import { showToast } from '../components/Toast';
import { submitApplication } from '../lib/membershipApi';
import { useAuth } from '../contexts/AuthContext';

const MembershipJoin: React.FC = () => {
  usePageTitle('Membership Application', 'Apply for GPAA membership online — fast, simple registration for Physician Assistants practicing or registrable in Ghana.');
  const { session } = useAuth();

  const [formData, setFormData] = useState({
    category: '',
    firstName: '',
    lastName: '',
    email: session?.user.email ?? '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    mdcLicenseNumber: '',
    staffId: '',
    employer: '',
    region: '',
    district: '',
    facility: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitApplication(formData, session?.user.id);
      setSubmitted(true);
      showToast('Application submitted successfully! We will contact you within 48 hours.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not submit your application. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-background-light dark:bg-[#0c0f12] min-h-screen py-12">
      <div className="max-w-225 mx-auto px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4">Membership Application</h1>
          <p className="text-[#617289] dark:text-gray-400 text-xl">
            Join Ghana's leading professional association for Physician Assistants
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12"
        >
          {submitted ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-ghana-green text-6xl mb-4" aria-hidden="true">
                check_circle
              </span>
              <h2 className="text-3xl font-black mb-3">Application Submitted!</h2>
              <p className="text-[#617289] dark:text-gray-400 text-lg mb-6 max-w-xl mx-auto">
                Thank you for applying to GPAA. Our membership team will review your application and get back to
                you by email within 48 hours.
              </p>
              <Link to="/" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-black hover:bg-primary-dark transition-all shadow-lg">
                Back to Home
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Membership Category */}
            <div>
              <label htmlFor="join-category" className="block text-lg font-bold mb-3">
                Select Membership Category <span className="text-red-500">*</span>
              </label>
              <select
                id="join-category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all text-lg"
              >
                <option value="">Choose a category</option>
                {MEMBERSHIP_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-black mb-6 text-primary">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="join-firstName" className="block font-bold mb-2">First Name <span className="text-red-500">*</span></label>
                  <input
                    id="join-firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="join-lastName" className="block font-bold mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input
                    id="join-lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label htmlFor="join-email" className="block font-bold mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input
                    id="join-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="join-phone" className="block font-bold mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    id="join-phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="+233 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="join-gender" className="block font-bold mb-2">Gender <span className="text-red-500">*</span></label>
                  <select
                    id="join-gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="join-dateOfBirth" className="block font-bold mb-2">Date of Birth <span className="text-red-500">*</span></label>
                  <input
                    id="join-dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-2xl font-black mb-6 text-primary">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="join-mdcLicenseNumber" className="block font-bold mb-2">MDC License Number <span className="text-red-500">*</span></label>
                  <input
                    id="join-mdcLicenseNumber"
                    name="mdcLicenseNumber"
                    required
                    value={formData.mdcLicenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="PA/GH/XXXX/XXXX"
                  />
                </div>
                <div>
                  <label htmlFor="join-staffId" className="block font-bold mb-2">Staff ID <span className="text-red-500">*</span></label>
                  <input
                    id="join-staffId"
                    name="staffId"
                    required
                    value={formData.staffId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter your staff ID"
                  />
                </div>
                <div>
                  <label htmlFor="join-employer" className="block font-bold mb-2">Employer <span className="text-red-500">*</span></label>
                  <select
                    id="join-employer"
                    name="employer"
                    required
                    value={formData.employer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select employer</option>
                    {EMPLOYER_CATEGORIES.map((emp, idx) => (
                      <option key={idx} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="join-region" className="block font-bold mb-2">Region <span className="text-red-500">*</span></label>
                  <select
                    id="join-region"
                    name="region"
                    required
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select region</option>
                    {GHANA_REGIONS.map((region, idx) => (
                      <option key={idx} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="join-district" className="block font-bold mb-2">District <span className="text-red-500">*</span></label>
                  <input
                    id="join-district"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter your district"
                  />
                </div>
                <div>
                  <label htmlFor="join-facility" className="block font-bold mb-2">Facility <span className="text-red-500">*</span></label>
                  <input
                    id="join-facility"
                    name="facility"
                    required
                    value={formData.facility}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="Hospital/Clinic name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="join-address" className="block font-bold mb-2">Residential Address <span className="text-red-500">*</span></label>
                  <textarea
                    id="join-address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter your full address"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Privacy Notice - No Document Upload Required */}
            <div className="bg-ghana-gold/10 border-2 border-ghana-gold p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-ghana-green text-3xl">info</span>
                <div>
                  <h3 className="font-black text-lg mb-2">Data Protection & Privacy</h3>
                  <p className="text-[#617289] dark:text-gray-400">
                    In compliance with data protection and privacy regulations, we do not require scanned copies of documents during registration. 
                    All information provided will be verified through official channels and kept strictly confidential.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-background-light dark:bg-white/5 p-6 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-1 size-5" />
                <span className="text-[#617289] dark:text-gray-400">
                  I confirm that all information provided is accurate and I agree to the <a href="#" onClick={(e) => { e.preventDefault(); showToast('The GPAA Constitution will be published here soon.', 'info'); }} className="text-primary font-bold hover:underline">GPAA Constitution</a> and <a href="#" onClick={(e) => { e.preventDefault(); showToast('The Code of Ethics will be published here soon.', 'info'); }} className="text-primary font-bold hover:underline">Code of Ethics</a>. <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white py-5 rounded-xl font-black text-xl hover:bg-primary-dark transition-all shadow-xl disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
              <p className="text-[#617289] dark:text-gray-400">
                <strong>Need help?</strong> Contact our membership team at <a href="mailto:membership@gpaa.org.gh" className="text-primary font-bold hover:underline">membership@gpaa.org.gh</a> or call <a href="tel:+233302937118" className="text-primary font-bold hover:underline">+233 302 937 118</a>
              </p>
            </div>
          </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipJoin;
