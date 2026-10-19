/**
 * Admin-side data access for awards. Every call here runs as the signed-in
 * admin's own session; what they may do is decided by the is_admin() row-level
 * security policies in supabase/migrations/0006_awards.sql, not by this file.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// award_* tables aren't in the hand-written Database type; see votingApi.ts.
const db = supabase as unknown as SupabaseClient;

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'OPEN' | 'PAUSED' | 'CLOSED' | 'ARCHIVED';
export type ContestantStatus = 'ACTIVE' | 'DISQUALIFIED';

export interface AdminCampaign {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  currency: string;
  startsAt: string | null;
  endsAt: string | null;
  voteUnitPrice: number;
  maxQuantityPerTransaction: number;
  maxTransactionAmount: number;
  showResults: boolean;
  coverImageUrl: string | null;
  createdAt: string;
}

export interface CampaignInput {
  slug: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  startsAt: string | null;
  endsAt: string | null;
  voteUnitPrice: number;
  maxQuantityPerTransaction: number;
  maxTransactionAmount: number;
  showResults: boolean;
  /** undefined = leave the stored cover as it is; null = remove it. */
  coverImageUrl?: string | null;
}

export interface AdminCategory {
  id: string;
  campaignId: string;
  slug: string;
  name: string;
  description: string | null;
  displayOrder: number;
  imageUrl: string | null;
}

export interface AdminContestant {
  id: string;
  campaignId: string;
  slug: string;
  fullName: string;
  bio: string | null;
  photoUrl: string | null;
  code: string | null;
  status: ContestantStatus;
  categoryIds: string[];
}

export interface ContestantInput {
  slug: string;
  fullName: string;
  bio: string | null;
  code: string | null;
  status: ContestantStatus;
  categoryIds: string[];
  photoUrl?: string | null;
}

export interface CampaignStats {
  totalOrders: number;
  paidOrders: number;
  votes: number;
  revenue: number;
  simulatedVotes: number;
}

export interface AdminResultRow {
  categoryId: string;
  contestantId: string;
  votes: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapCampaign = (r: any): AdminCampaign => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description,
  status: r.status,
  currency: r.currency,
  startsAt: r.starts_at,
  endsAt: r.ends_at,
  voteUnitPrice: Number(r.vote_unit_price),
  maxQuantityPerTransaction: r.max_quantity_per_transaction,
  maxTransactionAmount: Number(r.max_transaction_amount),
  showResults: r.show_results,
  coverImageUrl: r.cover_image_url ?? null,
  createdAt: r.created_at,
});

const campaignRow = (i: CampaignInput) => ({
  ...(i.coverImageUrl !== undefined ? { cover_image_url: i.coverImageUrl } : {}),
  slug: i.slug,
  name: i.name,
  description: i.description,
  status: i.status,
  starts_at: i.startsAt,
  ends_at: i.endsAt,
  vote_unit_price: i.voteUnitPrice,
  max_quantity_per_transaction: i.maxQuantityPerTransaction,
  max_transaction_amount: i.maxTransactionAmount,
  show_results: i.showResults,
});

function check<T>(res: { data: T | null; error: { message: string; code?: string } | null }): T {
  if (res.error) {
    if (res.error.code === '23505') throw new Error('That web address, or nominee code, is already used. Pick another.');
    if (res.error.code === '23503') throw new Error('This item is in use (it has votes or related records) and cannot be deleted. Archive or disqualify it instead.');
    throw new Error(res.error.message);
  }
  return res.data as T;
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ---------------------------------------------------------------------------
export async function listCampaigns(): Promise<AdminCampaign[]> {
  return check(await db.from('award_campaigns').select('*').order('created_at', { ascending: false })).map(mapCampaign);
}

export async function getCampaign(id: string): Promise<AdminCampaign | null> {
  const data = check(await db.from('award_campaigns').select('*').eq('id', id).maybeSingle());
  return data ? mapCampaign(data) : null;
}

export async function createCampaign(input: CampaignInput): Promise<AdminCampaign> {
  return mapCampaign(check(await db.from('award_campaigns').insert(campaignRow(input)).select('*').single()));
}

export async function updateCampaign(id: string, input: CampaignInput): Promise<AdminCampaign> {
  return mapCampaign(check(await db.from('award_campaigns').update(campaignRow(input)).eq('id', id).select('*').single()));
}

export async function deleteCampaign(id: string): Promise<void> {
  check(await db.from('award_campaigns').delete().eq('id', id));
}

// ---------------------------------------------------------------------------
const mapCategory = (r: any): AdminCategory => ({
  id: r.id,
  campaignId: r.campaign_id,
  slug: r.slug,
  name: r.name,
  description: r.description,
  displayOrder: r.display_order,
  imageUrl: r.image_url ?? null,
});

export async function listCategories(campaignId: string): Promise<AdminCategory[]> {
  return check(
    await db.from('award_categories').select('*').eq('campaign_id', campaignId).order('display_order').order('name'),
  ).map(mapCategory);
}

export async function saveCategory(
  campaignId: string,
  input: { id?: string; slug: string; name: string; description: string | null; displayOrder: number; imageUrl?: string | null },
): Promise<void> {
  const row = {
    campaign_id: campaignId,
    slug: input.slug,
    name: input.name,
    description: input.description,
    display_order: input.displayOrder,
    ...(input.imageUrl !== undefined ? { image_url: input.imageUrl } : {}),
  };
  if (input.id) check(await db.from('award_categories').update(row).eq('id', input.id));
  else check(await db.from('award_categories').insert(row));
}

export async function deleteCategory(id: string): Promise<void> {
  check(await db.from('award_categories').delete().eq('id', id));
}

// ---------------------------------------------------------------------------
export async function listContestants(campaignId: string): Promise<AdminContestant[]> {
  const rows = check(
    await db
      .from('award_contestants')
      .select('*, award_contestant_categories(category_id)')
      .eq('campaign_id', campaignId)
      .order('full_name'),
  );
  return rows.map((r: any) => ({
    id: r.id,
    campaignId: r.campaign_id,
    slug: r.slug,
    fullName: r.full_name,
    bio: r.bio,
    photoUrl: r.photo_url,
    code: r.code ?? null,
    status: r.status,
    categoryIds: (r.award_contestant_categories ?? []).map((l: any) => l.category_id),
  }));
}

/** Creates or updates a nominee and replaces their category links. */
export async function saveContestant(campaignId: string, input: ContestantInput, id?: string): Promise<string> {
  const row: Record<string, unknown> = {
    campaign_id: campaignId,
    slug: input.slug,
    full_name: input.fullName,
    bio: input.bio,
    code: input.code,
    status: input.status,
  };
  if (input.photoUrl !== undefined) row.photo_url = input.photoUrl;

  let contestantId = id;
  if (id) {
    check(await db.from('award_contestants').update(row).eq('id', id));
  } else {
    contestantId = check(await db.from('award_contestants').insert(row).select('id').single()).id as string;
  }

  check(await db.from('award_contestant_categories').delete().eq('contestant_id', contestantId));
  if (input.categoryIds.length > 0) {
    check(
      await db
        .from('award_contestant_categories')
        .insert(input.categoryIds.map((categoryId) => ({ contestant_id: contestantId, category_id: categoryId }))),
    );
  }
  return contestantId as string;
}

export async function deleteContestant(id: string): Promise<void> {
  check(await db.from('award_contestants').delete().eq('id', id));
}

/** Uploads an image (nominee photo, category artwork or campaign cover) to the public award-photos bucket and returns its public URL. */
export async function uploadContestantPhoto(campaignId: string, file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Photos must be JPG, PNG or WebP.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Photos must be under 5 MB.');
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${campaignId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('award-photos').upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from('award-photos').getPublicUrl(path).data.publicUrl;
}

// ---------------------------------------------------------------------------
export async function getStats(campaignId: string): Promise<CampaignStats> {
  const rows = check(await db.rpc('award_campaign_stats', { p_campaign_id: campaignId }));
  const r = (rows as any[])[0] ?? {};
  return {
    totalOrders: Number(r.total_orders ?? 0),
    paidOrders: Number(r.paid_orders ?? 0),
    votes: Number(r.votes ?? 0),
    revenue: Number(r.revenue ?? 0),
    simulatedVotes: Number(r.simulated_votes ?? 0),
  };
}

/** Deletes this campaign's test-mode orders (never real ones). Returns how many were removed. */
export async function clearTestVotes(campaignId: string): Promise<number> {
  return Number(check(await db.rpc('award_clear_test_votes', { p_campaign_id: campaignId })));
}

export async function getResults(campaignId: string): Promise<AdminResultRow[]> {
  const rows = check(await db.rpc('award_results', { p_campaign_id: campaignId }));
  return (rows as any[]).map((r) => ({ categoryId: r.category_id, contestantId: r.contestant_id, votes: Number(r.votes) }));
}
/* eslint-enable @typescript-eslint/no-explicit-any */
