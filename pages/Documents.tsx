import React, { useEffect, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { downloadDocument, getDocuments } from '../lib/documentsApi';
import { showToast } from '../components/Toast';
import type { Document } from '../types';

const Documents: React.FC = () => {
  usePageTitle('Documents', 'Browse and access official GPAA documents, including financial reports, policies, and forms.');
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  const categories = ['All', 'Financial', 'Reports', 'Calendar', 'Policies', 'Forms'];

  useEffect(() => {
    getDocuments()
      .then(setDocuments)
      .catch((err) => showToast(err instanceof Error ? err.message : 'Could not load documents.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  // Deep-link support: /documents#forms preselects the Forms category
  useEffect(() => {
    if (location.hash === '#forms') {
      setSelectedCategory('Forms');
    }
  }, [location.hash]);

  const handleDownload = (doc: Document) => {
    downloadDocument(doc).catch((err) =>
      showToast(err instanceof Error ? err.message : `Could not download "${doc.title}".`, 'error')
    );
  };

  const filteredDocs = selectedCategory === 'All'
    ? documents
    : documents.filter(doc => doc.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial': return 'account_balance';
      case 'Reports': return 'description';
      case 'Calendar': return 'event';
      case 'Policies': return 'gavel';
      case 'Forms': return 'article';
      default: return 'folder';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial': return 'text-ghana-green bg-ghana-green/10';
      case 'Reports': return 'text-primary bg-primary/10';
      case 'Calendar': return 'text-amber-800 dark:text-ghana-gold bg-ghana-gold/10';
      case 'Policies': return 'text-green-dark bg-green-dark/10';
      case 'Forms': return 'text-orange-800 dark:text-accent bg-accent/10';
      default: return 'text-[#617289] bg-[#617289]/10';
    }
  };

  return (
    <div className="bg-white dark:bg-[#14181c] min-h-screen">
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
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Document Library
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto">
              Access important GPAA documents including financial statements, reports, calendars, policies, and forms.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filter */}
      <section id="forms" className="py-12 px-6 bg-background-light dark:bg-[#0c0f12] border-b-2 border-[#e5e7eb] dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-ghana-green text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-[#14181c] text-[#617289] dark:text-gray-400 hover:bg-primary/10 border-2 border-[#e5e7eb] dark:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-center text-[#617289] dark:text-gray-400 text-lg py-20">Loading documents…</p>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-8xl text-[#617289]/30 dark:text-gray-600 mb-4">folder_open</span>
              <p className="text-[#617289] dark:text-gray-400 text-xl">No documents found in this category</p>
            </div>
          ) : (
            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  variants={fadeInUp}
                  className="bg-white dark:bg-[#14181c] rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`size-14 rounded-xl flex items-center justify-center ${getCategoryColor(doc.category)}`}>
                        <span className="material-symbols-outlined text-3xl">{getCategoryIcon(doc.category)}</span>
                      </div>
                      <span className="text-xs font-bold text-[#617289] dark:text-gray-400 bg-background-light dark:bg-white/5 px-3 py-1 rounded-full">
                        {doc.category}
                        {doc.visibility === 'members' && ' · Members Only'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {doc.title}
                    </h3>

                    <p className="text-[#617289] dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {doc.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#617289] dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {new Date(doc.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {doc.fileSizeBytes && (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">description</span>
                          {doc.fileSizeBytes < 1024 * 1024
                            ? `${Math.round(doc.fileSizeBytes / 1024)} KB`
                            : `${(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="w-full flex items-center justify-center gap-2 bg-ghana-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-dark transition-all group-hover:scale-105 transform"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">download</span>
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Members Only Notice */}
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
                <span className="material-symbols-outlined text-4xl">lock</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">Members Only Access</h3>
                <p className="text-[#617289] dark:text-gray-400 text-lg mb-6">
                  Some documents are restricted to current GPAA members. Please log in to access the full document library, 
                  including detailed financial reports, minutes of meetings, and confidential policy documents.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-ghana-green text-white px-8 py-4 rounded-xl font-bold hover:bg-green-dark transition-all"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">login</span>
                  Member Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Documents;
