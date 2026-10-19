import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usePageTitle } from '../hooks/usePageTitle';
import { ApiError, verifyVotePayment } from '../lib/votingApi';
import { formatCedis } from '../lib/voteMoney';
import { motion } from 'framer-motion';
import { Confetti } from '../components/awards/motion';

const MAX_POLLS = 12; // ~1 minute at 5s: covers a slow mobile-money confirmation

/**
 * Where the voter lands after checkout. The query string is whatever the
 * payment provider's redirect put there, so it is NOT trusted for the outcome:
 * we ask the server (which verifies with the provider) and show what it says.
 * A vote is only counted once the server reports PAYMENT_SUCCESS.
 */
const AwardsPaymentReturn: React.FC = () => {
  usePageTitle('Your vote');
  const [searchParams] = useSearchParams();
  // Paystack appends both `reference` and `trxref`.
  const reference = searchParams.get('reference') ?? searchParams.get('trxref');

  const result = useQuery({
    queryKey: ['awards-vote-payment', reference],
    queryFn: () => verifyVotePayment(reference as string),
    enabled: Boolean(reference),
    retry: false,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'PENDING_PAYMENT' && query.state.dataUpdateCount < MAX_POLLS ? 5000 : false;
    },
  });

  const shell = (children: React.ReactNode) => (
    <div className="bg-white dark:bg-[#14181c] max-w-2xl mx-auto px-6 py-20">{children}</div>
  );
  const backLink = (
    <Link
      to="/awards"
      className="self-start rounded-xl bg-primary px-6 py-3 font-black text-white transition-all hover:bg-primary-dark"
    >
      Back to Awards
    </Link>
  );

  if (!reference) {
    return shell(
      <div className="flex flex-col gap-4 rounded-xl border-2 border-[#e5e7eb] p-6 dark:border-white/10">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">No payment to show</h1>
        <p className="text-sm text-[#617289] dark:text-gray-400">This page needs a payment reference. Start a vote from a nominee&apos;s page.</p>
        {backLink}
      </div>,
    );
  }

  if (result.isLoading || (result.data?.status === 'PENDING_PAYMENT' && !result.isError)) {
    return shell(
      <div className="flex flex-col gap-4 rounded-xl border-2 border-accent bg-accent/5 p-6" role="status">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">Confirming your payment…</h1>
        <p className="text-sm text-[#617289] dark:text-gray-400">
          We&apos;re waiting for confirmation of your payment. This can take a few seconds — please keep this page open.
          Your vote counts only once the payment is confirmed.
        </p>
        <p className="text-xs text-[#617289] dark:text-gray-400">
          Reference: <span className="font-mono">{reference}</span>
        </p>
      </div>,
    );
  }

  if (result.isError) {
    const message = result.error instanceof ApiError ? result.error.message : 'We could not check your payment. Please try again.';
    return shell(
      <div className="flex flex-col gap-4 rounded-xl border-2 border-red-500 bg-red-50 p-6 dark:bg-red-500/10" role="alert">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">We couldn&apos;t confirm your payment</h1>
        <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
        <p className="text-xs text-[#617289] dark:text-gray-400">
          Reference: <span className="font-mono">{reference}</span>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => result.refetch()}
            className="rounded-xl border-2 border-primary px-6 py-3 font-black text-primary transition-all hover:bg-primary/5"
          >
            Try again
          </button>
          {backLink}
        </div>
      </div>,
    );
  }

  const payment = result.data!;

  if (payment.status === 'FAILED') {
    return shell(
      <div className="flex flex-col gap-4 rounded-xl border-2 border-red-500 bg-red-50 p-6 dark:bg-red-500/10" role="alert">
        <h1 className="text-2xl font-black text-[#111418] dark:text-white">Payment not completed</h1>
        <p className="text-sm text-red-700 dark:text-red-300">
          Your payment was not successful, so no votes were counted and you have not been charged for them.
        </p>
        <Link
          to={`/awards/${payment.campaignSlug}`}
          className="self-start rounded-xl bg-primary px-6 py-3 font-black text-white transition-all hover:bg-primary-dark"
        >
          Try again
        </Link>
      </div>,
    );
  }

  return shell(
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 rounded-xl border-2 border-green bg-green/5 p-6"
      role="status"
    >
      <Confetti />
      <motion.span
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
        className="material-symbols-outlined self-start text-6xl text-green"
        aria-hidden="true"
      >
        check_circle
      </motion.span>
      <p className="text-sm font-black uppercase tracking-widest text-green">Vote confirmed</p>
      <h1 className="text-2xl font-black text-[#111418] dark:text-white">
        Thank you! Your {payment.quantity === 1 ? 'vote has' : `${payment.quantity} votes have`} been counted.
      </h1>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-[#617289] dark:text-gray-400">Nominee</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{payment.contestantName}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Category</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{payment.categoryName}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Votes</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{payment.quantity}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Amount</dt>
        <dd className="font-bold text-[#111418] dark:text-white">{formatCedis(payment.amount)}</dd>
        <dt className="text-[#617289] dark:text-gray-400">Receipt no.</dt>
        <dd className="font-mono text-xs text-[#111418] dark:text-white">{payment.reference}</dd>
      </dl>
      {payment.simulated ? (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold text-[#7a5f00] dark:text-accent">
          Test mode: no money was charged for this vote.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/awards/${payment.campaignSlug}`}
          className="rounded-xl bg-primary px-6 py-3 font-black text-white transition-all hover:bg-primary-dark"
        >
          Vote again
        </Link>
        <Link
          to="/awards"
          className="rounded-xl border-2 border-primary px-6 py-3 font-black text-primary transition-all hover:bg-primary/5"
        >
          All awards
        </Link>
      </div>
    </motion.div>,
  );
};

export default AwardsPaymentReturn;
