import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  ApiError,
  fetchCampaign,
  fetchContestant,
  createVoteIntent,
  initializePayment,
  type CreateVoteIntentResponse,
  type InitializePaymentResponse,
  type PublicCampaign,
  type PublicContestant,
} from '../lib/votingApi';
import { formatCedis, maxVotesPerTransaction, previewTotal } from '../lib/voteMoney';
import { motion } from 'framer-motion';
import { Float } from '../components/awards/motion';

const AwardsContestant: React.FC = () => {
  const { campaignSlug = '', contestantSlug = '' } = useParams<{ campaignSlug: string; contestantSlug: string }>();
  const [searchParams] = useSearchParams();
  const preselectedCategoryId = searchParams.get('categoryId') ?? undefined;

  const campaign = useQuery({ queryKey: ['awards-campaign', campaignSlug], queryFn: () => fetchCampaign(campaignSlug) });
  const contestant = useQuery({
    queryKey: ['awards-contestant', campaignSlug, contestantSlug],
    queryFn: () => fetchContestant(campaignSlug, contestantSlug),
  });

  usePageTitle(contestant.data ? `Vote for ${contestant.data.fullName}` : 'Nominee', contestant.data?.bio ?? undefined);

  const notFound =
    (contestant.error instanceof ApiError && contestant.error.status === 404) ||
    (campaign.error instanceof ApiError && campaign.error.status === 404);
  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">Nominee not found</h1>
        <Link to={`/awards/${campaignSlug}`} className="mt-4 inline-block font-bold text-primary">
          ← Back to the campaign
        </Link>
      </div>
    );
  }

  if (campaign.isLoading || contestant.isLoading) {
    return <p className="max-w-5xl mx-auto px-6 py-20 text-center text-[#617289] dark:text-gray-400">Loading…</p>;
  }

  if (!campaign.data || !contestant.data) {
    return (
      <p className="max-w-5xl mx-auto px-6 py-20 text-center text-red-600 dark:text-red-400">
        This nominee could not be loaded. Please try again shortly.
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-[#14181c] max-w-5xl mx-auto px-6 py-14">
      <Link to={`/awards/${campaignSlug}`} className="text-sm font-bold text-primary">
        ← {campaign.data.name}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="relative mb-4 rounded-3xl bg-linear-to-br from-ghana-gold via-primary to-ghana-green p-1.5 shadow-xl"
          >
            {contestant.data.photoUrl ? (
              <img src={contestant.data.photoUrl} alt={`Photo of ${contestant.data.fullName}`} className="aspect-square w-full rounded-[1.25rem] object-cover" />
            ) : (
              <div className="aspect-square w-full rounded-[1.25rem] bg-[#f1f0ee] dark:bg-white/5" />
            )}
            {contestant.data.code ? (
              <Float distance={5} duration={2.6} className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <span className="block rounded-full bg-[#111418] px-5 py-2 text-sm font-black tracking-[0.25em] text-ghana-gold shadow-lg">
                  CODE: {contestant.data.code}
                </span>
              </Float>
            ) : null}
          </motion.div>
          <h1 className="mt-6 text-3xl font-black text-[#111418] dark:text-white">{contestant.data.fullName}</h1>
          {contestant.data.bio ? <p className="mt-2 text-[#617289] dark:text-gray-400">{contestant.data.bio}</p> : null}
          <ul className="mt-4 flex flex-wrap gap-2">
            {contestant.data.categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/awards/${campaignSlug}/categories/${category.slug}`}
                  className="rounded-full border-2 border-[#e5e7eb] px-3 py-1 text-sm font-bold text-[#617289] hover:border-primary dark:border-white/10 dark:text-gray-400"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <VoteForm campaign={campaign.data} contestant={contestant.data} defaultCategoryId={preselectedCategoryId} />
      </div>
    </div>
  );
};

function VoteForm({
  campaign,
  contestant,
  defaultCategoryId,
}: {
  campaign: PublicCampaign;
  contestant: PublicContestant;
  defaultCategoryId?: string;
}) {
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? contestant.categories[0]?.id ?? '');
  // The field's text is kept separately from the number: a numeric state turns
  // a cleared field into 0, and the browser then shows "05" after typing 5.
  const [quantityText, setQuantityText] = useState('1');
  const quantity = Number(quantityText);
  const maxVotes = maxVotesPerTransaction(
    campaign.voteUnitPrice,
    campaign.maxQuantityPerTransaction,
    campaign.maxTransactionAmount,
  );
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleQuantityChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').replace(/^0+/, '');
    if (digits === '') {
      setQuantityText('');
      return;
    }
    setQuantityText(String(Math.min(Number(digits), maxVotes)));
  };
  const [submissionKey] = useState(() => crypto.randomUUID());

  const mutation = useMutation<CreateVoteIntentResponse, Error>({
    mutationFn: () =>
      createVoteIntent(campaign.slug, {
        categoryId,
        contestantId: contestant.id,
        quantity,
        phoneNumber,
        idempotencyKey: submissionKey,
      }),
    retry: false,
  });

  if (mutation.data) {
    return <PendingPayment response={mutation.data} contestant={contestant} campaign={campaign} />;
  }

  if (!campaign.votingOpen) {
    return (
      <p className="h-fit rounded-xl border-2 border-[#e5e7eb] px-4 py-3 text-sm font-bold text-[#617289] dark:border-white/10 dark:text-gray-400">
        Voting is not open for this campaign right now.
      </p>
    );
  }

  const total = previewTotal(campaign.voteUnitPrice, quantity);

  return (
    <form
      className="flex h-fit flex-col gap-4 rounded-xl border-2 border-[#e5e7eb] p-5 dark:border-white/10"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <h2 className="text-xl font-black text-[#111418] dark:text-white">Vote for {contestant.fullName}</h2>

      {contestant.categories.length > 1 ? (
        <label className="flex flex-col gap-1 text-sm font-bold text-[#111418] dark:text-white">
          Category
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-lg border-2 border-[#e5e7eb] px-3 py-2 font-normal dark:border-white/10 dark:bg-[#0c0f12] dark:text-white"
          >
            {contestant.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-[#617289] dark:text-gray-400">
          Category: <span className="font-bold">{contestant.categories[0]?.name ?? '—'}</span>
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm font-bold text-[#111418] dark:text-white">
        Number of votes
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={maxVotes}
          step={1}
          value={quantityText}
          onChange={(event) => handleQuantityChange(event.target.value)}
          onBlur={() => {
            if (quantityText === '') setQuantityText('1');
          }}
          className="rounded-lg border-2 border-[#e5e7eb] px-3 py-2 font-normal dark:border-white/10 dark:bg-[#0c0f12] dark:text-white"
        />
        <span className="text-xs font-normal text-[#617289] dark:text-gray-400">
          {formatCedis(campaign.voteUnitPrice)} per vote · up to {maxVotes} {maxVotes === 1 ? 'vote' : 'votes'} per transaction
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm font-bold text-[#111418] dark:text-white">
        Mobile number
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0241234567"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="rounded-lg border-2 border-[#e5e7eb] px-3 py-2 font-normal dark:border-white/10 dark:bg-[#0c0f12] dark:text-white"
        />
        <span className="text-xs font-normal text-[#617289] dark:text-gray-400">
          Used for your payment and to confirm your vote. We store it as a one-way hash, never in the clear.
        </span>
      </label>

      <p className="text-sm text-[#617289] dark:text-gray-400">
        Estimated total: <span className="font-black text-[#111418] dark:text-white">{total ?? '—'}</span>
        <br />
        <span className="text-xs">The final amount is calculated and confirmed by the server.</span>
      </p>

      {mutation.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {mutation.error instanceof ApiError ? mutation.error.message : 'Something went wrong. Please try again.'}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={mutation.isPending || !categoryId || phoneNumber.trim() === '' || quantity < 1}
        className="rounded-xl bg-primary px-6 py-3 font-black text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mutation.isPending ? 'Submitting…' : 'Continue'}
      </button>
    </form>
  );
}

function PendingPayment({
  response,
  contestant,
  campaign,
}: {
  response: CreateVoteIntentResponse;
  contestant: PublicContestant;
  campaign: PublicCampaign;
}) {
  const { voteIntent } = response;

  const mutation = useMutation<InitializePaymentResponse, Error>({
    mutationFn: () => initializePayment(voteIntent.id),
    onSuccess: (result) => {
      window.location.href = result.redirectUrl;
    },
  });

  return (
    <div className="flex h-fit flex-col gap-4 rounded-xl border-2 border-accent bg-accent/5 p-5">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-accent">Awaiting payment</p>
        <h2 className="mt-1 text-2xl font-black text-[#111418] dark:text-white">
          Your {voteIntent.quantity === 1 ? 'vote is' : 'votes are'} reserved, not yet paid
        </h2>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-[#617289] dark:text-gray-400">Nominee</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{contestant.fullName}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Votes</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{voteIntent.quantity}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Amount due</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{formatCedis(voteIntent.amount)}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Reference</dt>
        <dd className="font-mono text-xs text-[#111418] dark:text-white">{voteIntent.id}</dd>
      </dl>

      <p className="text-sm text-[#617289] dark:text-gray-400">
        <strong className="text-[#111418] dark:text-white">No payment has been taken and no vote has been counted.</strong>{' '}
        Continuing sends you to your provider to authorise {formatCedis(voteIntent.amount)}; your{' '}
        {voteIntent.quantity === 1 ? 'vote' : 'votes'} will only count once that payment is confirmed by our servers.
      </p>

      {mutation.isError ? (
        <p className="text-sm font-bold text-red-600 dark:text-red-400">
          {mutation.error instanceof ApiError ? mutation.error.message : 'Could not start the payment. Please try again.'}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="rounded-xl bg-primary px-6 py-3 font-black text-white transition-all hover:bg-primary-dark disabled:opacity-60"
        >
          {mutation.isPending ? 'Starting payment…' : 'Continue to payment'}
        </button>
        <Link
          to={`/awards/${campaign.slug}`}
          className="self-start rounded-xl border-2 border-primary px-6 py-3 font-black text-primary transition-all hover:bg-primary/5"
        >
          Back to {campaign.name}
        </Link>
      </div>
    </div>
  );
}

export default AwardsContestant;
