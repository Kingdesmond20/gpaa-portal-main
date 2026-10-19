
import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PILLARS, NEWS, TRUST_SIGNALS } from '../constants';
import NewsArticleLink, { isExternalLink } from '../components/NewsArticleLink';

const HERO_SLIDES = [
  {
    title: "Who Are Physician Assistants?",
    description: "Trained healthcare professionals providing comprehensive primary healthcare services across Ghana. We diagnose, treat, and prevent diseases in hospitals, clinics, and community health centers—bridging the gap between doctors and nurses to deliver quality care to all Ghanaians.",
    image: "/images/hero/hero-conference-group.jpg",
    primaryCTA: { text: "Join GPAA Today", link: "/membership/join" },
    secondaryCTA: { text: "Learn More About PAs", link: "/about" }
  },
  {
    title: "Empowering Physician Assistants, Advancing Healthcare for Ghana",
    description: "The official professional association for Physician Assistants in Ghana. Dedicated to advancing clinical excellence, professional development, and quality healthcare delivery nationwide since 1980.",
    image: '/images/22nd-conference/PSX_20251025_112435.jpg',
    primaryCTA: { text: "Become a Member", link: "/membership/join" },
    secondaryCTA: { text: "Member Login", link: "/login" }
  },
  {
    title: "Why Are PAs Important?",
    description: "Serving as the backbone of Ghana's primary healthcare system, Physician Assistants deliver essential medical services in underserved areas, reduce patient wait times, and extend healthcare access to every corner of our nation. We are passionate advocates for community health and wellness.",
    image: '/images/21st-conference/21st Annual Confrence GPAA-138.jpg',
    primaryCTA: { text: "View Upcoming Events", link: "/events" },
    secondaryCTA: { text: "Contact Us", link: "/contact" }
  }
];

const Home: React.FC = () => {
  usePageTitle();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isHovering, setIsHovering] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Preload images
  useEffect(() => {
    HERO_SLIDES.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-advance carousel (pauses on hover)
  useEffect(() => {
    if (isHovering) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovering]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div>
      {/* Hero Section Carousel */}
      <section className="relative bg-white">
        <div 
          className="relative overflow-hidden bg-linear-to-br from-slate-900 via-primary-dark to-primary min-h-[calc(100vh-80px)]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    nextSlide();
                  } else if (swipe > swipeConfidenceThreshold) {
                    prevSlide();
                  }
                }}
                className="absolute inset-0 flex flex-col justify-end p-6 pb-16 md:p-12 md:pb-20 lg:p-20 lg:pb-24 cursor-grab active:cursor-grabbing"
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center opacity-70 mix-blend-overlay" 
                  style={{ backgroundImage: `url('${HERO_SLIDES[currentSlide].image}')` }}
                ></div>
                <div className="absolute inset-0 z-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="relative z-10 max-w-4xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6 md:mb-8 drop-shadow-lg"
                  >
                    {HERO_SLIDES[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                    className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-6 md:mb-10 max-w-2xl leading-relaxed drop-shadow"
                  >
                    {HERO_SLIDES[currentSlide].description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-wrap gap-3 md:gap-5"
                  >
                    <Link
                      to={HERO_SLIDES[currentSlide].primaryCTA.link}
                      className="px-6 py-3 md:px-10 md:py-5 bg-primary text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/25"
                    >
                      {HERO_SLIDES[currentSlide].primaryCTA.text}
                    </Link>
                    <Link 
                      to={HERO_SLIDES[currentSlide].secondaryCTA.link} 
                      className="px-6 py-3 md:px-10 md:py-5 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:bg-white/20 transition-all text-center"
                    >
                      {HERO_SLIDES[currentSlide].secondaryCTA.text}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Hidden on mobile/tablet */}
            <button
              onClick={prevSlide}
              className="hidden lg:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all group items-center justify-center"
              aria-label="Previous slide"
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl group-hover:scale-110 transition-transform">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              className="hidden lg:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all group items-center justify-center"
              aria-label="Next slide"
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl group-hover:scale-110 transition-transform">chevron_right</span>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-12' 
                      : 'bg-white/40 w-3 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
        </div>
      </section>

      {/* About Section Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-20 md:py-32 bg-white dark:bg-[#14181c] px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeInUp} className="relative">
            <div className="rounded-3xl overflow-hidden aspect-video lg:aspect-square shadow-2xl ring-8 ring-background-light/50">
              <img
              loading="lazy" 
                src="/images/about/about-overview.jpg"
                alt="Ghanaian clinical staff"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-primary text-white p-10 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform hidden md:block border-4 border-white">
              <p className="text-3xl md:text-4xl lg:text-5xl font-black mb-1">50+</p>
              <p className="text-sm font-bold uppercase tracking-widest opacity-90">Years of Excellence</p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit">
              <span className="material-symbols-outlined text-sm">medical_services</span>
              <span className="font-bold tracking-widest uppercase text-xs">About GPAA</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-[#111418] dark:text-white leading-tight">
              Advancing the Profession with Integrity and Care
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed">
              The Ghana Physician Assistants Association (GPAA) is the sole professional body representing the interests of all Physician Assistants in Ghana. We ensure excellence in clinical practice, healthcare delivery, and professional ethics across all regions.
            </motion.p>
            <motion.ul variants={stagger} className="space-y-5">
              {[
                'Registered Professional Association under the Laws of Ghana',
                'Advocating for better working conditions and career paths',
                'Promoting continuous learning and medical research'
              ].map((text, i) => (
                <motion.li key={i} variants={fadeInUp} className="flex items-start gap-4 group">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-full text-xl group-hover:scale-110 transition-transform">check_circle</span>
                  <span className="text-[#111418] dark:text-white font-bold text-lg mt-1">{text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.section>

      {/* Pillars Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 bg-[#f8f9fb] dark:bg-[#0c0f12] px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111418] dark:text-white mb-6">Our Core Strategic Pillars</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">
              We work tirelessly to support our members through three main channels of engagement and service.
            </p>
          </motion.div>
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {PILLARS.map((pillar) => (
              <motion.div key={pillar.title} variants={fadeInUp} className="bg-white dark:bg-[#14181c] p-10 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">{pillar.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#111418] dark:text-white">{pillar.title}</h3>
                <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Signals Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-16 bg-white dark:bg-[#14181c] px-6 border-y-2 border-ghana-gold"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {TRUST_SIGNALS.map((signal, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="size-16 rounded-full bg-ghana-green/10 flex items-center justify-center text-ghana-green">
                    <span className="material-symbols-outlined text-3xl">{signal.icon}</span>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black text-primary mb-2">{signal.stat}</div>
                <div className="text-sm font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wide">{signal.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Updates Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 bg-white dark:bg-[#14181c] px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-[#111418] dark:text-white mb-3">Latest Updates</h2>
              <p className="text-[#617289] dark:text-gray-400 text-lg">Stay informed about policy changes, association news, and medical updates across the country.</p>
            </div>
            <Link to="/news" className="flex items-center gap-3 text-primary-light font-bold text-lg hover:text-primary-dark transition-all group shrink-0">
              View All News
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {NEWS.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <NewsArticleLink href={item.link} className="group block">
                  <div className="rounded-2xl overflow-hidden mb-6 aspect-16/10 shadow-lg">
                    <img
              loading="lazy" 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase bg-primary/5 px-3 py-1 rounded-md">{item.category}</span>
                    {item.source && <span className="text-[#617289] dark:text-gray-400 text-xs font-bold">{item.source}</span>}
                    {isExternalLink(item.link) && (
                      <span className="material-symbols-outlined text-sm text-[#617289] dark:text-gray-400" aria-label="Opens in a new tab">open_in_new</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold mt-4 text-[#111418] dark:text-white group-hover:text-primary transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#617289] dark:text-gray-400 text-lg mt-4 line-clamp-2 leading-relaxed">{item.description}</p>
                </NewsArticleLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto bg-primary rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-2/5 h-full opacity-10 pointer-events-none translate-x-1/4">
            <svg fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="20"></circle>
              <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="20"></circle>
              <circle cx="200" cy="200" r="60" stroke="white" strokeWidth="20"></circle>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-white text-4xl md:text-6xl font-black mb-6 leading-tight">Strengthen Our Voice</h2>
              <p className="text-white/80 text-xl md:text-2xl leading-relaxed">
                Your membership powers our advocacy. Join the association today or contribute to our development fund to advance healthcare in Ghana.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 shrink-0 w-full lg:w-auto">
              <Link to="/membership/join" className="w-full sm:w-auto">
                <button className="bg-white cursor-pointer text-primary px-10 py-5 rounded-xl font-black text-xl hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto">
                  Become a Member
                </button>
              </Link>
              <Link to="/donate" className="w-full sm:w-auto">
                <button className="bg-primary-dark/30 cursor-pointer backdrop-blur-md border-2 border-white/40 text-white px-10 py-5 rounded-xl font-black text-xl hover:bg-white/10 transition-all w-full sm:w-auto">
                  Support Our Mission
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
