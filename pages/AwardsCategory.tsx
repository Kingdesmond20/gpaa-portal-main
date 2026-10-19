import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { ApiError, fetchCampaign, fetchCategory, fetchCategoryContestants, fetchResults } from '../lib/votingApi';
import { AnimatedBar, CountUp, LiveDot, TiltCard, riseIn, staggerParent } from '../components/awards/motion';

const MEDALS = ['bg-[#f5c518] text-[#111418]', 'bg-[#c0c7d1] text-[#111418]', 'bg-[#cd7f32] text-white'];

const AwardsCategory: React.FC = () => {
  const { campaignSlug = '', categorySlug = '' } = useParams<{ campaignSlug: string; categorySlug: string }>();
  const category = useQuery({
    queryKey: ['awards-category', campaignSlug, categorySlug],
    queryFn: () => fetchCategory(campaignSlug, categorySlug),
  });
  const contestants = useQuery({
    queryKey: ['awards-contestants', campaignSlug, categorySlug],
    queryFn: () => fetchCategoryContestants(campaignSlug, categorySlug),
  });
  const campaign = useQuery({ queryKey: ['awards-campaign', campaignSlug], queryFn: () => fetchCampaign(campaignSlug) });
  const campaignId = campaign.data?.id;
  // Vote counts are only returned by the database when the campaign has
  // "show results" on, so only ask when it says so.
  const results = useQuery({
    queryKey: ['awards-results', campaignId],
    queryFn: () => fetchResults(campaignId as string),
    enabled: Boolean(campaignId && campaign.data?.showResults),
    refetchInterval: 15000,
  });

  const votesFor = (contestantId: string): number => {
    if (!results.data || !category.data) return 0;
    return results.data.find((r) => r.contestantId === contestantId && r.categoryId === category.data!.id)?.votes ?? 0;
  };
  const showRanking = Boolean(results.data);
  const ranked = contestants.data
    ? showRanking
      ? [...contestants.data].sort((a, b) => votesFor(b.id) - votesFor(a.id) || a.fullName.localeCompare(b.fullName))
      : contestants.data
    : undefined;
  const totalVotes = ranked ? ranked.reduce((sum, c) => sum + votesFor(c.id), 0) : 0;

  usePageTitle(category.data?.name ?? 'Category', category.data?.description ?? undefined);

  if (category.error instanceof ApiError && category.error.status === 404) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">Category not found</h1>
        <Link to={`/awards/${campaignSlug}`} className="mt-4 inline-block font-bold text-primary">
          ← Back to the campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#14181c]">
      <section className="relative overflow-hidden bg-linear-to-br from-primary-dark to-ghana-green">
        {category.data?.imageUrl ? (
          <img src={category.data.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" aria-hidden="true" />
        ) : null}
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
          <Link to={`/awards/${campaignSlug}`} className="text-sm font-bold text-white/80 hover:text-white">
            ← All categories
          </Link>
          {category.isLoading ? <p className="mt-4 text-white/80">Loading category…</p> : null}
          {category.data ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">{category.data.name}</h1>
              {category.data.description ? <p className="mt-2 max-w-2xl text-white/90">{category.data.description}</p> : null}
              {showRanking ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white">
                  <LiveDot className="bg-ghana-gold" /> Live results · <CountUp value={totalVotes} /> votes in this category
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {contestants.isLoading ? <p className="text-[#617289] dark:text-gray-400">Loading nominees…</p> : null}
        {contestants.error ? (
          <p className="text-red-600 dark:text-red-400">The nominees for this category could not be loaded. Please try again shortly.</p>
        ) : null}
        {contestants.data && contestants.data.length === 0 ? (
          <p className="text-[#617289] dark:text-gray-400">No nominees are listed in this category yet.</p>
        ) : null}

        <motion.ul layout variants={staggerParent} initial="hidden" animate="visible" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ranked?.map((contestant, index) => {
            const votes = votesFor(contestant.id);
            const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            return (
              <motion.li key={contestant.id} layout variants={riseIn}>
                <TiltCard strength={6} className="h-full">
                  <Link
                    to={`/awards/${campaignSlug}/contestants/${contestant.slug}${category.data ? `?categoryId=${category.data.id}` : ''}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#e5e7eb] bg-white transition-colors hover:border-primary hover:shadow-xl dark:border-white/10 dark:bg-[#0c0f12]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f1f0ee] dark:bg-white/5">
                      {contestant.photoUrl ? (
                        <img
                          src={contestant.photoUrl}
                          alt={`Photo of ${contestant.fullName}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : null}
                      {showRanking ? (
                        <span
                          className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black shadow-lg ${
                            MEDALS[index] ?? 'bg-white text-[#111418]'
                          }`}
                          aria-label={`Rank ${index + 1}`}
                        >
                          {index + 1}
                        </span>
                      ) : null}
                      {contestant.code ? (
                        <span className="absolute right-3 top-3 rounded-full bg-[#111418]/80 px-3 py-1 text-xs font-black tracking-widest text-ghana-gold backdrop-blur">
                          {contestant.code}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="text-lg font-black text-[#111418] dark:text-white">{contestant.fullName}</p>
                      {contestant.bio ? <p className="line-clamp-2 text-sm text-[#617289] dark:text-gray-400">{contestant.bio}</p> : null}
                      {showRanking ? (
                        <div className="mt-1">
                          <div className="mb-1 flex items-baseline justify-between text-sm">
                            <span className="font-black text-[#111418] dark:text-white">
                              <CountUp value={votes} /> votes
                            </span>
                            <span className="font-bold text-[#617289] dark:text-gray-400">{percent}%</span>
                          </div>
                          <AnimatedBar percent={percent} />
                        </div>
                      ) : null}
                      <span className="mt-auto pt-2 text-sm font-black text-primary transition-transform group-hover:translate-x-1">Vote →</span>
                    </div>
                  </Link>
                </TiltCard>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
};

export default AwardsCategory;
