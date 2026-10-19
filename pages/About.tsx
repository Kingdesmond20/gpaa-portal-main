
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EXECUTIVES, PARTNERS, PARTNER_CATEGORIES, REGIONAL_EXECUTIVES, REGIONAL_EXECUTIVE_GROUPS } from '../constants';
import type { Partner, PartnerCategory } from '../types';

// A phone field may hold several numbers ('0208987105 / 0242919206'). Placeholder
// numbers in the data look like '+233 24 XXX XXXX'; only real ones are shown.
const realPhones = (phone?: string): string[] =>
  (phone ?? '').split(/[\/,]/).map((n) => n.trim()).filter((n) => n && !/x/i.test(n));

const LeadershipCard: React.FC<{ leader: typeof EXECUTIVES[0], idx: number }> = ({ leader, idx }) => {
  const [isExpanded, setIsExpanded] = useState(idx === 0);
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div 
      variants={fadeInUp} 
      className="bg-white dark:bg-[#14181c] rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary transition-all overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 md:p-8 flex items-center gap-6 text-left hover:bg-background-light dark:hover:bg-white/5 transition-all"
      >
        <div className="shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-md border-2 border-green/20">
            <img
              loading="lazy"
              src={leader.image}
              alt={leader.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-black text-[#111418] dark:text-white mb-1">{leader.name}</h3>
          <p className="text-primary font-bold text-base md:text-lg uppercase tracking-wide">{leader.role}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <span className="material-symbols-outlined text-4xl text-green">expand_more</span>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        {leader.bio && (
          <div className="px-6 md:px-8 pb-8 pt-4 border-t-2 border-green/10">
            <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed">
              {leader.bio}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PartnerLogo: React.FC<{ partner: typeof PARTNERS[0] }> = ({ partner }) => {
  if (partner.logo) {
    return (
      <img
        loading="lazy"
        src={partner.logo}
        alt={partner.name}
        className="max-h-full max-w-full object-contain"
      />
    );
  }
  return (
    <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 text-sm sm:text-base font-black text-primary text-center tracking-wide uppercase px-2">
      {partner.name
        .split(' ')
        .filter(w => w[0] === w[0]?.toUpperCase())
        .map(w => w[0])
        .join('')
        .slice(0, 6)}
    </span>
  );
};

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
  <motion.div
    className="h-full bg-background-light dark:bg-[#0c0f12] p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary hover:shadow-xl transition-all group flex flex-col justify-between"
    whileHover={{ y: -5 }}
  >
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-white/95 rounded-lg md:rounded-xl p-3 md:p-4 group-hover:bg-primary/5 transition-all">
      <PartnerLogo partner={partner} />
    </div>
    <h3
      title={partner.name}
      className="text-[11px] sm:text-xs md:text-sm font-black text-center group-hover:text-primary transition-colors leading-tight mt-3 px-1 dark:text-white line-clamp-3 min-h-[3.75em] flex items-center justify-center"
    >
      {partner.name}
    </h3>
  </motion.div>
);

const About: React.FC = () => {
  usePageTitle('About Us', 'Learn about GPAA\'s mission, history, national and regional leadership, and partner organizations advancing the Physician Assistant profession in Ghana.');
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
  
  // Partners Carousel — native scroll-snap track with paged arrows/indicators
  const partnersTrackRef = useRef<HTMLDivElement>(null);
  const [partnersActivePage, setPartnersActivePage] = useState(0);
  const [partnersPageCount, setPartnersPageCount] = useState(1);
  const [isPartnersPaused, setIsPartnersPaused] = useState(false);
  const [partnersCategory, setPartnersCategory] = useState<PartnerCategory | 'All'>('All');
  const [isPartnersExpanded, setIsPartnersExpanded] = useState(false);

  const filteredPartners = partnersCategory === 'All'
    ? PARTNERS
    : PARTNERS.filter((p) => p.category === partnersCategory);

  const recalcPartnersPages = useCallback(() => {
    const track = partnersTrackRef.current;
    if (!track || track.clientWidth === 0) return;
    setPartnersPageCount(Math.max(1, Math.round(track.scrollWidth / track.clientWidth)));
  }, []);

  useEffect(() => {
    recalcPartnersPages();
    const track = partnersTrackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', recalcPartnersPages);
      return () => window.removeEventListener('resize', recalcPartnersPages);
    }
    const observer = new ResizeObserver(recalcPartnersPages);
    observer.observe(track);
    return () => observer.disconnect();
  }, [recalcPartnersPages]);

  // Jump back to the start whenever the filtered set or view mode changes
  useEffect(() => {
    setPartnersActivePage(0);
    partnersTrackRef.current?.scrollTo({ left: 0 });
    recalcPartnersPages();
  }, [partnersCategory, isPartnersExpanded, recalcPartnersPages]);

  const scrollPartnersToPage = useCallback((page: number) => {
    const track = partnersTrackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(page, partnersPageCount - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  }, [partnersPageCount]);

  const handlePartnersScroll = useCallback(() => {
    const track = partnersTrackRef.current;
    if (!track || track.clientWidth === 0) return;
    setPartnersActivePage(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  // Gentle autoplay, paused on hover/touch/manual interaction or while the full grid is shown
  useEffect(() => {
    if (isPartnersPaused || isPartnersExpanded || partnersPageCount <= 1) return;
    const id = setInterval(() => {
      setPartnersActivePage((current) => {
        const next = (current + 1) % partnersPageCount;
        scrollPartnersToPage(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [isPartnersPaused, isPartnersExpanded, partnersPageCount, scrollPartnersToPage]);

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Page Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-64 md:h-80 lg:h-100 flex items-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/about/about-hero-bg.jpg')` }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm"
            >
              <Link to="/" className="hover:text-white">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary-light">About Us</span>
            </motion.div>
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 leading-tight"
            >
              Advancing Clinical Excellence Across Ghana
            </motion.h1>
          </div>
        </div>
      </motion.section>

      {/* About Description */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-6 md:py-10 px-4 md:px-6 max-w-7xl mx-auto"
      >
        <div className="bg-[#f8f9fb] dark:bg-[#0c0f12] p-6 md:p-10 lg:p-16 rounded-2xl md:rounded-3xl border border-[#e5e7eb] dark:border-white/10">
          <p className="text-[#617289] dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed">
            The Ghana Physician Assistants Association formerly known as the Ghana Medical Assistants Association has been in existence for over four (4) decades and is a registered health profession association registered with the Trade Union Congress (TUC) of Ghana while the training and practice of the profession is regulated by the Medical and Dental Council (MDC)-Ghana.
          </p>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        id="mission"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-10 md:py-15 px-4 md:px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <motion.div variants={fadeInUp} className="bg-[#f8f9fb] dark:bg-[#0c0f12] p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all">
            <div className="size-12 md:size-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary mb-6 md:mb-8">
              <span className="material-symbols-outlined text-3xl md:text-4xl">target</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 dark:text-white">Mission Statement</h2>
            <p className="text-[#617289] dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed">
              A highly respected, well-regulated, and influential Physician Assistant fraternity that leads in primary healthcare delivery, upholds excellence in professional practice, and contributes meaningfully to Ghana’s health system and global PA practice.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-[#f8f9fb] dark:bg-[#0c0f12] p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all">
            <div className="size-12 md:size-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary mb-6 md:mb-8">
              <span className="material-symbols-outlined text-3xl md:text-4xl">visibility</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 dark:text-white">Our Vision</h2>
            <p className="text-[#617289] dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed">
              To promote quality healthcare delivery through effective advocacy, professional development, welfare support, research, ethical practice, and strong collaboration with national and international stakeholders, while uniting all Physician Assistants under one strong professional body dedicated to excellence and service.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values Carousel */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-12 md:py-20 lg:py-24 px-4 md:px-6 bg-background-light dark:bg-[#0c0f12]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 dark:text-white">Our Core Values</h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[
              {
                icon: 'verified',
                title: 'Professionalism',
                description: 'Upholding the highest standards of clinical practice, ethical conduct, and continuous professional development'
              },
              {
                icon: 'handshake',
                title: 'Collaboration and Partnership',
                description: 'Building strategic relationships with healthcare institutions, government bodies, and international PA associations'
              },
              {
                icon: 'health_and_safety',
                title: 'Service to Humanity',
                description: 'Dedicated to providing compassionate, patient-centered care that improves health outcomes across all communities'
              },
              {
                icon: 'diversity_3',
                title: 'Unity and Solidarity',
                description: 'Fostering collaboration and solidarity among all PAs regardless of region, specialty, or level of practice'
              },
              {
                icon: 'workspace_premium',
                title: 'Innovation and Excellence',
                description: 'Commitment to quality healthcare delivery, evidence-based practice, and continuous improvement'
              },
              {
                icon: 'balance',
                title: 'Equity and Fairness',
                description: 'Ensuring equal opportunities, fair treatment, and justice for all members of the association'
              },
              {
                icon: 'shield',
                title: 'Integrity',
                description: 'Maintaining honesty, transparency, and ethical standards in all professional and organizational activities'
              },
              {
                icon: 'campaign',
                title: 'Advocacy',
                description: 'Championing the rights, welfare, and professional interests of all Physician Assistants across Ghana'
              },
              {
                icon: 'volunteer_activism',
                title: 'Community Commitment',
                description: 'Active engagement in community health initiatives and public service that benefits all Ghanaians'
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="aspect-square bg-white dark:bg-[#14181c] p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 hover:shadow-2xl transition-all group flex flex-col"
                whileHover={{ scale: 1.02 }}
              >
                <div className="size-10 md:size-12 bg-primary/10 text-primary rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-all shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-black mb-1 md:mb-2 leading-tight dark:text-white">{value.title}</h3>
                <p className="text-[#617289] dark:text-gray-400 text-xs md:text-sm leading-snug flex-1 overflow-hidden">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* President's Message */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-10 md:py-16 lg:py-20 bg-white dark:bg-[#14181c] px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 bg-white dark:bg-[#0c0f12] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[#e5e7eb] dark:border-white/10">
          <div className="w-full lg:w-2/5 aspect-4/5 bg-slate-200">
            <img
              loading="lazy" 
              src="/images/president.jpg" 
              alt="GPAA President" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 lg:p-16 w-full lg:w-3/5">
            <div className="inline-block text-primary font-black uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">Leadership Voice</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#111418] dark:text-white mb-6 md:mb-8 leading-tight">National President's Message</h2>
            <div className="relative">
              <span className="material-symbols-outlined text-5xl md:text-6xl lg:text-8xl absolute -top-6 md:-top-10 -left-4 md:-left-6 opacity-10 text-primary">format_quote</span>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl italic text-[#111418] dark:text-gray-100 leading-relaxed relative z-10 mb-6 md:mb-8 font-medium">
                "As Physician Assistants, we are often the first point of contact for patients across the length and breadth of our nation. Our commitment is to ensure every Ghanaian receives quality, compassionate care. Together, we are building a stronger, more resilient healthcare system for all."
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-black text-primary mb-1">Peter Akudugu Ayamba</p>
              <p className="text-sm sm:text-base md:text-lg text-[#617289] dark:text-gray-400 font-bold">National President, GPAA</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* History Timeline Preview */}
      <motion.section
        id="history"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-12 md:py-20 lg:py-24 px-4 md:px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 dark:text-white">Our Rich History</h2>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-background-light dark:bg-[#0c0f12] p-6 md:p-10 lg:p-16 rounded-2xl md:rounded-3xl border border-[#e5e7eb] dark:border-white/10">
          <div className="prose prose-sm md:prose-lg max-w-none">
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-6">
              The Ghana Physician Assistants Association formerly known as the Ghana Medical Assistants Association has been in existence for over four (4) decades and had had many leaders.
            </p>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-6">
              Prior to 1996 Delegates' congress in Koforidua at Eredec Hotel, Mr. Divine Kudjinu and Mr. Agyemfra, President and General Secretary respectively, and others of blessed memory steered the affairs of the Association.
            </p>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-6">
              The Delegates' Conference held in 1996 at Koforidua led to the election of the following as executives:
            </p>
            <ul className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6 space-y-2">
              <li>Mr. Agyemfra - President</li>
              <li>Mr. Ralph Dagoe - Vice President</li>
              <li>Mr. Tebbi - General Secretary</li>
              <li>Mr. Dorho - General Vice Secretary</li>
              <li>Mr. Isaac Lamptey - Public Relations Officer (Late)</li>
              <li>Mr. Oppong - Financial Secretary</li>
              <li>Miss Korantema - Treasurer</li>
            </ul>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-6">
              The newly elected officers in 1996 had their own internal conflicts which were unresolved. This led to internal strives which affected the organization of Delegates' Conference to elect new leaders until 2005 when there was a revolution which led to a Delegates' Conference in 2005 at the Crystal Rose Hotel in Kumasi-Ashanti Region.
            </p>
          </div>
          
          <div className="mt-6 md:mt-10 text-center">
            <Link
              to="/about/history"
              className="inline-flex items-center gap-2 md:gap-3 bg-primary text-white px-6 md:px-10 py-3 md:py-5 rounded-lg md:rounded-xl font-black text-sm md:text-base lg:text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
            >
              Read Complete History
              <span className="material-symbols-outlined text-lg md:text-xl">arrow_forward</span>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* Leadership - Collapsible */}
      <motion.section
        id="leadership"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-12 md:py-20 lg:py-24 bg-background-light dark:bg-[#0c0f12] px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 dark:text-white">National Leadership</h2>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl">The dedicated leaders steering our association forward with vision and integrity.</p>
          </motion.div>
          <motion.div variants={stagger} className="space-y-4 md:space-y-6">
            {EXECUTIVES.map((leader, idx) => (
              <LeadershipCard key={leader.name} leader={leader} idx={idx} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Regional Executives */}
      <motion.section
        id="regional"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-12 md:py-20 lg:py-24 bg-white dark:bg-[#14181c] px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 dark:text-white">Regional Executives</h2>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl">
              Our regional leaders ensuring representation and support across all 15 regions of Ghana.
            </p>
          </motion.div>
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONAL_EXECUTIVE_GROUPS.map(({ key: region, title }) => {
              const regionExecs = REGIONAL_EXECUTIVES.filter(exec => exec.region === region);
              const chairman = regionExecs.find(exec => exec.role === 'Chairman');
              const secretary = regionExecs.find(exec => exec.role === 'Secretary');
              
              return (
                <motion.div 
                  key={region} 
                  variants={fadeInUp}
                  className="bg-background-light dark:bg-[#0c0f12] rounded-2xl p-6 border-2 border-[#e5e7eb] dark:border-white/10 hover:border-primary transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-ghana-gold/30">
                    <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                    <h3 className="text-xl font-black text-[#111418] dark:text-white">{title}</h3>
                  </div>
                  <div className="space-y-4">
                    {chairman && (
                      <div className="flex items-center gap-3">
                        {chairman.image ? (
                          <img
              loading="lazy"
                            src={chairman.image}
                            alt={chairman.name}
                            className="size-12 rounded-full object-cover object-top border-2 border-primary/30 shrink-0"
                          />
                        ) : (
                          <div className="size-12 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
                            {chairman.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1">Chairman</div>
                          <div className="font-bold text-[#111418] dark:text-white">{chairman.name}</div>
                          {realPhones(chairman.phone).map((number) => (
                            <a key={number} href={`tel:${number.replace(/\s+/g, '')}`} className="block text-sm text-[#617289] dark:text-gray-400 hover:text-primary transition-colors">
                              {number}
                            </a>
                          ))}
                          {chairman.email && (
                            <a href={`mailto:${chairman.email}`} className="block text-sm text-[#617289] dark:text-gray-400 hover:text-primary transition-colors">
                              {chairman.email}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {secretary && (
                      <div className="flex items-center gap-3">
                        {secretary.image ? (
                          <img
              loading="lazy"
                            src={secretary.image}
                            alt={secretary.name}
                            className="size-12 rounded-full object-cover object-top border-2 border-primary/30 shrink-0"
                          />
                        ) : (
                          <div className="size-12 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
                            {secretary.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1">Secretary</div>
                          <div className="font-bold text-[#111418] dark:text-white">{secretary.name}</div>
                          {realPhones(secretary.phone).map((number) => (
                            <a key={number} href={`tel:${number.replace(/\s+/g, '')}`} className="block text-sm text-[#617289] dark:text-gray-400 hover:text-primary transition-colors">
                              {number}
                            </a>
                          ))}
                          {secretary.email && (
                            <a href={`mailto:${secretary.email}`} className="block text-sm text-[#617289] dark:text-gray-400 hover:text-primary transition-colors">
                              {secretary.email}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Partners & Affiliations - Carousel */}
      <motion.section
        id="partners"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-10 md:py-14 lg:py-16 px-4 md:px-6 bg-white dark:bg-[#14181c]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-8 md:mb-10">
            <div className="text-primary font-black uppercase tracking-widest text-xs md:text-sm mb-2 md:mb-3">
              Key Stakeholders &amp; Partners
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 dark:text-white">Partners &amp; Affiliations</h2>
            <p className="text-[#617289] dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
              From regulators and sister professional bodies to labour unions and government agencies, GPAA works hand-in-hand with these organizations to strengthen the Physician Assistant profession and improve healthcare delivery across Ghana.
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 md:mb-10">
            {(['All', ...PARTNER_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPartnersCategory(cat)}
                aria-pressed={partnersCategory === cat}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border-2 transition-all ${
                  partnersCategory === cat
                    ? 'bg-primary border-primary text-white'
                    : 'border-[#e5e7eb] dark:border-white/10 text-[#617289] dark:text-gray-400 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {filteredPartners.length === 0 ? (
            <p className="text-center text-[#617289] dark:text-gray-400 py-10">No partners found in this category yet.</p>
          ) : isPartnersExpanded ? (
            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredPartners.map((partner) => (
                <div key={partner.name} className="min-h-44 sm:min-h-48 md:min-h-52">
                  <PartnerCard partner={partner} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="relative">
              {/* Prev / Next controls */}
              <button
                type="button"
                onClick={() => scrollPartnersToPage(partnersActivePage - 1)}
                disabled={partnersActivePage === 0}
                aria-label="Previous partners"
                className="hidden sm:flex absolute -left-3 md:-left-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 items-center justify-center size-10 md:size-12 rounded-full bg-white dark:bg-[#0c0f12] border-2 border-[#e5e7eb] dark:border-white/10 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => scrollPartnersToPage(partnersActivePage + 1)}
                disabled={partnersActivePage >= partnersPageCount - 1}
                aria-label="Next partners"
                className="hidden sm:flex absolute -right-3 md:-right-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 items-center justify-center size-10 md:size-12 rounded-full bg-white dark:bg-[#0c0f12] border-2 border-[#e5e7eb] dark:border-white/10 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>

              <div
                ref={partnersTrackRef}
                onScroll={handlePartnersScroll}
                onMouseEnter={() => setIsPartnersPaused(true)}
                onMouseLeave={() => setIsPartnersPaused(false)}
                onTouchStart={() => setIsPartnersPaused(true)}
                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filteredPartners.map((partner) => (
                  <div
                    key={partner.name}
                    className="snap-start shrink-0 w-40 sm:w-44 md:w-48 lg:w-52 min-h-44 sm:min-h-48 md:min-h-52 lg:min-h-56"
                  >
                    <PartnerCard partner={partner} />
                  </div>
                ))}
              </div>

              {/* Page indicators */}
              {partnersPageCount > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: partnersPageCount }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollPartnersToPage(i)}
                      aria-label={`Go to partners page ${i + 1}`}
                      aria-current={i === partnersActivePage}
                      className={`h-2 rounded-full transition-all ${
                        i === partnersActivePage
                          ? 'w-6 bg-primary'
                          : 'w-2 bg-[#e5e7eb] dark:bg-white/20 hover:bg-primary/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="text-center mt-8 md:mt-10">
            <button
              type="button"
              onClick={() => setIsPartnersExpanded((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm md:text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              {isPartnersExpanded ? 'Show Less' : `View All ${filteredPartners.length} Partners`}
              <span className="material-symbols-outlined text-lg">
                {isPartnersExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
