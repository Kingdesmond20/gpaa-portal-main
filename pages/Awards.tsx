import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCampaigns } from '../lib/votingApi';
import { Float, LiveDot, riseIn, staggerParent } from '../components/awards/motion';

/** GPAA Prestigious Awards: campaign list. Data comes from Supabase (see lib/votingApi.ts). */
const Awards: React.FC = () => {
  usePageTitle('GPAA Prestigious Awards', 'Vote for your favourite nominees in the GPAA Prestigious Awards.');
  const { data: campaigns, isLoading, error } = useQuery({ queryKey: ['awards-campaigns'], queryFn: fetchCampaigns });

  return (
    <div className="bg-white dark:bg-[#14181c]">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-linear-to-br from-primary via-primary-dark to-ghana-green py-20"
      >
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Float distance={8} className="mb-3 inline-block">
            <span className="material-symbols-outlined text-6xl text-ghana-gold" aria-hidden="true">
              emoji_events
            </span>
          </Float>
          <h1 className="text-4xl font-black text-white md:text-5xl">GPAA Prestigious Awards</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Celebrating excellence in the Physician Assistant profession. Cast your vote for the nominees who inspire you most.
          </p>
        </div>
      </motion.section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        {isLoading ? <p className="text-center text-[#617289] dark:text-gray-400">Loading campaigns…</p> : null}
        {error ? (
          <p className="text-center text-red-600 dark:text-red-400">Could not load the awards right now. Please try again shortly.</p>
        ) : null}
        {!isLoading && campaigns && campaigns.length === 0 ? (
          <p className="text-center text-[#617289] dark:text-gray-400">No awards campaigns are open right now. Check back soon.</p>
        ) : null}

        <motion.div variants={staggerParent} initial="hidden" animate="visible" className="grid gap-6 sm:grid-cols-2">
          {campaigns?.map((campaign) => (
            <motion.div key={campaign.id} variants={riseIn} whileHover={{ y: -6 }} className="h-full">
              <Link
                to={`/awards/${campaign.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border-2 border-[#e5e7eb] transition-colors hover:border-primary hover:shadow-xl dark:border-white/10"
              >
                {campaign.coverImageUrl ? (
                  <div className="aspect-[16/9] overflow-hidden bg-[#f1f0ee] dark:bg-white/5">
                    <img
                      src={campaign.coverImageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-black text-[#111418] dark:text-white">{campaign.name}</h2>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                        campaign.votingOpen ? 'bg-green/10 text-green' : 'bg-[#e5e7eb] text-[#617289] dark:bg-white/10 dark:text-gray-400'
                      }`}
                    >
                      {campaign.votingOpen ? <LiveDot /> : null}
                      {campaign.votingOpen ? 'Voting open' : 'Voting closed'}
                    </span>
                  </div>
                  {campaign.description ? <p className="mt-2 text-sm text-[#617289] dark:text-gray-400">{campaign.description}</p> : null}
                  <span className="mt-4 inline-block text-sm font-black text-primary">View categories →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Awards;
