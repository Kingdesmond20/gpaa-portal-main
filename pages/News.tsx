import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { MORE_NEWS, NEWS } from '../constants';
import { showToast } from '../components/Toast';
import NewsArticleLink, { isExternalLink } from '../components/NewsArticleLink';


const News: React.FC = () => {
  usePageTitle('News', 'The latest news, updates, and official press releases from the Ghana Physician Assistants Association.');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — swap this for a real POST /api/newsletter/subscribe once Phase 2 lands.
    showToast("Thanks for subscribing! We'll send updates to your inbox.", 'success');
    setNewsletterEmail('');
  };

  const allNews = [...NEWS, ...MORE_NEWS];
  const featured = allNews[0];

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
              News & Updates
            </h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Stay informed about the latest developments, announcements, and press releases from GPAA
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Story */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center bg-background-light dark:bg-[#0c0f12] rounded-3xl overflow-hidden"
        >
          <div className="h-full">
            <img
              loading="lazy"
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover min-h-100"
            />
          </div>
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="inline-block bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase">
                Featured Story
              </span>
              {featured.date && <span className="text-[#617289] dark:text-gray-400 text-sm font-bold">{featured.date}</span>}
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">{featured.title}</h2>
            <p className="text-[#617289] dark:text-gray-400 text-lg mb-8 leading-relaxed">{featured.description}</p>
            <NewsArticleLink
              href={featured.link}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all"
            >
              Read Full Article
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                {isExternalLink(featured.link) ? 'open_in_new' : 'arrow_forward'}
              </span>
            </NewsArticleLink>
            {featured.source && (
              <p className="mt-3 text-sm text-[#617289] dark:text-gray-400">
                Source: {featured.source}
              </p>
            )}
          </div>
        </motion.div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">Recent Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.slice(1).map((item, idx) => (
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

      {/* Official Statements & Press Releases */}
      <section className="py-20 px-6 max-w-250 mx-auto">
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

      {/* Newsletter Signup */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-200 mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">Never Miss an Update</h2>
          <p className="text-white/90 text-xl mb-10">
            Subscribe to our newsletter and get the latest news delivered to your inbox
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <label htmlFor="news-newsletter-email" className="sr-only">Email address</label>
            <input
              id="news-newsletter-email"
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

export default News;
