import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Careers: React.FC = () => {
  usePageTitle('Careers', 'Current job openings and internship opportunities at the Ghana Physician Assistants Association.');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  const openPositions = [
    {
      title: 'CPD Program Coordinator',
      type: 'Full-time',
      location: 'Accra',
      department: 'Professional Development',
      description: 'Lead the planning, coordination, and execution of Continuing Professional Development programs for GPAA members nationwide.',
      responsibilities: [
        'Design and implement CPD programs and training workshops',
        'Coordinate with facilitators and training partners',
        'Manage program budgets and logistics',
        'Track member participation and CPD hours',
        'Evaluate program effectiveness and impact'
      ],
      requirements: [
        'PA qualification with 5+ years clinical experience',
        'Previous program management or coordination experience',
        'Strong organizational and communication skills',
        'Proficiency in MS Office and learning management systems',
        'MPH or relevant postgraduate qualification preferred'
      ],
      benefits: ['Competitive salary', 'Health insurance', 'CPD opportunities', 'Flexible work arrangements']
    },
    {
      title: 'Advocacy & Policy Officer',
      type: 'Full-time',
      location: 'Accra',
      department: 'Advocacy',
      description: 'Support legislative advocacy efforts, policy research, and stakeholder engagement to advance PA practice in Ghana.',
      responsibilities: [
        'Conduct policy research and analysis',
        'Draft policy briefs and position papers',
        'Engage with government agencies and stakeholders',
        'Monitor healthcare legislation and regulations',
        'Coordinate advocacy campaigns and initiatives'
      ],
      requirements: [
        'Degree in Public Health, Law, Political Science, or related field',
        'Understanding of Ghana\'s healthcare system and policy landscape',
        'Excellent research and writing skills',
        'Strong analytical and critical thinking abilities',
        '3+ years experience in advocacy or policy work'
      ],
      benefits: ['Professional development', 'Travel opportunities', 'Networking events', 'Performance bonuses']
    },
    {
      title: 'Communications & Digital Media Specialist',
      type: 'Full-time',
      location: 'Accra (Hybrid)',
      department: 'Communications',
      description: 'Manage GPAA\'s digital presence, create engaging content, and coordinate internal and external communications.',
      responsibilities: [
        'Develop and execute digital marketing strategies',
        'Create content for website, social media, and newsletters',
        'Manage social media platforms and engagement',
        'Design graphics and promotional materials',
        'Track analytics and optimize digital campaigns'
      ],
      requirements: [
        'Degree in Communications, Marketing, or related field',
        'Proven experience in digital marketing and content creation',
        'Proficiency in Adobe Creative Suite and social media tools',
        'Strong writing and visual communication skills',
        'Knowledge of SEO and analytics tools'
      ],
      benefits: ['Flexible hours', 'Remote work options', 'Creative freedom', 'Latest tech tools']
    },
    {
      title: 'Administrative Assistant',
      type: 'Full-time',
      location: 'Accra',
      department: 'Administration',
      description: 'Provide administrative support to GPAA leadership and ensure smooth daily operations of the secretariat.',
      responsibilities: [
        'Handle correspondence and communications',
        'Schedule meetings and maintain calendars',
        'Prepare documents and reports',
        'Manage office supplies and facilities',
        'Assist with event planning and coordination'
      ],
      requirements: [
        'Diploma or degree in Business Administration or related field',
        'Strong organizational and time management skills',
        'Proficiency in MS Office (Word, Excel, PowerPoint)',
        'Excellent interpersonal and communication skills',
        'Previous administrative experience preferred'
      ],
      benefits: ['On-the-job training', 'Career progression', 'Supportive team', 'Central location']
    },
    {
      title: 'Internship Program',
      type: 'Internship',
      location: 'Accra / Regional',
      department: 'Various Departments',
      description: 'Join our internship program to gain hands-on experience in healthcare administration, advocacy, and professional development.',
      responsibilities: [
        'Support departmental activities and projects',
        'Assist with research and data collection',
        'Participate in events and programs',
        'Learn from experienced professionals',
        'Complete assigned learning objectives'
      ],
      requirements: [
        'Current student or recent graduate in relevant field',
        'Strong interest in healthcare and professional development',
        'Good communication and teamwork skills',
        'Willingness to learn and take initiative',
        'Available for 3-6 months commitment'
      ],
      benefits: ['Mentorship', 'Certificate of completion', 'Networking', 'Possible full-time conversion']
    }
  ];

  const benefits = [
    { icon: 'payments', title: 'Competitive Pay', desc: 'Market-rate salaries with performance incentives' },
    { icon: 'health_and_safety', title: 'Health Insurance', desc: 'Comprehensive health coverage for you and family' },
    { icon: 'school', title: 'Professional Growth', desc: 'CPD opportunities and career development support' },
    { icon: 'schedule', title: 'Work-Life Balance', desc: 'Flexible arrangements and generous leave policy' },
    { icon: 'diversity_3', title: 'Inclusive Culture', desc: 'Diverse, supportive, and collaborative environment' },
    { icon: 'workspace_premium', title: 'Impact Work', desc: 'Contribute to meaningful healthcare improvements' }
  ];

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-primary to-primary-dark py-24 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/get-involved" className="hover:text-white">Get Involved</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-white">Careers</span>
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-white mb-8"
          >
            Careers & Internships
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Join our team and contribute to advancing the Physician Assistant profession in Ghana
          </motion.p>
        </div>
      </motion.section>

      {/* Why Work With Us */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Why Join GPAA?</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl max-w-3xl mx-auto">
            We offer more than just a job - we provide a platform to make a real difference in healthcare
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-background-light dark:bg-[#0c0f12] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 hover:shadow-xl transition-all"
            >
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
              </div>
              <h3 className="text-2xl font-black mb-3 dark:text-white">{benefit.title}</h3>
              <p className="text-[#617289] dark:text-gray-400">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Open Positions */}
      <section className="py-24 bg-background-light dark:bg-[#0c0f12] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Open Positions</h2>
            <p className="text-[#617289] dark:text-gray-400 text-xl">Explore current opportunities and find your perfect role</p>
          </div>

          <div className="space-y-6">
            {openPositions.map((job, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#14181c] rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 overflow-hidden hover:border-primary transition-all"
              >
                <button
                  onClick={() => setSelectedJob(selectedJob === idx ? null : idx)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-background-light dark:hover:bg-white/5 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl md:text-3xl font-black text-[#111418] dark:text-white">{job.title}</h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#617289] dark:text-gray-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">business_center</span>
                        {job.department}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedJob === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 ml-4"
                  >
                    <span className="material-symbols-outlined text-4xl text-primary">expand_more</span>
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: selectedJob === idx ? 'auto' : 0,
                    opacity: selectedJob === idx ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-t-2 border-[#e5e7eb] dark:border-white/10 space-y-6">
                    <div>
                      <h4 className="font-black text-lg mb-3 dark:text-white">About the Role</h4>
                      <p className="text-[#617289] dark:text-gray-400 leading-relaxed">{job.description}</p>
                    </div>

                    <div>
                      <h4 className="font-black text-lg mb-3 dark:text-white">Key Responsibilities</h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#617289] dark:text-gray-400">
                            <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-black text-lg mb-3 dark:text-white">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#617289] dark:text-gray-400">
                            <span className="material-symbols-outlined text-primary text-sm mt-1">verified</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-black text-lg mb-3 dark:text-white">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, i) => (
                          <span key={i} className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold text-sm">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <a
                        href={`mailto:gpaanational@gmail.com?subject=Application for ${job.title}`}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-black hover:bg-primary-dark transition-all shadow-lg"
                      >
                        Apply Now
                      </a>
                      <button className="bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-xl font-black hover:bg-primary/5 transition-all">
                        Share Position
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-linear-to-br from-primary to-primary-dark px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Don't See the Right Role?</h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Send us your CV and we'll keep you in mind for future opportunities
          </p>
          <a
            href="mailto:gpaanational@gmail.com?subject=General Application - GPAA"
            className="inline-block bg-white text-primary px-10 py-5 rounded-xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl"
          >
            Submit General Application
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;
