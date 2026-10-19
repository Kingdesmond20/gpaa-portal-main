import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { showToast } from '../../components/Toast';
import { getMyApplication } from '../../lib/membershipApi';
import { getMyCertificateUrl, payMembershipFee } from '../../lib/paymentsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { ApplicationStatus, MembershipApplication } from '../../types';

const STATUS_META: Record<ApplicationStatus, { label: string; icon: string; className: string }> = {
  pending: { label: 'Pending Review', icon: 'hourglass_empty', className: 'bg-ghana-gold/15 text-ghana-gold' },
  approved: { label: 'Approved', icon: 'check_circle', className: 'bg-ghana-green/15 text-ghana-green' },
  rejected: { label: 'Not Approved', icon: 'cancel', className: 'bg-red-500/10 text-red-500' },
  needs_correction: { label: 'Needs Correction', icon: 'edit_note', className: 'bg-primary/10 text-primary' },
};

/**
 * Member portal shell. Shows the logged-in member's most recent membership
 * application and its status. Documents/certificate and payment/renewal
 * history are later phases.
 */
const MemberDashboard: React.FC = () => {
  usePageTitle('My Portal', 'Your GPAA member portal.');
  const { profile, session } = useAuth();
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [expiryDate, setExpiryDate] = useState<string | null>(profile?.membershipExpiryDate ?? null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!session) return;
    getMyApplication(session.user.id)
      .then(setApplication)
      .catch((err) => showToast(err instanceof Error ? err.message : 'Could not load your application.', 'error'))
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    setExpiryDate(profile?.membershipExpiryDate ?? null);
  }, [profile?.membershipExpiryDate]);

  useEffect(() => {
    if (!session || !expiryDate) return;
    getMyCertificateUrl(session.user.id).then(setCertificateUrl).catch(() => setCertificateUrl(null));
  }, [session, expiryDate]);

  // Invited members often have no profile name yet, so fall back to the first
  // name on their application, and only then to the email. While the
  // application is still loading, show a bare "Welcome" rather than flashing the
  // email address and swapping it a moment later.
  const displayName = profile?.fullName || application?.firstName || (loading ? null : profile?.email);
  const welcomeHeading = displayName ? `Welcome, ${displayName}` : 'Welcome';

  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  const handlePay = async () => {
    setPaying(true);
    try {
      const result = await payMembershipFee();
      if (result.membershipExpiryDate) setExpiryDate(result.membershipExpiryDate);
      showToast(
        result.simulated
          ? 'Test-mode payment recorded (no money was charged) — your membership is now active.'
          : 'Payment successful — your membership is now active!',
        'success'
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Payment could not be completed.', 'error');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-2 dark:text-white">
            {welcomeHeading}
          </h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">
            This is your GPAA member portal.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12"
        >
          <h2 className="text-xl font-black mb-4 dark:text-white">Membership Application</h2>
          {loading ? (
            <p className="text-[#617289] dark:text-gray-400">Loading…</p>
          ) : !application ? (
            <div>
              <p className="text-[#617289] dark:text-gray-400 mb-4">
                We don't have a membership application on file for your account yet.
              </p>
              <Link
                to="/membership/join"
                className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-black hover:bg-primary-dark transition-all shadow-lg"
              >
                Apply for Membership
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${STATUS_META[application.status].className}`}>
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    {STATUS_META[application.status].icon}
                  </span>
                  {STATUS_META[application.status].label}
                </span>
              </div>
              <p className="text-[#617289] dark:text-gray-400 mb-2">
                <strong>Category:</strong> {application.category}
              </p>
              <p className="text-[#617289] dark:text-gray-400 mb-4">
                Submitted {new Date(application.submittedAt).toLocaleDateString()}
              </p>
              {application.status === 'needs_correction' && application.correctionMessage && (
                <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-4 mb-4">
                  <p className="font-bold mb-1 dark:text-white">What needs fixing:</p>
                  <p className="text-[#617289] dark:text-gray-400 mb-3">{application.correctionMessage}</p>
                  <Link to="/membership/join" className="text-primary font-bold hover:underline">
                    Submit a corrected application
                  </Link>
                </div>
              )}
              {application.status === 'rejected' && (
                <p className="text-[#617289] dark:text-gray-400">
                  Questions about this decision? Contact{' '}
                  <a href="mailto:membership@gpaa.org.gh" className="text-primary font-bold hover:underline">
                    membership@gpaa.org.gh
                  </a>.
                </p>
              )}
            </div>
          )}
        </motion.div>

        {application?.status === 'approved' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-8 md:p-12 mt-8"
          >
            <h2 className="text-xl font-black mb-4 dark:text-white">Membership Standing</h2>
            {expiryDate ? (
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    isExpired ? 'bg-red-500/10 text-red-500' : 'bg-ghana-green/15 text-ghana-green'
                  }`}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    {isExpired ? 'error' : 'verified'}
                  </span>
                  {isExpired ? 'Expired' : 'Active'} — {isExpired ? 'expired' : 'valid until'}{' '}
                  {new Date(expiryDate).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <p className="text-[#617289] dark:text-gray-400 mb-4">
                No membership fee payment on file yet. Pay your annual fee to activate your membership.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePay}
                disabled={paying}
                className="bg-ghana-green text-white px-6 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg disabled:opacity-60"
              >
                {paying ? 'Processing…' : expiryDate ? 'Renew Membership' : 'Pay Membership Fee'}
              </button>
              {certificateUrl && (
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-xl font-black hover:bg-primary/20 transition-all"
                >
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">workspace_premium</span>
                  Download Certificate
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
