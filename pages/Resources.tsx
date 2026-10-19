import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';

const RESEARCH_PAPERS = [
  {
    title: 'The Role of Physician Assistants in Ghana\'s Primary Healthcare System',
    authors: 'Mensah P., Boateng A., et al.',
    journal: 'Ghana Medical Journal',
    year: '2026',
    type: 'Research Paper'
  },
  {
    title: 'Impact of CHPS Zones on Maternal Mortality Rates in Northern Ghana',
    authors: 'Appiah K., Tetteh S.',
    journal: 'African Journal of Primary Healthcare',
    year: '2025',
    type: 'Original Research'
  },
  {
    title: 'Scope of Practice Expansion: International Lessons for Ghana',
    authors: 'GPAA Research Committee',
    journal: 'GPAA Quarterly Review',
    year: '2025',
    type: 'Review Article'
  },
  {
    title: 'Burnout and Mental Health Among Physician Assistants: A National Survey',
    authors: 'Owusu J., Addo M.',
    journal: 'West African Health Sciences',
    year: '2025',
    type: 'Survey Research'
  },
];

const NEWSLETTERS = [
  { month: 'February 2026', title: 'New Year, New Advocacy Goals', cover: '/images/stock/advocacy-fair-wages.jpg' },
  { month: 'January 2026', title: 'AGM 2026: Save the Date', cover: '/images/stock/community-cultural.jpg' },
  { month: 'December 2025', title: '2025 Year in Review', cover: '/images/stock/research-lab-sample.jpg' },
];

const DOWNLOADS = [
  { title: 'GPAA Constitution (2024 Edition)', type: 'PDF', size: '2.4 MB', icon: 'gavel' },
  { title: 'CPD Credits Requirements & Guidelines', type: 'PDF', size: '1.8 MB', icon: 'school' },
  { title: 'Code of Professional Ethics', type: 'PDF', size: '890 KB', icon: 'verified' },
  { title: 'Membership Registration Form', type: 'PDF', size: '450 KB', icon: 'description' },
  { title: 'Annual Report 2025', type: 'PDF', size: '5.2 MB', icon: 'summarize' },
  { title: 'Financial Transparency Report 2025', type: 'PDF', size: '1.1 MB', icon: 'account_balance' },
];

const CATEGORIES = [
  { title: 'Research & Journals', icon: 'science', count: '45+ Papers', color: 'bg-primary', targetId: 'research' },
  { title: 'Newsletters', icon: 'newspaper', count: '120+ Issues', color: 'bg-primary', targetId: 'newsletters' },
  { title: 'Reports & Fact Sheets', icon: 'summarize', count: '30+ Documents', color: 'bg-primary', targetId: 'downloads' },
  { title: 'CPD Materials', icon: 'school', count: '200+ Resources', color: 'bg-primary', href: '/membership#benefits' },
];

const Resources: React.FC = () => {
  usePageTitle('Resources', 'Access GPAA research journals, newsletters, reports, and professional development materials.');
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.trim().toLowerCase();
  const matches = (...fields: (string | undefined)[]) =>
    q === '' || fields.some((f) => f?.toLowerCase().includes(q));

  const visibleResearch = RESEARCH_PAPERS.filter((p) => matches(p.title, p.authors, p.journal, p.type));
  const visibleNewsletters = NEWSLETTERS.filter((n) => matches(n.title, n.month));
  const visibleDownloads = DOWNLOADS.filter((d) => matches(d.title, d.type));

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-linear-to-r from-primary to-primary-dark py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-4 md:mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-white">Resources</span>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">
              Resources & Publications
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10">
              Access research journals, newsletters, reports, and professional development materials.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="resources-search" className="sr-only">Search resources</label>
                <input
                  id="resources-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="flex-1 min-w-0 h-12 md:h-14 px-5 md:px-6 rounded-xl outline-none text-base md:text-lg bg-white dark:bg-[#14181c] placeholder:text-[#617289] dark:placeholder:text-gray-400 dark:text-white transition-all focus:ring-2 focus:ring-primary focus:ring-offset-1"
                />
                <button
                  type="button"
                  className="h-12 md:h-14 shrink-0 w-full sm:w-auto bg-white text-primary px-6 md:px-8 rounded-xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">search</span>
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories */}
      <section className="py-10 md:py-14 lg:py-16 px-4 md:px-6 bg-white dark:bg-[#14181c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 dark:text-white">Browse by Category</h2>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Jump straight to the research, newsletters, reports, and professional development materials you need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CATEGORIES.map((cat, idx) => {
              const cardClasses = "h-full w-full flex flex-col text-left bg-white dark:bg-[#14181c] p-6 md:p-8 rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl transition-all cursor-pointer group";
              const inner = (
                <>
                  <div className={`size-14 md:size-16 shrink-0 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-5 md:mb-6 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-2xl md:text-3xl" aria-hidden="true">{cat.icon}</span>
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black mb-2 leading-tight min-h-[2.5em] dark:text-white">{cat.title}</h3>
                  <p className="text-[#617289] dark:text-gray-400 font-bold text-sm md:text-base mb-4">{cat.count}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Explore Resources
                    <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
                  </span>
                </>
              );
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  {cat.href ? (
                    <Link to={cat.href} className={cardClasses}>{inner}</Link>
                  ) : (
                    <button type="button" onClick={() => scrollToSection(cat.targetId!)} className={cardClasses}>{inner}</button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research & Journals */}
      <section id="research" className="py-10 md:py-14 lg:py-16 bg-background-light dark:bg-[#0c0f12] px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 md:mb-10 dark:text-white">Latest Research & Publications</h2>
          {visibleResearch.length === 0 ? (
            <p className="text-center text-[#617289] dark:text-gray-400">No research papers match "{searchQuery}".</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleResearch.map((paper, idx) => (
                <motion.div
                  key={paper.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-lg transition-all group"
                >
                  <span className="inline-block bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full mb-4 uppercase">
                    {paper.type}
                  </span>
                  <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors leading-tight dark:text-white">
                    {paper.title}
                  </h3>
                  <div className="text-[#617289] dark:text-gray-400 text-sm mb-4">
                    <p className="font-bold">{paper.authors}</p>
                    <p>{paper.journal} • {paper.year}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => showToast(`"${paper.title}" isn't uploaded yet — check back soon.`, 'info')}
                      className="flex-1 cursor-pointer bg-primary text-white py-2 px-4 rounded-lg font-bold text-sm hover:bg-primary-dark transition-all"
                    >
                      <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">download</span>
                      Download PDF
                    </button>
                    <button
                      type="button"
                      aria-label={`Share "${paper.title}"`}
                      onClick={() => showToast('Sharing is coming soon.', 'info')}
                      className="bg-background-light dark:bg-white/5 cursor-pointer px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e5e7eb] dark:hover:bg-white/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">share</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletters */}
      <section id="newsletters" className="py-10 md:py-14 lg:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 md:mb-10 dark:text-white">GPAA Monthly Newsletter</h2>
        {visibleNewsletters.length === 0 ? (
          <p className="text-center text-[#617289] dark:text-gray-400">No newsletters match "{searchQuery}".</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleNewsletters.map((newsletter, idx) => (
              <motion.div
                key={newsletter.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#14181c] rounded-2xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="h-48 overflow-hidden">
                  <img
              loading="lazy" src={newsletter.cover} alt={newsletter.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-primary font-bold text-sm mb-2">{newsletter.month}</div>
                  <h3 className="text-xl font-black mb-4 dark:text-white">{newsletter.title}</h3>
                  <button
                    type="button"
                    onClick={() => showToast(`"${newsletter.title}" will be readable online soon.`, 'info')}
                    className="w-full cursor-pointer bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all"
                  >
                    Read Online
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Downloads Library */}
      <section id="downloads" className="py-10 md:py-14 lg:py-16 bg-background-light dark:bg-[#0c0f12] px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 md:mb-10 dark:text-white">Downloads Library</h2>
          {visibleDownloads.length === 0 ? (
            <p className="text-center text-[#617289] dark:text-gray-400">No documents match "{searchQuery}".</p>
          ) : (
            <div className="space-y-4">
              {visibleDownloads.map((file, idx) => (
                <motion.div
                  key={file.title}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between bg-white dark:bg-[#14181c] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined" aria-hidden="true">{file.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-black mb-1 dark:text-white">{file.title}</h3>
                      <p className="text-sm text-[#617289] dark:text-gray-400">{file.type} • {file.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`"${file.title}" isn't uploaded yet — the document library is being finalized.`, 'info')}
                    className="bg-primary cursor-pointer text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">download</span>
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Resources;
