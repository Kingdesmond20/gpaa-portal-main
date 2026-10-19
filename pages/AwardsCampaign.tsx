import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { ApiError, fetchCampaign, fetchCategories, fetchContestantByCode } from '../lib/votingApi';
import { Countdown, Float, LiveDot, TiltCard, riseIn, staggerParent } from '../components/awards/motion';
import HowToVote from '../components/awards/HowToVote';

const AwardsCampaign: React.FC = () => {
  const { campaignSlug = '' } = useParams<{ campaignSlug: string }>();
  const navigate = useNavigate();
  const campaign = useQuery({ queryKey: ['awards-campaign', campaignSlug], queryFn: () => fetchCampaign(campaignSlug) });
  const categories = useQuery({ queryKey: ['awards-categories', campaignSlug], queryFn: () => fetchCategories(campaignSlug) });
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [looking, setLooking] = useState(false);

  usePageTitle(campaign.data?.name ?? 'GPAA Prestigious Awards', campaign.data?.description ?? undefined);

  if (campaign.error instanceof ApiError && campaign.error.status === 404) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">Campaign not found</h1>
        <Link to="/awards" className="mt-4 inline-block font-bold text-primary">
          ← Back to all awards
        </Link>
      </div>
    );
  }

  const handleFind = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    setLooking(true);
    setCodeError('');
    try {
      const nominee = await fetchContestantByCode(campaignSlug, code);
      navigate(`/awards/${campaignSlug}/contestants/${nominee.slug}`);
    } catch (err) {
      setCodeError(err instanceof ApiError ? err.message : 'Could not look that up. Please try again.');
    } finally {
      setLooking(false);
    }
  };

  const c = campaign.data;

  return (
    <div className="bg-white dark:bg-[#14181c]">
      {campaign.isLoading ? <p className="mx-auto max-w-5xl px-6 py-20 text-[#617289] dark:text-gray-400">Loading…</p> : null}

      {c ? (
        <>
          <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary-dark to-ghana-green">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 md:grid-cols-[1.3fr_1fr]">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Link to="/awards" className="text-sm font-bold text-white/80 hover:text-white">
                  ← All awards
                </Link>
                <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">{c.name}</h1>
                {c.description ? <p className="mt-3 max-w-xl text-white/90">{c.description}</p> : null}

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-black ${
                      c.votingOpen ? 'bg-white text-green' : 'bg-white/20 text-white'
                    }`}
                  >
                    {c.votingOpen ? <LiveDot /> : null}
                    {c.votingOpen ? 'Voting open' : 'Voting closed'}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 font-bold text-white">GHS {c.voteUnitPrice.toFixed(2)} per vote</span>
                </div>

                {c.votingOpen && c.endsAt ? (
                  <div className="mt-6">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/80">Voting closes in</p>
                    <Countdown endsAt={c.endsAt} />
                  </div>
                ) : null}

                <form onSubmit={handleFind} className="mt-8 max-w-md">
                  <label htmlFor="nominee-code" className="mb-2 block text-sm font-bold text-white">
                    Have a nominee code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="nominee-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. PA-01"
                      maxLength={12}
                      autoComplete="off"
                      className="min-w-0 flex-1 rounded-xl border-2 border-transparent bg-white px-4 py-3 font-black uppercase tracking-widest text-[#111418] outline-none focus:border-ghana-gold"
                    />
                    <button
                      type="submit"
                      disabled={looking || !code.trim()}
                      className="rounded-xl bg-ghana-gold px-5 py-3 font-black text-[#111418] transition-transform hover:scale-105 disabled:opacity-60"
                    >
                      {looking ? '…' : 'Find'}
                    </button>
                  </div>
                  {codeError ? (
                    <p role="alert" className="mt-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-bold text-red-700">
                      {codeError}
                    </p>
                  ) : null}
                </form>
              </motion.div>

              {c.coverImageUrl ? (
                <motion.div initial={{ opacity: 0, scale: 0.92, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Float distance={8} duration={4}>
                    <TiltCard className="mx-auto max-w-xs">
                      <img
                        src={c.coverImageUrl}
                        alt={`${c.name} poster`}
                        className="w-full rounded-2xl border-4 border-white/70 object-cover shadow-2xl"
                      />
                    </TiltCard>
                  </Float>
                </motion.div>
              ) : (
                <Float className="mx-auto">
                  <span className="material-symbols-outlined text-[9rem] text-ghana-gold" aria-hidden="true">
                    emoji_events
                  </span>
                </Float>
              )}
            </div>
          </section>

          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="mb-4 text-xl font-black text-[#111418] dark:text-white">Categories</h2>
            {categories.isLoading ? <p className="text-[#617289] dark:text-gray-400">Loading categories…</p> : null}
            {categories.data && categories.data.length === 0 ? (
              <p className="text-[#617289] dark:text-gray-400">No categories are open yet.</p>
            ) : null}

            <motion.ul variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-5 sm:grid-cols-2">
              {categories.data?.map((category) => (
                <motion.li key={category.id} variants={riseIn}>
                  <TiltCard strength={5}>
                    <Link
                      to={`/awards/${c.slug}/categories/${category.slug}`}
                      className="group block overflow-hidden rounded-2xl border-2 border-[#e5e7eb] bg-white transition-colors hover:border-primary hover:shadow-xl dark:border-white/10 dark:bg-[#0c0f12]"
                    >
                      {category.imageUrl ? (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={category.imageUrl}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ) : null}
                      <div className="p-4">
                        <p className="font-black text-[#111418] dark:text-white">{category.name}</p>
                        {category.description ? <p className="mt-1 text-sm text-[#617289] dark:text-gray-400">{category.description}</p> : null}
                        <span className="mt-2 inline-block text-sm font-black text-primary transition-transform group-hover:translate-x-1">
                          See nominees →
                        </span>
                      </div>
                    </Link>
                  </TiltCard>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-14">
              <HowToVote />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AwardsCampaign;
