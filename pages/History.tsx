
import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const History: React.FC = () => {
  usePageTitle('Our History', 'Explore the history of the Ghana Physician Assistants Association, from its founding to today\'s National Executive Council.');
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  const timeline = [
    {
      year: 'Pre-1996',
      title: 'Early Leadership',
      description: 'Mr. Divine Kudjinu and Mr. Agyemfra, President and General Secretary respectively, and others of blessed memory steered the affairs of the Association.'
    },
    {
      year: '1996',
      title: "Delegates' Conference at Koforidua",
      description: "Conference held at Eredec Hotel led to the election of: Mr. Agyemfra (President), Mr. Ralph Dagoe (Vice President), Mr. Tebbi (General Secretary), Mr. Dorho (General Vice Secretary), Mr. Isaac Lamptey (PRO - Late), Mr. Oppong (Financial Secretary), and Miss Korantema (Treasurer). Internal conflicts arose which affected the organization until 2005."
    },
    {
      year: '2005',
      title: 'Revolution and Renewal',
      description: "Delegates' Conference at Crystal Rose Hotel, Kumasi led to election of: Mr. Ralph Dagoe (President), Mr. Alfred Imoro Azumah (Vice President), Mr. Johnson Chiriga (General Secretary), Mr. Osman Abdullai Norgah (General Vice Secretary), Paulina Klutse (Treasurer - Late), Alhaji Musah (Financial Secretary - Late), and Mr. Johnson Asante (PRO)."
    },
    {
      year: '2007',
      title: 'Leadership Transition',
      description: 'At Radach Hotel, Tamale, Mr. Ralph Dagoe stepped down due to executive wrangling. Mr. Alfred Imoro Azumah was unanimously elected President and Mr. Isaac Lamptey became Vice President by acclamation.'
    },
    {
      year: '2008',
      title: 'Financial Challenges',
      description: 'The association could not hold an Annual General Conference due to financial constraints.'
    },
    {
      year: '2012',
      title: 'Constitutional Review Initiated',
      description: 'At AGC in Koforidua, Eastern Region, a review committee was formed (Johnson Chiriga, Osman A. Norgah, Ignatius Ayoonayele, Mantamia, and Isaac Lamptey as chairman) to address constitutional review reflecting current professional, social and economic development trends.'
    },
    {
      year: '2013',
      title: 'New Constitution Adopted',
      description: 'AGC at Ho WAEC Hall, Volta Region, adopted the present Constitution as the legal document of reference. National Treasurer Paulina Klutse passed on later in the year.'
    },
    {
      year: '2014',
      title: 'New Executive Council Elected',
      description: 'AGC at Bolgatanga, Upper East Region, elected: Chief Alhaji Imoro Bandana II (President), Alhaji Alhassan Zakaria (Vice President), Alhaji Osman A. Norgah (Gen. Secretary), Matthew A. Ayamba (Gen. Vice Sec.), Vida Vuoche (National Treasurer), Peter Mintir Amadu (Nat. Financial Sec.), and Philip Quarshie (Nat. PRO). The Association was unfortunately defrauded by a middleman contracted for accommodation.'
    },
    {
      year: '2016',
      title: 'Constitutional Amendments',
      description: 'At Wa, Upper West Region, portions of the constitution were amended to put age limits on officers vying for national positions.'
    },
    {
      year: '2018',
      title: 'Leadership Change at Tamale',
      description: 'At Aliu Mahama Sports Stadium, Tamale, elected: Emmanuel Yaw Appiah (President), Rebecca Dede Bantey (Vice President), Peter Eyram Kuenyefu (General Secretary), Abdul Ganiyu Kantamah (Vice Gen. Sec), Augustine Asford (Nat. Financial Sec), Balchisu Abukari (National Treasurer), and David Kojo Donkoh (National PRO).'
    },
    {
      year: '2019',
      title: '17th Annual General Conference',
      description: 'First AGC organized by newly elected National Executives held at Takoradi, Western Region.'
    },
    {
      year: '2020',
      title: 'TUC Certification & COVID-19',
      description: 'AGC planned for Cape Coast cancelled due to COVID-19 pandemic. The Association became a Union under the Trade Union Congress (TUC) upon certification by the Chief Labour Officer.'
    },
    {
      year: '2021',
      title: '18th AGC at Cape Coast',
      description: 'Annual General Conference held in October at Cape Coast, Central Region.'
    },
    {
      year: 'September 2022',
      title: 'Collective Bargaining Certificate',
      description: 'Union issued Collective Bargaining Certificate by the Chief Labour Officer of the Labour Department.'
    },
    {
      year: 'October 2022',
      title: 'Current Leadership Elected',
      description: '19th AGC at KNUST, Kumasi. Current officers elected amidst last-minute injunction: Peter Akudugu Ayamba (President), Emmanuel Kofi Nti Brantuo (Vice President), Peter Eyram Kuenyefu (General Secretary), Edward Etse Aloryito (Vice General Secretary), Aminu Ali Mohammed (PRO), John Mbeibo Lalibe (Financial Treasurer), and Hajia Balchisu Abukari (Treasurer).'
    },
    {
      year: '2023',
      title: '20th Annual General Conference',
      description: 'First AGC organized by newly elected Union officers held at BACA Hotel, Koforidua, Eastern Region.'
    },
    {
      year: 'August 2, 2024',
      title: 'Historic Collective Agreement',
      description: 'Union finalized signing of its maiden Collective Agreement with the Government on Conditions of Service solely for the Physician Assistant fraternity.'
    },
    {
      year: '2024',
      title: '21st AGC in Volta Region',
      description: 'Annual General Conference held at Volta Serene Hotel and Ho Technical University in the Volta Region.'
    },
    {
      year: 'August 2, 2025',
      title: 'Landmark Collective Agreement',
      description: 'Signed maiden negotiated Collective Agreement with Government of Ghana represented by Fair Wages and Salaries Commission (FWSC), Ghana Health Service (GHS), Christian Health Association of Ghana (CHAG) and Ministry of Health.'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-100 flex items-center overflow-hidden bg-primary"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-40 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-40 border-white rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-white text-5xl md:text-7xl font-black mb-6 leading-tight">
              Our Historical Journey
            </h1>
            <p className="text-white/90 text-xl md:text-2xl leading-relaxed">
              Four decades of dedication, resilience, and professional excellence in advancing healthcare delivery across Ghana.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Introduction */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-background-light dark:bg-[#0c0f12] p-12 rounded-3xl border border-[#e5e7eb] dark:border-white/10"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-6 dark:text-white">A Legacy of Service and Unity</h2>
          <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed mb-6">
            The Ghana Physician Assistants Association, formerly known as the Ghana Medical Assistants Association, has been in existence for over four (4) decades and has had many leaders who have dedicated themselves to advancing the profession.
          </p>
          <p className="text-[#617289] dark:text-gray-400 text-xl leading-relaxed">
            From our humble beginnings to becoming a certified Union under the Trade Union Congress, our journey reflects the resilience, dedication, and continuous growth of the Physician Assistant profession in Ghana.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 px-6 bg-background-light dark:bg-[#0c0f12]"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Complete Historical Timeline</h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
          </motion.div>
          
          <div className="space-y-12 relative before:absolute before:left-4.75 before:top-4 before:bottom-4 before:w-1 before:bg-primary/20">
            {timeline.map((event, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="flex gap-8 items-start group"
              >
                <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm relative z-10 shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  {idx + 1}
                </div>
                <div className="bg-white dark:bg-[#14181c] p-8 rounded-2xl border border-[#e5e7eb] dark:border-white/10 w-full group-hover:shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <h4 className="text-2xl font-black text-primary">{event.year}</h4>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white">{event.title}</h3>
                  </div>
                  <p className="text-[#617289] dark:text-gray-400 text-lg leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Current Leadership Highlight */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-6">Leading into the Future</h2>
          <p className="text-white/90 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Today, under the current National Executive Council, GPAA continues to champion professional excellence, advocate for improved working conditions, and strengthen the Physician Assistant profession across Ghana.
          </p>
          <Link
            to="/about#leadership"
            className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-xl font-black text-lg hover:bg-slate-100 transition-all"
          >
            Meet Our Leaders
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default History;
