import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '../../hooks/usePageTitle';
import { showToast } from '../../components/Toast';
import {
  deleteCampaign,
  deleteCategory,
  clearTestVotes,
  deleteContestant,
  getCampaign,
  getResults,
  getStats,
  listCategories,
  listContestants,
  saveCategory,
  saveContestant,
  slugify,
  updateCampaign,
  uploadContestantPhoto,
  type AdminCampaign,
  type AdminCategory,
  type AdminContestant,
  type AdminResultRow,
  type CampaignStats,
  type CampaignStatus,
  type ContestantStatus,
} from '../../lib/awardsAdminApi';
import { STATUS_STYLES } from './AwardsManager';

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all';
const cardClass = 'bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8 mb-8';
const primaryBtn = 'bg-ghana-green text-white px-6 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg disabled:opacity-60';
const ghostBtn = 'px-4 py-2 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 font-bold text-sm hover:border-primary transition-all dark:text-white';

const STATUSES: CampaignStatus[] = ['DRAFT', 'SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED', 'ARCHIVED'];

const pad = (n: number) => String(n).padStart(2, '0');
const toLocalInput = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (value: string): string | null => (value ? new Date(value).toISOString() : null);

const AwardsCampaignAdmin: React.FC = () => {
  const { campaignId = '' } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<AdminCampaign | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [contestants, setContestants] = useState<AdminContestant[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [results, setResults] = useState<AdminResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  usePageTitle(campaign ? `${campaign.name} — Awards` : 'Awards Campaign', 'Manage this awards campaign.');

  const reload = useCallback(async () => {
    try {
      const c = await getCampaign(campaignId);
      setCampaign(c);
      if (!c) return;
      const [cats, cons, st, res] = await Promise.all([
        listCategories(campaignId),
        listContestants(campaignId),
        getStats(campaignId),
        getResults(campaignId),
      ]);
      setCategories(cats);
      setContestants(cons);
      setStats(st);
      setResults(res);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not load this campaign.', 'error');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (loading) {
    return <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4 text-center text-[#617289]">Loading…</div>;
  }
  if (!campaign) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4 text-center">
        <p className="mb-4 dark:text-white">Campaign not found.</p>
        <Link to="/admin/awards" className="text-primary font-bold">&larr; Back to Awards Manager</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <Link to="/admin/awards" className="text-sm font-bold text-primary hover:underline">
            &larr; Awards Manager
          </Link>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-3xl md:text-4xl font-black dark:text-white">{campaign.name}</h1>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${STATUS_STYLES[campaign.status]}`}>{campaign.status}</span>
          </div>
          <p className="text-[#617289] dark:text-gray-400 mt-1">
            Public page:{' '}
            <Link to={`/awards/${campaign.slug}`} className="text-primary font-bold hover:underline">
              /awards/{campaign.slug}
            </Link>
            {campaign.status === 'DRAFT' ? ' (drafts are only visible to admins)' : ''}
          </p>
        </motion.div>

        <StatsCard stats={stats} campaignId={campaign.id} onRefresh={reload} />
        <SettingsCard campaign={campaign} onSaved={reload} onDeleted={() => navigate('/admin/awards')} />
        <CategoriesCard campaignId={campaign.id} categories={categories} onChanged={reload} />
        <ContestantsCard campaignId={campaign.id} categories={categories} contestants={contestants} onChanged={reload} />
        <ResultsCard categories={categories} contestants={contestants} results={results} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
function StatsCard({ stats, campaignId, onRefresh }: { stats: CampaignStats | null; campaignId: string; onRefresh: () => void }) {
  const [clearing, setClearing] = useState(false);
  const items = stats
    ? [
        { label: 'Votes counted', value: stats.votes.toLocaleString() },
        { label: 'Paid orders', value: `${stats.paidOrders} / ${stats.totalOrders}` },
        { label: 'Revenue (real payments)', value: `GHS ${stats.revenue.toFixed(2)}` },
        { label: 'Test-mode votes', value: stats.simulatedVotes.toLocaleString() },
      ]
    : [];

  const handleClear = async () => {
    if (!window.confirm('Delete all TEST-MODE votes and orders for this campaign? Real paid votes are never touched. This cannot be undone.')) return;
    setClearing(true);
    try {
      const removed = await clearTestVotes(campaignId);
      showToast(`Removed ${removed} test-mode order${removed === 1 ? '' : 's'}.`, 'success');
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not clear test votes.', 'error');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black dark:text-white">Overview</h2>
        <button type="button" onClick={onRefresh} className={ghostBtn}>Refresh</button>
      </div>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.label} className="rounded-2xl bg-background-light dark:bg-white/5 p-4">
            <dt className="text-xs font-bold text-[#617289] dark:text-gray-400">{i.label}</dt>
            <dd className="text-2xl font-black dark:text-white mt-1">{i.value}</dd>
          </div>
        ))}
      </dl>
      {stats && stats.simulatedVotes > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm font-bold text-[#7a5f00] dark:text-ghana-gold">
            {stats.simulatedVotes} of these votes came from test-mode payments (no money was charged). Clear them before going live.
          </p>
          <button type="button" onClick={handleClear} disabled={clearing} className={ghostBtn}>
            {clearing ? 'Clearing…' : 'Clear test votes'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
function SettingsCard({ campaign, onSaved, onDeleted }: { campaign: AdminCampaign; onSaved: () => void; onDeleted: () => void }) {
  const [form, setForm] = useState({
    name: campaign.name,
    slug: campaign.slug,
    description: campaign.description ?? '',
    status: campaign.status,
    startsAt: toLocalInput(campaign.startsAt),
    endsAt: toLocalInput(campaign.endsAt),
    price: String(campaign.voteUnitPrice),
    maxQty: String(campaign.maxQuantityPerTransaction),
    maxAmount: String(campaign.maxTransactionAmount),
    showResults: campaign.showResults,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    const maxQty = Number(form.maxQty);
    const maxAmount = Number(form.maxAmount);
    if (!(price > 0) || !Number.isInteger(maxQty) || maxQty < 1 || !(maxAmount > 0)) {
      showToast('Price, max votes and max amount must be positive numbers.', 'error');
      return;
    }
    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
      showToast('The closing time must be after the opening time.', 'error');
      return;
    }
    setSaving(true);
    try {
      const coverImageUrl = coverFile ? await uploadContestantPhoto(campaign.id, coverFile) : undefined;
      await updateCampaign(campaign.id, {
        slug: form.slug,
        name: form.name,
        description: form.description.trim() || null,
        status: form.status,
        startsAt: fromLocalInput(form.startsAt),
        endsAt: fromLocalInput(form.endsAt),
        voteUnitPrice: price,
        maxQuantityPerTransaction: maxQty,
        maxTransactionAmount: maxAmount,
        showResults: form.showResults,
        coverImageUrl,
      });
      setCoverFile(null);
      showToast('Campaign saved.', 'success');
      onSaved();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${campaign.name}" and all its categories and nominees? This can't be undone.`)) return;
    try {
      await deleteCampaign(campaign.id);
      showToast('Campaign deleted.', 'success');
      onDeleted();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete.', 'error');
    }
  };

  return (
    <div className={cardClass}>
      <h2 className="text-2xl font-black mb-4 dark:text-white">Settings</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" id="s-name">
            <input id="s-name" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Web address" id="s-slug">
            <input id="s-slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Description" id="s-desc">
          <textarea id="s-desc" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} />
        </Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Status" id="s-status">
            <select id="s-status" value={form.status} onChange={(e) => set('status', e.target.value as CampaignStatus)} className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Voting opens" id="s-start">
            <input id="s-start" type="datetime-local" value={form.startsAt} onChange={(e) => set('startsAt', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Voting closes" id="s-end">
            <input id="s-end" type="datetime-local" value={form.endsAt} onChange={(e) => set('endsAt', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="GHS per vote" id="s-price">
            <input id="s-price" type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Max votes per purchase" id="s-maxq">
            <input id="s-maxq" type="number" min="1" step="1" value={form.maxQty} onChange={(e) => set('maxQty', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Max GHS per purchase" id="s-maxa">
            <input id="s-maxa" type="number" min="0.01" step="0.01" value={form.maxAmount} onChange={(e) => set('maxAmount', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {campaign.coverImageUrl ? <img src={campaign.coverImageUrl} alt="Current cover" className="h-20 w-16 rounded-lg object-cover" /> : null}
          <div className="min-w-0 flex-1">
            <Field label={campaign.coverImageUrl ? 'Replace cover poster (JPG/PNG/WebP, max 5 MB)' : 'Cover poster (JPG/PNG/WebP, max 5 MB)'} id="s-cover">
              <input
                id="s-cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </Field>
          </div>
        </div>
        <label className="flex items-center gap-3 font-bold text-sm dark:text-white">
          <input type="checkbox" checked={form.showResults} onChange={(e) => set('showResults', e.target.checked)} className="h-5 w-5" />
          Show live vote counts and rankings to the public
        </label>
        <p className="text-xs text-[#617289] dark:text-gray-400">
          Voting is accepted only while the status is OPEN and the current time is between the opening and closing times (if set).
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Save Settings'}</button>
          <button type="button" onClick={handleDelete} className="px-6 py-3 rounded-xl border-2 border-red-500 text-red-600 font-black hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
            Delete Campaign
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-bold mb-2 text-sm dark:text-white">{label}</label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
function CategoriesCard({ campaignId, categories, onChanged }: { campaignId: string; categories: AdminCategory[]; onChanged: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageKey, setImageKey] = useState(0);
  const [busy, setBusy] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const imageUrl = image ? await uploadContestantPhoto(campaignId, image) : undefined;
      await saveCategory(campaignId, {
        imageUrl,
        slug: slugify(name),
        name: name.trim(),
        description: description.trim() || null,
        displayOrder: categories.length,
      });
      setName('');
      setDescription('');
      setImage(null);
      setImageKey((k) => k + 1);
      onChanged();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add the category.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (c: AdminCategory) => {
    if (!window.confirm(`Delete the category "${c.name}"? Nominees stay, but are removed from it.`)) return;
    try {
      await deleteCategory(c.id);
      onChanged();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete.', 'error');
    }
  };

  return (
    <div className={cardClass}>
      <h2 className="text-2xl font-black mb-4 dark:text-white">Categories</h2>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-[1fr_1.5fr_1fr_auto] gap-4 items-end mb-6">
        <Field label="Category name" id="cat-name">
          <input id="cat-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Physician Assistant of the Year" className={inputClass} />
        </Field>
        <Field label="Description (optional)" id="cat-desc">
          <input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Artwork (optional)" id="cat-img">
          <input
            key={imageKey}
            id="cat-img"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white text-sm"
          />
        </Field>
        <button type="submit" disabled={busy || !slugify(name)} className={primaryBtn}>Add</button>
      </form>
      {categories.length === 0 ? (
        <p className="text-[#617289] dark:text-gray-400">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/10 px-4 py-3">
              {c.imageUrl ? <img src={c.imageUrl} alt="" className="h-12 w-20 rounded-lg object-cover" /> : null}
              <div className="flex-1">
                <p className="font-black dark:text-white">{c.name}</p>
                {c.description ? <p className="text-sm text-[#617289] dark:text-gray-400">{c.description}</p> : null}
              </div>
              <button type="button" onClick={() => handleDelete(c)} className="text-sm font-bold text-red-600 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ContestantsCard({
  campaignId,
  categories,
  contestants,
  onChanged,
}: {
  campaignId: string;
  categories: AdminCategory[];
  contestants: AdminContestant[];
  onChanged: () => void;
}) {
  const empty = { name: '', code: '', bio: '', status: 'ACTIVE' as ContestantStatus, categoryIds: [] as string[] };
  const [editing, setEditing] = useState<AdminContestant | null>(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEditing(null);
    setForm(empty);
    setFile(null);
    setFileKey((k) => k + 1);
  };

  const startEdit = (c: AdminContestant) => {
    setEditing(c);
    setForm({ name: c.fullName, code: c.code ?? '', bio: c.bio ?? '', status: c.status, categoryIds: c.categoryIds });
    setFile(null);
    setFileKey((k) => k + 1);
    window.scrollTo({ top: document.getElementById('nominee-form')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const toggleCategory = (id: string) =>
    setForm((f) => ({ ...f, categoryIds: f.categoryIds.includes(id) ? f.categoryIds.filter((c) => c !== id) : [...f.categoryIds, id] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.categoryIds.length === 0) {
      showToast('Pick at least one category for this nominee.', 'error');
      return;
    }
    setBusy(true);
    try {
      const photoUrl = file ? await uploadContestantPhoto(campaignId, file) : undefined;
      await saveContestant(
        campaignId,
        {
          slug: editing ? editing.slug : slugify(form.name),
          fullName: form.name.trim(),
          bio: form.bio.trim() || null,
          code: form.code.trim().toUpperCase() || null,
          status: form.status,
          categoryIds: form.categoryIds,
          ...(photoUrl !== undefined ? { photoUrl } : {}),
        },
        editing?.id,
      );
      showToast(editing ? 'Nominee updated.' : 'Nominee added.', 'success');
      reset();
      onChanged();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save the nominee.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (c: AdminContestant) => {
    if (!window.confirm(`Delete ${c.fullName}? If they already have votes you should disqualify them instead.`)) return;
    try {
      await deleteContestant(c.id);
      if (editing?.id === c.id) reset();
      onChanged();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete.', 'error');
    }
  };

  const toggleStatus = async (c: AdminContestant) => {
    try {
      await saveContestant(
        campaignId,
        { slug: c.slug, fullName: c.fullName, bio: c.bio, code: c.code, status: c.status === 'ACTIVE' ? 'DISQUALIFIED' : 'ACTIVE', categoryIds: c.categoryIds },
        c.id,
      );
      onChanged();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update.', 'error');
    }
  };

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

  return (
    <div className={cardClass}>
      <h2 className="text-2xl font-black mb-4 dark:text-white" id="nominee-form">
        {editing ? `Edit ${editing.fullName}` : 'Nominees'}
      </h2>
      {categories.length === 0 ? (
        <p className="text-[#617289] dark:text-gray-400 mb-4">Add at least one category first, then you can add nominees.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" id="n-name">
              <input id="n-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </Field>
            <Field label={editing?.photoUrl ? 'Replace photo (JPG/PNG/WebP, max 5 MB)' : 'Photo (JPG/PNG/WebP, max 5 MB)'} id="n-photo">
              <input
                key={fileKey}
                id="n-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </Field>
          </div>
          <Field label="Nominee code (optional, e.g. PA-01: printed on posters so voters can find them)" id="n-code">
            <input
              id="n-code"
              value={form.code}
              maxLength={12}
              pattern="[A-Za-z0-9\-]{2,12}"
              title="2-12 letters, numbers or hyphens"
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={inputClass}
            />
          </Field>
          <Field label="Short bio" id="n-bio">
            <textarea id="n-bio" rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} />
          </Field>
          <fieldset>
            <legend className="block font-bold mb-2 text-sm dark:text-white">Categories</legend>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 px-3 py-2 text-sm font-bold dark:text-white">
                  <input type="checkbox" checked={form.categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>
          {editing ? (
            <Field label="Status" id="n-status">
              <select id="n-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContestantStatus })} className={inputClass}>
                <option value="ACTIVE">ACTIVE — visible and votable</option>
                <option value="DISQUALIFIED">DISQUALIFIED — hidden, no new votes</option>
              </select>
            </Field>
          ) : null}
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className={primaryBtn}>{busy ? 'Saving…' : editing ? 'Save Nominee' : 'Add Nominee'}</button>
            {editing ? <button type="button" onClick={reset} className={ghostBtn}>Cancel</button> : null}
          </div>
        </form>
      )}

      {contestants.length === 0 ? (
        <p className="text-[#617289] dark:text-gray-400">No nominees yet.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {contestants.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/10 p-3">
              {c.photoUrl ? (
                <img src={c.photoUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-[#f1f0ee] dark:bg-white/5" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-black dark:text-white truncate">
                  {c.fullName}
                  {c.code ? <span className="ml-2 rounded-full bg-[#111418] px-2 py-0.5 text-xs font-black tracking-widest text-ghana-gold">{c.code}</span> : null}
                  {c.status === 'DISQUALIFIED' ? <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600">Disqualified</span> : null}
                </p>
                <p className="text-xs text-[#617289] dark:text-gray-400 truncate">{c.categoryIds.map(categoryName).join(', ') || 'No category'}</p>
                <div className="mt-1 flex gap-3 text-xs font-bold">
                  <button type="button" onClick={() => startEdit(c)} className="text-primary hover:underline">Edit</button>
                  <button type="button" onClick={() => toggleStatus(c)} className="text-[#7a5f00] dark:text-ghana-gold hover:underline">
                    {c.status === 'ACTIVE' ? 'Disqualify' : 'Reinstate'}
                  </button>
                  <button type="button" onClick={() => handleDelete(c)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ResultsCard({ categories, contestants, results }: { categories: AdminCategory[]; contestants: AdminContestant[]; results: AdminResultRow[] }) {
  return (
    <div className={cardClass}>
      <h2 className="text-2xl font-black mb-1 dark:text-white">Results</h2>
      <p className="text-sm text-[#617289] dark:text-gray-400 mb-4">Confirmed (paid) votes only. Admins always see counts, whatever the public setting is.</p>
      {categories.length === 0 ? (
        <p className="text-[#617289] dark:text-gray-400">No categories yet.</p>
      ) : (
        categories.map((cat) => {
          const rows = contestants
            .filter((c) => c.status === 'ACTIVE' && c.categoryIds.includes(cat.id))
            .map((c) => ({ c, votes: results.find((r) => r.categoryId === cat.id && r.contestantId === c.id)?.votes ?? 0 }))
            .sort((a, b) => b.votes - a.votes || a.c.fullName.localeCompare(b.c.fullName));
          const total = rows.reduce((sum, r) => sum + r.votes, 0);
          return (
            <div key={cat.id} className="mb-6 last:mb-0">
              <h3 className="font-black dark:text-white mb-2">
                {cat.name} <span className="text-sm font-bold text-[#617289] dark:text-gray-400">· {total.toLocaleString()} votes</span>
              </h3>
              {rows.length === 0 ? (
                <p className="text-sm text-[#617289] dark:text-gray-400">No nominees in this category.</p>
              ) : (
                <ol className="space-y-1">
                  {rows.map(({ c, votes }, i) => (
                    <li key={c.id} className="flex items-center gap-3 text-sm dark:text-white">
                      <span className="w-6 text-right font-black text-primary">{i + 1}</span>
                      <span className="flex-1 truncate font-bold">{c.fullName}</span>
                      <div className="hidden sm:block h-2 w-40 rounded-full bg-[#e5e7eb] dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${total ? (votes / total) * 100 : 0}%` }} />
                      </div>
                      <span className="w-20 text-right font-black">{votes.toLocaleString()}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default AwardsCampaignAdmin;
