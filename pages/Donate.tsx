import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';

const PAYMENT_METHODS = [
  { name: 'Mobile Money', icon: 'phone_android' },
  { name: 'Bank Transfer', icon: 'account_balance' },
  { name: 'Card Payment', icon: 'credit_card' },
] as const;

const Donate: React.FC = () => {
  usePageTitle('Donate', 'Support GPAA\'s mission with a donation. Your contribution helps advocacy, CPD programs, and community health outreach.');
  const [donationType, setDonationType] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [donor, setDonor] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });

  const quickAmounts = ['50', '100', '200', '500', '1000', '5000'];

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDonor({ ...donor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount || amount;
    if (!finalAmount) {
      showToast('Please select or enter a donation amount.', 'error');
      return;
    }
    if (!paymentMethod) {
      showToast('Please choose a payment method.', 'error');
      return;
    }
    // No payment gateway wired up yet — swap this for a real POST /api/donations/intent
    // (Paystack/Flutterwave, per the Phase 2 plan) once it's available.
    showToast(
      `Thank you, ${donor.firstName || 'friend'}! We've recorded your ${donationType === 'monthly' ? 'monthly' : ''} pledge of GH₵${finalAmount} via ${paymentMethod}. Our team will follow up to complete payment.`,
      'success'
    );
    setAmount('');
    setCustomAmount('');
    setPaymentMethod('');
    setDonor({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-primary via-primary-dark to-[#0a4296] py-24 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-250 mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
              Support Our Mission
            </h1>
            <p className="text-white/90 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              Your generous contribution helps us advocate for better healthcare, support our members, and serve communities across Ghana
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Donation Form */}
      <section className="py-20 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-200 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 dark:text-white">Make a Donation</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Every contribution makes a difference</p>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#14181c] rounded-3xl shadow-2xl p-8 md:p-12"
          >
          <form onSubmit={handleSubmit}>
            {/* Donation Type Toggle */}
            <div className="flex bg-background-light dark:bg-white/5 p-2 rounded-xl mb-8">
              <button
                type="button"
                onClick={() => setDonationType('once')}
                className={`flex-1 cursor-pointer py-3 rounded-lg font-black transition-all ${
                  donationType === 'once'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-[#617289] dark:text-gray-400'
                }`}
              >
                One-Time
              </button>
              <button
                type="button"
                onClick={() => setDonationType('monthly')}
                className={`flex-1 cursor-pointer py-3 rounded-lg font-black transition-all ${
                  donationType === 'monthly'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-[#617289] dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <label className="block font-black text-lg mb-4">Select Amount (GH₵)</label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setAmount(amt); setCustomAmount(''); }}
                    className={`py-4 cursor-pointer rounded-xl font-black text-lg transition-all ${
                      amount === amt
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-background-light dark:bg-white/5 text-[#617289] dark:text-gray-400 hover:bg-[#e5e7eb] dark:hover:bg-white/10'
                    }`}
                  >
                    ₵{amt}
                  </button>
                ))}
              </div>
              <div>
                <label className="block font-bold mb-2 text-sm">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg text-[#617289] dark:text-gray-400">GH₵</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                    placeholder="0.00"
                    className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all text-lg font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Donor Info */}
            <div className="space-y-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donor-firstName" className="block font-bold mb-2 dark:text-white">First Name *</label>
                  <input
                    id="donor-firstName"
                    type="text"
                    name="firstName"
                    required
                    value={donor.firstName}
                    onChange={handleDonorChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="donor-lastName" className="block font-bold mb-2 dark:text-white">Last Name *</label>
                  <input
                    id="donor-lastName"
                    type="text"
                    name="lastName"
                    required
                    value={donor.lastName}
                    onChange={handleDonorChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="donor-email" className="block font-bold mb-2 dark:text-white">Email Address *</label>
                <input
                  id="donor-email"
                  type="email"
                  name="email"
                  required
                  value={donor.email}
                  onChange={handleDonorChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="For receipt and updates"
                />
              </div>
              <div>
                <label htmlFor="donor-phone" className="block font-bold mb-2 dark:text-white">Phone Number *</label>
                <input
                  id="donor-phone"
                  type="tel"
                  name="phone"
                  required
                  value={donor.phone}
                  onChange={handleDonorChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="+233 XXX XXX XXX"
                />
              </div>
              <div>
                <label htmlFor="donor-message" className="block font-bold mb-2 dark:text-white">Message (Optional)</label>
                <textarea
                  id="donor-message"
                  name="message"
                  rows={3}
                  value={donor.message}
                  onChange={handleDonorChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                  placeholder="Leave a message or dedication..."
                ></textarea>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <label className="block font-black text-lg mb-4 dark:text-white">Payment Method</label>
              <div className="grid md:grid-cols-3 gap-4" role="radiogroup" aria-label="Payment method">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.name}
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === method.name}
                    onClick={() => setPaymentMethod(method.name)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.name
                        ? 'border-primary bg-primary/5'
                        : 'border-[#e5e7eb] dark:border-white/15 hover:border-primary hover:bg-background-light dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary" aria-hidden="true">{method.icon}</span>
                    <span className="font-bold dark:text-white">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-xl font-black text-xl hover:bg-primary-dark transition-all shadow-xl"
            >
              Complete Donation
            </button>

            <p className="text-center text-sm text-[#617289] dark:text-gray-400 mt-6">
              🔒 Your donation is secure and will be used to support GPAA programs and advocacy
            </p>
          </form>
          </motion.div>
        </div>
      </section>

      {/* Alternative Ways to Give */}
      <section className="py-20 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-250 mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center dark:text-white">Other Ways to Support</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 dark:text-white">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                Bank Transfer - GCB
              </h3>
              <div className="space-y-2 text-[#617289] dark:text-gray-400">
                <p><strong>Account Name:</strong> Ghana Physician Assistants Association</p>
                <p><strong>Account Number:</strong> 6011130017673</p>
                <p><strong>Bank:</strong> GCB Plc</p>
                <p><strong>Branch:</strong> Kumasi Main Branch</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 dark:text-white">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                Bank Transfer - SCB
              </h3>
              <div className="space-y-2 text-[#617289] dark:text-gray-400">
                <p><strong>Account Name:</strong> Ghana Physician Assistants Association</p>
                <p><strong>Account Number:</strong> 0100113743500</p>
                <p><strong>Bank:</strong> Standard Chartered Bank</p>
                <p><strong>Branch:</strong> Liberia Road</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-3 dark:text-white">
              <span className="material-symbols-outlined text-primary">phone_android</span>
              Mobile Money
            </h3>
            <div className="space-y-2 text-[#617289] dark:text-gray-400">
              <p><strong>MTN:</strong> 0XX XXX XXXX</p>
              <p><strong>Vodafone:</strong> 0XX XXX XXXX</p>
              <p><strong>AirtelTigo:</strong> 0XX XXX XXXX</p>
              <p><strong>Name:</strong> GPAA Donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '5,000+', label: 'Members Supported', icon: 'groups' },
            { value: '120+', label: 'Health Outreaches', icon: 'volunteer_activism' },
            { value: '50+', label: 'CPD Programs Annually', icon: 'school' },
            { value: '12+', label: 'Policy Wins', icon: 'emoji_events' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 bg-background-light dark:bg-[#0c0f12] rounded-2xl border border-[#e5e7eb] dark:border-white/10"
            >
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">{stat.icon}</span>
              <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How Funds Are Used */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 dark:text-white">How Your Donation Helps</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl">Transparent allocation of funds for maximum impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { percent: '40%', title: 'CPD & Training', desc: 'Professional development programs for members', icon: 'school', color: 'bg-primary' },
            { percent: '30%', title: 'Advocacy', desc: 'Legislative lobbying and policy work', icon: 'gavel', color: 'bg-primary' },
            { percent: '20%', title: 'Community Outreach', desc: 'Free health screenings and awareness', icon: 'volunteer_activism', color: 'bg-primary' },
            { percent: '10%', title: 'Operations', desc: 'Administrative and operational costs', icon: 'settings', color: 'bg-primary' },
          ].map((fund, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all text-center"
            >
              <div className={`size-16 ${fund.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6`}>
                <span className="material-symbols-outlined text-3xl">{fund.icon}</span>
              </div>
              <div className="text-4xl font-black text-green-700 dark:text-green-400 mb-3">{fund.percent}</div>
              <h3 className="text-xl font-black mb-2 dark:text-white">{fund.title}</h3>
              <p className="text-[#617289] dark:text-gray-400">{fund.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Donate;
