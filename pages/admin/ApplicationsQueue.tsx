import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { showToast } from '../../components/Toast';
import { getApplications, reviewApplication } from '../../lib/membershipApi';
import type { ApplicationStatus, MembershipApplication } from '../../types';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: 'bg-ghana-gold/15 text-ghana-gold',
  approved: 'bg-ghana-green/15 text-ghana-green',
  rejected: 'bg-red-500/10 text-red-500',
  needs_correction: 'bg-primary/10 text-primary',
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_correction: 'Needs Correction',
};

const FILTERS: Array<ApplicationStatus | 'all'> = ['all', 'pending', 'approved', 'needs_correction', 'rejected'];

const ApplicationsQueue: React.FC = () => {
  usePageTitle('Applications Queue', 'Review GPAA membership applications.');
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setApplications(await getApplications());
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not load applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? applications : applications.filter((a) => a.status === filter)),
    [applications, filter]
  );

  const handleReview = async (application: MembershipApplication, decision: 'approved' | 'rejected' | 'needs_correction') => {
    let message: string | undefined;
    if (decision === 'rejected' || decision === 'needs_correction') {
      const promptText = decision === 'rejected'
        ? 'Reason for rejection (included in the email to the applicant):'
        : "What needs correcting? (included in the email to the applicant):";
      const input = window.prompt(promptText);
      if (input === null) return; // cancelled
      message = input;
    }

    setBusyId(application.id);
    try {
      const result = await reviewApplication(application.id, decision, message);
      const done =
        decision === 'approved'
          ? `Approved${result?.inviteSent ? ' — portal invite sent' : ''}.`
          : decision === 'rejected'
          ? 'Application rejected.'
          : 'Correction requested.';
      showToast(`${done}${result?.emailSent ? ' Applicant emailed.' : ''}`, 'success');
      // Be honest about what did NOT go out — the decision is saved either way.
      if (result?.inviteError) {
        showToast(`The portal invite could not be sent: ${result.inviteError}`, 'error');
      }
      if (result && result.emailSent === false) {
        showToast(`The applicant was NOT emailed: ${result.emailError ?? 'unknown error'}`, 'error');
      }
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update this application.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <Link to="/admin" className="text-sm font-bold text-primary hover:underline mb-2 inline-block">
            &larr; Admin Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-2 dark:text-white">Membership Applications</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">Review, approve, reject, or request corrections.</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-[#14181c] text-[#617289] dark:text-gray-400 border-2 border-[#e5e7eb] dark:border-white/10'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8"
        >
          {loading ? (
            <p className="text-[#617289] dark:text-gray-400">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="text-[#617289] dark:text-gray-400">No applications here.</p>
          ) : (
            <div className="space-y-4">
              {visible.map((app) => (
                <div key={app.id} className="border-2 border-[#f0f2f4] dark:border-white/10 rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-black text-lg dark:text-white">
                        {app.firstName} {app.lastName}
                      </h3>
                      <p className="text-sm text-[#617289] dark:text-gray-400">
                        {app.email} · {app.phone} · {app.category}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 text-sm text-[#617289] dark:text-gray-400 mb-4">
                    <p><strong>MDC License:</strong> {app.mdcLicenseNumber}</p>
                    <p><strong>Employer:</strong> {app.employer}</p>
                    <p><strong>Region:</strong> {app.region}, {app.district}</p>
                    <p><strong>Facility:</strong> {app.facility}</p>
                  </div>
                  {app.status === 'rejected' && app.adminNotes && (
                    <p className="text-sm text-red-500 mb-3"><strong>Rejection reason:</strong> {app.adminNotes}</p>
                  )}
                  {app.status === 'needs_correction' && app.correctionMessage && (
                    <p className="text-sm text-primary mb-3"><strong>Correction requested:</strong> {app.correctionMessage}</p>
                  )}
                  {app.status === 'pending' && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => handleReview(app, 'approved')}
                        className="bg-ghana-green text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-dark transition-all disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => handleReview(app, 'needs_correction')}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all disabled:opacity-60"
                      >
                        Request Correction
                      </button>
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => handleReview(app, 'rejected')}
                        className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationsQueue;
