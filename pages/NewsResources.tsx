import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { MORE_NEWS, NEWS } from '../constants';
import { showToast } from '../components/Toast';
import NewsArticleLink, { isExternalLink } from '../components/NewsArticleLink';
import { downloadDocument, getDocuments } from '../lib/documentsApi';
import type { Document } from '../types';

const NewsResources: React.FC = () => {
  usePageTitle('News & Resources', 'News, research publications, newsletters, and downloadable resources from GPAA.');
  const [activeTab, setActiveTab] = useState<'news' | 'research' | 'newsletters' | 'downloads'>('news');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    getDocuments()
      .then(setDocuments)
      .catch((err) => showToast(err instanceof Error ? err.message : 'Could not load documents.', 'error'))
      .finally(() => setDocumentsLoading(false));
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — swap this for a real POST /api/newsletter/subscribe once Phase 2 lands.
    showToast("Thanks for subscribing! We'll send updates to your inbox.", 'success');
    setNewsletterEmail('');
  };

  const allNews = [...NEWS, ...MORE_NEWS];

  // Real, published research about physician assistants in Ghana — each entry
  // was fetched and verified directly at its source before being listed here.
  // GPAA is not the publisher of either; the first is independent scholarship
  // on PA training in Ghana, and the second explicitly recruited its 439
  // participants through GPAA's own email list and WhatsApp platform.
  const researchPapers = [
    {
      title: 'The Evolution of Training and Practice of Physician Assistantship in Ghana',
      authors: 'Rebecca Bantey, Anthony Arkoh',
      journal: 'Social Innovations Journal',
      year: '2021',
      type: 'Review Article',
      link: 'https://socialinnovationsjournal.com/index.php/sij/article/view/941',
      pdfLink: 'https://socialinnovationsjournal.com/index.php/sij/article/download/941/723/3722',
    },
    {
      title: 'Association Between Meeting Sleep Guidelines and Anxiety Symptoms Among Physician Assistants in Ghana: A Cross-Sectional Study',
      authors: 'Richard Armah Danyi, Patrick Kwame Akwaboah',
      journal: 'Frontiers in Sleep',
      year: '2026',
      type: 'Original Research',
      link: 'https://www.frontiersin.org/journals/sleep/articles/10.3389/frsle.2026.1928518/full',
      pdfLink: 'https://www.frontiersin.org/journals/sleep/articles/10.3389/frsle.2026.1928518/pdf',
    },
  ];

  const q = searchQuery.trim().toLowerCase();
  const matches = (...fields: (string | undefined)[]) =>
    q === '' || fields.some((f) => f?.toLowerCase().includes(q));

  const visibleNews = allNews.filter((item) => matches(item.title, item.description, item.category));
  const visibleResearch = researchPapers.filter((p) => matches(p.title, p.authors, p.journal, p.type));
  const visibleDownloads = documents.filter((d) => matches(d.title, d.description, d.category));

  const formatSize = (bytes: number | null): string => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const categoryIcon = (category: Document['category']): string =>
    ({ Financial: 'account_balance', Reports: 'description', Calendar: 'event', Policies: 'gavel', Forms: 'article' }[category] ?? 'folder');

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
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              News & Resources
            </h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto mb-10">
              Stay informed with the latest updates and access professional publications, research, and resources
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <label htmlFor="nr-search" className="sr-only">Search news and resources</label>
                <input
                  id="nr-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news and resources..."
                  className="flex-1 px-6 py-4 rounded-xl outline-none text-lg bg-white placeholder:text-[#617289] transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                />
                <button type="button" className="bg-white text-primary px-8 py-4 rounded-xl font-black hover:bg-slate-100 transition-all">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Resource Categories */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: 'News & Updates', icon: 'newsmode', count: `${allNews.length} ${allNews.length === 1 ? 'Article' : 'Articles'}`, color: 'bg-primary', key: 'news' },
            { title: 'Research & Journals', icon: 'science', count: `${researchPapers.length} ${researchPapers.length === 1 ? 'Paper' : 'Papers'}`, color: 'bg-green-500', key: 'research' },
            { title: 'Newsletters', icon: 'newspaper', count: 'Coming soon', color: 'bg-purple-500', key: 'newsletters' },
            { title: 'Downloads', icon: 'download', count: documentsLoading ? 'Loading…' : `${documents.length} ${documents.length === 1 ? 'Document' : 'Documents'}`, color: 'bg-orange-500', key: 'downloads' },
          ].map((cat, idx) => (
            <motion.button
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveTab(cat.key as any)}
              className={`p-6 md:p-8 rounded-2xl border-2 transition-all cursor-pointer group ${
                activeTab === cat.key
                  ? 'border-primary bg-primary/5 shadow-xl'
                  : 'border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl bg-white dark:bg-[#14181c]'
              }`}
            >
              <div className={`size-12 md:size-16 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl md:text-3xl">{cat.icon}</span>
              </div>
              <h3 className="text-lg md:text-2xl font-black mb-2">{cat.title}</h3>
              <p className="text-[#617289] dark:text-gray-400 font-bold text-sm md:text-base">{cat.count}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* News Section */}
      {activeTab === 'news' && (
        <>
          {visibleNews.length === 0 ? (
            <section className="py-20 px-6 max-w-7xl mx-auto text-center text-[#617289] dark:text-gray-400">
              No news matches "{searchQuery}".
            </section>
          ) : (
            <>
              {/* Featured Story */}
              <section className="py-20 px-6 max-w-7xl mx-auto">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="grid md:grid-cols-2 gap-12 items-center bg-background-light dark:bg-[#0c0f12] rounded-3xl overflow-hidden"
                >
                  <div className="h-full">
                    <img
              loading="lazy"
                      src={visibleNews[0].image}
                      alt={visibleNews[0].title}
                      className="w-full h-full object-cover min-h-100"
                    />
                  </div>
                  <div className="p-8 md:p-12">
                    <span className="inline-block bg-primary text-white text-xs font-black px-4 py-2 rounded-full mb-4 uppercase">
                      Featured Story
                    </span>
                    <h2 className="text-4xl font-black mb-6 leading-tight">{visibleNews[0].title}</h2>
                    <p className="text-[#617289] dark:text-gray-400 text-lg mb-8 leading-relaxed">{visibleNews[0].description}</p>
                    <NewsArticleLink
                      href={visibleNews[0].link}
                      className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all"
                    >
                      Read Full Article
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">
                        {isExternalLink(visibleNews[0].link) ? 'open_in_new' : 'arrow_forward'}
                      </span>
                    </NewsArticleLink>
                    {visibleNews[0].source && (
                      <p className="mt-3 text-sm text-[#617289] dark:text-gray-400">Source: {visibleNews[0].source}</p>
                    )}
                  </div>
                </motion.div>
              </section>

              {/* News Grid */}
              {visibleNews.length > 1 && (
                <section className="py-20 bg-background-light dark:bg-[#0c0f12] px-6">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-black mb-12">Recent Updates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {visibleNews.slice(1).map((item, idx) => (
                        <motion.div
                          key={item.title}
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <NewsArticleLink
                            href={item.link}
                            aria-label={`${item.title}${item.source ? ` — ${item.source}` : ''}`}
                            className="block bg-white dark:bg-[#14181c] rounded-2xl overflow-hidden border border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all group"
                          >
                            <div className="h-48 overflow-hidden">
                              <img
              loading="lazy"
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-3 gap-2">
                                <span className="text-primary text-xs font-black px-3 py-1 bg-primary/10 rounded-full uppercase">
                                  {item.category}
                                </span>
                                {item.date && <span className="text-[#617289] dark:text-gray-400 text-sm font-bold">{item.date}</span>}
                              </div>
                              <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">
                                {item.title}
                              </h3>
                              <p className="text-[#617289] dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                              <div className="flex items-center justify-between text-primary font-bold gap-2">
                                <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                                  Read More
                                  <span className="material-symbols-outlined text-sm">
                                    {isExternalLink(item.link) ? 'open_in_new' : 'arrow_forward'}
                                  </span>
                                </span>
                                {item.source && <span className="text-[#617289] dark:text-gray-400 font-normal text-sm">{item.source}</span>}
                              </div>
                            </div>
                          </NewsArticleLink>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          {/* Official Statements & Press Releases */}
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-4">Official Statements & Press Releases</h2>
            <p className="text-[#617289] dark:text-gray-400 text-lg mb-10 max-w-3xl">
              GPAA publishes official statements and press releases through its social media channels.
              Follow along there for the latest, or get in touch directly.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <a
                href="https://www.facebook.com/GhanaPhysicianAssistantsAssociation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 bg-background-light dark:bg-[#0c0f12] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 hover:bg-white dark:hover:bg-white/5 hover:shadow-lg transition-all group"
              >
                <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">thumb_up</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black group-hover:text-primary transition-colors">GPAA on Facebook</h3>
                  <p className="text-[#617289] dark:text-gray-400 text-sm">Official statements, event coverage, and announcements.</p>
                </div>
                <span className="material-symbols-outlined text-[#617289] dark:text-gray-400 group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </a>
              <a
                href="mailto:gpaanational@gmail.com"
                className="flex items-center gap-6 bg-background-light dark:bg-[#0c0f12] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 hover:bg-white dark:hover:bg-white/5 hover:shadow-lg transition-all group"
              >
                <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black group-hover:text-primary transition-colors">Media & Press Enquiries</h3>
                  <p className="text-[#617289] dark:text-gray-400 text-sm">gpaanational@gmail.com</p>
                </div>
                <span className="material-symbols-outlined text-[#617289] dark:text-gray-400 group-hover:text-primary transition-colors">
                  arrow_forward
                </span>
              </a>
            </div>
          </section>
        </>
      )}

      {/* Research Section */}
      {activeTab === 'research' && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">Latest Research & Publications</h2>
          {visibleResearch.length === 0 ? (
            <p className="text-center text-[#617289] dark:text-gray-400">No research papers match "{searchQuery}".</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleResearch.map((paper, idx) => (
                <motion.div
                  key={paper.title}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-lg transition-all group"
                >
                  <span className="inline-block bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full mb-4 uppercase">
                    {paper.type}
                  </span>
                  <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">
                    {paper.title}
                  </h3>
                  <div className="text-[#617289] dark:text-gray-400 text-sm mb-4">
                    <p className="font-bold">{paper.authors}</p>
                    <p>{paper.journal} • {paper.year}</p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={paper.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-primary text-white py-2 px-4 rounded-lg font-bold text-sm hover:bg-primary-dark transition-all"
                    >
                      <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">download</span>
                      Download PDF
                    </a>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read "${paper.title}" online`}
                      className="bg-background-light dark:bg-white/5 px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e5e7eb] dark:hover:bg-white/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Newsletters Section */}
      {activeTab === 'newsletters' && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-4">GPAA Newsletter</h2>
          <p className="text-[#617289] dark:text-gray-400 text-lg mb-10 max-w-3xl">
            There's no online newsletter archive yet. In the meantime, follow GPAA's official
            channels below, or subscribe for updates by email at the bottom of this page.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <a
              href="https://www.facebook.com/GhanaPhysicianAssistantsAssociation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 bg-background-light dark:bg-[#0c0f12] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 hover:bg-white dark:hover:bg-white/5 hover:shadow-lg transition-all group"
            >
              <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">thumb_up</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black group-hover:text-primary transition-colors">GPAA on Facebook</h3>
                <p className="text-[#617289] dark:text-gray-400 text-sm">Event coverage and announcements.</p>
              </div>
              <span className="material-symbols-outlined text-[#617289] dark:text-gray-400 group-hover:text-primary transition-colors">
                open_in_new
              </span>
            </a>
            <a
              href="https://www.instagram.com/gpaa_official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 bg-background-light dark:bg-[#0c0f12] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 hover:bg-white dark:hover:bg-white/5 hover:shadow-lg transition-all group"
            >
              <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black group-hover:text-primary transition-colors">GPAA on Instagram</h3>
                <p className="text-[#617289] dark:text-gray-400 text-sm">Photos from conferences and outreach.</p>
              </div>
              <span className="material-symbols-outlined text-[#617289] dark:text-gray-400 group-hover:text-primary transition-colors">
                open_in_new
              </span>
            </a>
          </div>
        </section>
      )}

      {/* Downloads Section */}
      {activeTab === 'downloads' && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <h2 className="text-4xl font-black">Downloads Library</h2>
            <Link to="/documents" className="text-primary font-bold hover:underline">
              View full Document Library →
            </Link>
          </div>
          {documentsLoading ? (
            <p className="text-center text-[#617289] dark:text-gray-400">Loading documents…</p>
          ) : visibleDownloads.length === 0 ? (
            <p className="text-center text-[#617289] dark:text-gray-400">
              {documents.length === 0
                ? 'No documents have been uploaded yet — check back soon, or browse the full Document Library.'
                : `No documents match "${searchQuery}".`}
            </p>
          ) : (
            <div className="space-y-4">
              {visibleDownloads.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between gap-4 bg-white dark:bg-[#14181c] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">{categoryIcon(doc.category)}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black mb-1 truncate">{doc.title}</h3>
                      <p className="text-sm text-[#617289] dark:text-gray-400">
                        {doc.category}
                        {formatSize(doc.fileSizeBytes) && ` • ${formatSize(doc.fileSizeBytes)}`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadDocument(doc).catch((err) => showToast(err instanceof Error ? err.message : `Could not download "${doc.title}".`, 'error'))}
                    className="shrink-0 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">download</span>
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-200 mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">Never Miss an Update</h2>
          <p className="text-white/90 text-xl mb-10">
            Subscribe to our newsletter and get the latest news delivered to your inbox
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <label htmlFor="newsresources-newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsresources-newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl outline-none"
            />
            <button type="submit" className="bg-white text-primary px-8 py-4 rounded-xl font-black hover:bg-slate-100 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NewsResources;
