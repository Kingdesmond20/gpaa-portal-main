import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '../../hooks/usePageTitle';
import { showToast } from '../../components/Toast';
import { createCampaign, listCampaigns, slugify, type AdminCampaign, type CampaignStatus } from '../../lib/awardsAdminApi';

export const STATUS_STYLES: Record<CampaignStatus, string> = {
  DRAFT: 'bg-[#e5e7eb] text-[#617289]',
  SCHEDULED: 'bg-ghana-gold/20 text-[#7a5f00]',
  OPEN: 'bg-ghana-green/15 text-ghana-green',
  PAUSED: 'bg-ghana-gold/20 text-[#7a5f00]',
  CLOSED: 'bg-primary/10 text-primary',
  ARCHIVED: 'bg-[#e5e7eb] text-[#617289]',
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all';

const AwardsManager: React.FC = () => {
  usePageTitle('Awards Manager', 'Manage GPAA awards campaigns, nominees and votes.');
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [price, setPrice] = useState('1.00');

  useEffect(() => {
    listCampaigns()
      .then(setCampaigns)
      .catch((err) => showToast(err instanceof Error ? err.message : 'Could not load campaigns.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const unitPrice = Number(price);
    if (!(unitPrice > 0)) {
      showToast('Enter a price per vote greater than 0.', 'error');
      return;
    }
    setCreating(true);
    try {
      const campaign = await createCampaign({
        slug,
        name,
        description: null,
        status: 'DRAFT',
        startsAt: null,
        endsAt: null,
        voteUnitPrice: unitPrice,
        maxQuantityPerTransaction: 100,
        maxTransactionAmount: Math.max(1000, unitPrice * 100),
        showResults: false,
      });
      showToast('Campaign created as a draft. Add categories and nominees next.', 'success');
      navigate(`/admin/awards/${campaign.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not create the campaign.', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <Link to="/admin" className="text-sm font-bold text-primary hover:underline">
            &larr; Admin Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-2 dark:text-white">Awards Manager</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">Create campaigns, add nominees, open voting and watch results.</p>
        </motion.div>

        <div className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-black mb-4 dark:text-white">New Campaign</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-[2fr_2fr_1fr_auto] gap-4 items-end">
            <div>
              <label htmlFor="c-name" className="block font-bold mb-2 text-sm dark:text-white">Name</label>
              <input
                id="c-name"
                required
                value={name}
                placeholder="GPAA Prestigious Awards 2026"
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="c-slug" className="block font-bold mb-2 text-sm dark:text-white">Web address</label>
              <input
                id="c-slug"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Lowercase letters, numbers and hyphens"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="c-price" className="block font-bold mb-2 text-sm dark:text-white">GHS / vote</label>
              <input
                id="c-price"
                required
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-ghana-green text-white px-6 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-black mb-4 dark:text-white">Campaigns</h2>
          {loading ? (
            <p className="text-[#617289] dark:text-gray-400">Loading…</p>
          ) : campaigns.length === 0 ? (
            <p className="text-[#617289] dark:text-gray-400">No campaigns yet. Create the first one above.</p>
          ) : (
            <ul className="space-y-3">
              {campaigns.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/admin/awards/${c.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#e5e7eb] dark:border-white/10 p-4 hover:border-primary transition-all"
                  >
                    <div>
                      <p className="font-black dark:text-white">{c.name}</p>
                      <p className="text-sm text-[#617289] dark:text-gray-400">
                        /awards/{c.slug} · GHS {c.voteUnitPrice.toFixed(2)} per vote
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardsManager;
