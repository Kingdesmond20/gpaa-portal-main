import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { GHANA_REGIONS } from '../constants';

// Sample member data - in production this would come from a database
const SAMPLE_MEMBERS = [
  { id: '001', firstName: 'Kwame', lastName: 'Mensah', category: 'Professional Member', region: 'Greater Accra', district: 'Accra Metro', facility: 'Korle Bu Teaching Hospital', email: 'kwame.m@example.com', phone: '+233 24 XXX XXXX', showContact: true },
  { id: '002', firstName: 'Ama', lastName: 'Asante', category: 'Professional Member', region: 'Ashanti', district: 'Kumasi Metro', facility: 'Komfo Anokye Teaching Hospital', email: 'ama.a@example.com', phone: '+233 24 XXX XXXX', showContact: true },
  { id: '003', firstName: 'Kofi', lastName: 'Boateng', category: 'Private Member', region: 'Greater Accra', district: 'Tema Metro', facility: 'Private Clinic - Tema', showContact: false },
  { id: '004', firstName: 'Adjoa', lastName: 'Owusu', category: 'Junior Physician Assistant', region: 'Eastern', district: 'Koforidua', facility: 'Eastern Regional Hospital', email: 'adjoa.o@example.com', showContact: true },
  { id: '005', firstName: 'Yaw', lastName: 'Agyemang', category: 'Professional Member', region: 'Northern', district: 'Tamale Metro', facility: 'Tamale Teaching Hospital', email: 'yaw.a@example.com', phone: '+233 24 XXX XXXX', showContact: true },
  // Add more sample members as needed
];

const MembersDirectory: React.FC = () => {
  usePageTitle('Members Directory', 'Search the GPAA members directory to connect with fellow Physician Assistants across Ghana.');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  const categories = ['All', 'Professional Member', 'Private Member', 'Junior Physician Assistant', 'Retired'];

  const filteredMembers = SAMPLE_MEMBERS.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.facility.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegion === 'All' || member.region === selectedRegion;
    const matchesCategory = selectedCategory === 'All' || member.category === selectedCategory;

    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-[#14181c] min-h-screen">
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
              Members Directory
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto">
              Connect with fellow Physician Assistants across Ghana. Find colleagues by region, district, or facility.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Search & Filter */}
      <section className="py-12 px-6 bg-background-light dark:bg-[#0c0f12] border-b-2 border-[#e5e7eb] dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <label htmlFor="directory-search" className="sr-only">Search by name or facility</label>
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617289] dark:text-gray-400 text-2xl" aria-hidden="true">
                search
              </span>
              <input
                id="directory-search"
                type="text"
                placeholder="Search by name, facility..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-ghana-green outline-none transition-all text-lg"
              />
            </div>

            {/* Category Filter */}
            <div>
              <span id="directory-category-label" className="block text-sm font-bold text-[#617289] dark:text-gray-400 mb-2 uppercase tracking-wide">Category</span>
              <div role="group" aria-labelledby="directory-category-label" className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-ghana-green text-white shadow-lg'
                        : 'bg-white dark:bg-[#14181c] text-[#617289] dark:text-gray-400 hover:bg-primary/10 border-2 border-[#e5e7eb] dark:border-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label htmlFor="directory-region" className="block text-sm font-bold text-[#617289] dark:text-gray-400 mb-2 uppercase tracking-wide">Region</label>
              <select
                id="directory-region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full md:w-auto px-6 py-4 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-ghana-green outline-none transition-all text-lg font-bold"
              >
                <option value="All">All Regions</option>
                {GHANA_REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-[#617289] dark:text-gray-400 text-lg">
            Showing <span className="font-black text-ghana-green">{filteredMembers.length}</span> members
          </div>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-8xl text-[#617289]/30 mb-4">person_search</span>
              <p className="text-[#617289] dark:text-gray-400 text-xl">No members found matching your criteria</p>
            </div>
          ) : (
            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  variants={fadeInUp}
                  className="bg-white dark:bg-[#14181c] rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl transition-all p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-16 rounded-full bg-ghana-green text-white flex items-center justify-center text-2xl font-black">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {member.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-2 dark:text-white">
                    {member.firstName} {member.lastName}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[#617289] dark:text-gray-400">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      <span className="text-sm">{member.region}, {member.district}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#617289] dark:text-gray-400">
                      <span className="material-symbols-outlined text-lg">local_hospital</span>
                      <span className="text-sm">{member.facility}</span>
                    </div>
                  </div>

                  {member.showContact && (
                    <div className="border-t-2 border-[#e5e7eb] dark:border-white/10 pt-4 space-y-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-ghana-green hover:text-green-dark transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">email</span>
                          {member.email}
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-ghana-green hover:text-green-dark transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">call</span>
                          {member.phone}
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Privacy Notice */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 px-6 bg-ghana-gold/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#14181c] p-8 md:p-12 rounded-3xl border-2 border-ghana-gold shadow-xl">
            <div className="flex items-start gap-6">
              <div className="size-16 rounded-full bg-ghana-gold/20 flex items-center justify-center text-amber-800 dark:text-ghana-gold shrink-0">
                <span className="material-symbols-outlined text-4xl">privacy_tip</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 dark:text-white">Privacy & Data Protection</h3>
                <p className="text-[#617289] dark:text-gray-400 text-lg mb-4">
                  Members have control over their contact information visibility. Only members who opt-in to share their
                  contact details will have their email and phone numbers displayed in this directory.
                </p>
                <p className="text-[#617289] dark:text-gray-400 text-lg">
                  To update your directory preferences or verify your information, please log in to your member portal
                  or contact the national secretariat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MembersDirectory;
