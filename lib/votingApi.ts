/**
 * Data layer for the GPAA Prestigious Awards voting flow (/awards pages).
 *
 * Reads (campaigns, categories, nominees, results) go straight to Supabase and
 * are governed by the row-level-security policies in
 * supabase/migrations/0006_awards.sql. Anything that spends money or changes a
 * vote count goes through the `awards-vote` Edge Function, which does all the
 * pricing, validation and payment confirmation server-side — the browser never
 * sends an amount and can never mark a vote paid.
 *
 * Every response is still parsed through Zod, so a drift between this file and
 * the database/function fails loudly here instead of rendering `undefined`.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { isSupabaseConfigured, supabase } from './supabaseClient';

// The award_* tables aren't in the hand-written `Database` type in
// supabaseClient.ts, so use the untyped view of the same client here. The Zod
// schemas below are the contract instead.
const db = supabase as unknown as SupabaseClient;

const PUBLIC_STATUSES = ['SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED'];

export const CampaignStatusSchema = z.enum(['DRAFT', 'SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED', 'ARCHIVED']);

export const PublicCampaignSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  status: CampaignStatusSchema,
  currency: z.string().length(3),
  startsAt: z.string().datetime().nullable(),
  endsAt: z.string().datetime().nullable(),
  timezone: z.string().min(1),
  votingOpen: z.boolean(),
  voteUnitPrice: z.number().positive(),
  maxQuantityPerTransaction: z.number().int().positive(),
  maxTransactionAmount: z.number().positive(),
  showResults: z.boolean(),
  coverImageUrl: z.string().url().nullable(),
});
export type PublicCampaign = z.infer<typeof PublicCampaignSchema>;

export const PublicCategorySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  imageUrl: z.string().url().nullable(),
});
export type PublicCategory = z.infer<typeof PublicCategorySchema>;

export const PublicContestantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  fullName: z.string().min(1),
  bio: z.string().nullable(),
  photoUrl: z.string().url().nullable(),
  code: z.string().nullable(),
  categories: z.array(PublicCategorySchema),
});
export type PublicContestant = z.infer<typeof PublicContestantSchema>;

const VoteIntentSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string().uuid(),
  categoryId: z.string().uuid(),
  contestantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: z.enum(['PENDING_PAYMENT', 'PAYMENT_SUCCESS']),
  createdAt: z.string().datetime(),
});

const CreateVoteIntentResponseSchema = z.object({
  voteIntent: VoteIntentSchema,
  nextStep: z.literal('INITIALIZE_PAYMENT'),
});
export type CreateVoteIntentResponse = z.infer<typeof CreateVoteIntentResponseSchema>;

export interface CreateVoteIntentInput {
  categoryId: string;
  contestantId: string;
  quantity: number;
  phoneNumber: string;
  idempotencyKey?: string;
}

const PaymentSchema = z.object({
  id: z.string().uuid(),
  voteIntentId: z.string().uuid(),
  provider: z.enum(['simulated', 'paystack']),
  status: z.literal('INITIALIZED'),
  amount: z.number().positive(),
  currency: z.string().length(3),
  createdAt: z.string().datetime(),
});

const InitializePaymentResponseSchema = z.object({
  payment: PaymentSchema,
  redirectUrl: z.string().url(),
});
export type InitializePaymentResponse = z.infer<typeof InitializePaymentResponseSchema>;

const VotePaymentResultSchema = z.object({
  status: z.enum(['PENDING_PAYMENT', 'PAYMENT_SUCCESS', 'FAILED']),
  reference: z.string(),
  quantity: z.number().int().positive(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  simulated: z.boolean(),
  contestantName: z.string(),
  categoryName: z.string(),
  campaignName: z.string(),
  campaignSlug: z.string(),
});
export type VotePaymentResult = z.infer<typeof VotePaymentResultSchema>;

const ResultRowSchema = z.object({
  categoryId: z.string().uuid(),
  contestantId: z.string().uuid(),
  votes: z.number().int().nonnegative(),
});
export type ResultRow = z.infer<typeof ResultRowSchema>;

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new ApiError('NOT_CONFIGURED', 'Awards are not available on this deployment yet.', 503);
  }
}

/** PostgREST/network failures -> ApiError, so pages have one error type to handle. */
function fail(error: { message: string }): never {
  console.error('[votingApi]', error.message);
  throw new ApiError('INTERNAL_ERROR', 'Something went wrong. Please try again.', 500);
}

const iso = (value: string | null): string | null => (value ? new Date(value).toISOString() : null);

function votingOpen(row: { status: string; starts_at: string | null; ends_at: string | null }): boolean {
  const now = Date.now();
  return (
    row.status === 'OPEN' &&
    (!row.starts_at || now >= Date.parse(row.starts_at)) &&
    (!row.ends_at || now < Date.parse(row.ends_at))
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapCampaign(row: any): PublicCampaign {
  return PublicCampaignSchema.parse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    currency: row.currency,
    startsAt: iso(row.starts_at),
    endsAt: iso(row.ends_at),
    timezone: row.timezone,
    votingOpen: votingOpen(row),
    voteUnitPrice: Number(row.vote_unit_price),
    maxQuantityPerTransaction: row.max_quantity_per_transaction,
    maxTransactionAmount: Number(row.max_transaction_amount),
    showResults: row.show_results,
    coverImageUrl: row.cover_image_url ?? null,
  });
}

function mapCategory(row: any): PublicCategory {
  return PublicCategorySchema.parse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    displayOrder: row.display_order,
    imageUrl: row.image_url ?? null,
  });
}

function mapContestant(row: any): PublicContestant {
  const links: any[] = row.award_contestant_categories ?? [];
  return PublicContestantSchema.parse({
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    bio: row.bio,
    photoUrl: row.photo_url,
    code: row.code ?? null,
    categories: links
      .map((link) => link.award_categories)
      .filter(Boolean)
      .map(mapCategory)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const CATEGORY_COLUMNS = 'id, slug, name, description, display_order, image_url';
const CONTESTANT_SELECT = `id, slug, full_name, bio, photo_url, code, award_contestant_categories(award_categories(${CATEGORY_COLUMNS}))`;

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------
export async function fetchCampaigns(): Promise<PublicCampaign[]> {
  assertConfigured();
  const { data, error } = await db
    .from('award_campaigns')
    .select('*')
    .in('status', PUBLIC_STATUSES)
    .order('created_at', { ascending: false });
  if (error) fail(error);
  return (data ?? []).map(mapCampaign);
}

export async function fetchCampaign(campaignSlug: string): Promise<PublicCampaign> {
  assertConfigured();
  const { data, error } = await db.from('award_campaigns').select('*').eq('slug', campaignSlug).maybeSingle();
  if (error) fail(error);
  if (!data) throw new ApiError('CAMPAIGN_NOT_FOUND', 'Campaign not found.', 404);
  return mapCampaign(data);
}

export async function fetchCategories(campaignSlug: string): Promise<PublicCategory[]> {
  assertConfigured();
  const { data, error } = await db
    .from('award_categories')
    .select(`${CATEGORY_COLUMNS}, award_campaigns!inner(slug)`)
    .eq('award_campaigns.slug', campaignSlug)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) fail(error);
  return (data ?? []).map(mapCategory);
}

export async function fetchCategory(campaignSlug: string, categorySlug: string): Promise<PublicCategory> {
  assertConfigured();
  const { data, error } = await db
    .from('award_categories')
    .select(`${CATEGORY_COLUMNS}, award_campaigns!inner(slug)`)
    .eq('award_campaigns.slug', campaignSlug)
    .eq('slug', categorySlug)
    .maybeSingle();
  if (error) fail(error);
  if (!data) throw new ApiError('CATEGORY_NOT_FOUND', 'Category not found.', 404);
  return mapCategory(data);
}

export async function fetchCategoryContestants(campaignSlug: string, categorySlug: string): Promise<PublicContestant[]> {
  const category = await fetchCategory(campaignSlug, categorySlug);
  const { data: links, error: linkError } = await db
    .from('award_contestant_categories')
    .select('contestant_id')
    .eq('category_id', category.id);
  if (linkError) fail(linkError);
  const ids = (links ?? []).map((l: { contestant_id: string }) => l.contestant_id);
  if (ids.length === 0) return [];

  const { data, error } = await db
    .from('award_contestants')
    .select(CONTESTANT_SELECT)
    .in('id', ids)
    .order('full_name', { ascending: true });
  if (error) fail(error);
  return (data ?? []).map(mapContestant);
}

export async function fetchContestant(campaignSlug: string, contestantSlug: string): Promise<PublicContestant> {
  assertConfigured();
  const { data, error } = await db
    .from('award_contestants')
    .select(`${CONTESTANT_SELECT}, award_campaigns!inner(slug)`)
    .eq('award_campaigns.slug', campaignSlug)
    .eq('slug', contestantSlug)
    .maybeSingle();
  if (error) fail(error);
  if (!data) throw new ApiError('CONTESTANT_NOT_FOUND', 'Nominee not found.', 404);
  return mapContestant(data);
}

/** Find a nominee by the short code printed on posters, e.g. "PA-03" (case-insensitive). */
export async function fetchContestantByCode(campaignSlug: string, code: string): Promise<PublicContestant> {
  assertConfigured();
  const wanted = code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{2,12}$/.test(wanted)) throw new ApiError('CONTESTANT_NOT_FOUND', 'That nominee code looks invalid.', 404);
  const { data, error } = await db
    .from('award_contestants')
    .select(`${CONTESTANT_SELECT}, award_campaigns!inner(slug)`)
    .eq('award_campaigns.slug', campaignSlug)
    .ilike('code', wanted)
    .maybeSingle();
  if (error) fail(error);
  if (!data) throw new ApiError('CONTESTANT_NOT_FOUND', `No nominee has the code ${wanted}.`, 404);
  return mapContestant(data);
}

/**
 * Vote totals per (category, nominee). The database only returns rows when the
 * campaign has "show results" switched on (admins always can); otherwise this
 * throws a 403 and callers should simply not render counts.
 */
export async function fetchResults(campaignId: string): Promise<ResultRow[]> {
  assertConfigured();
  const { data, error } = await db.rpc('award_results', { p_campaign_id: campaignId });
  if (error) {
    if (error.code === '42501') throw new ApiError('RESULTS_HIDDEN', 'Results are not public for this campaign.', 403);
    fail(error);
  }
  return (data ?? []).map((row: { category_id: string; contestant_id: string; votes: number | string }) =>
    ResultRowSchema.parse({ categoryId: row.category_id, contestantId: row.contestant_id, votes: Number(row.votes) }),
  );
}

// ---------------------------------------------------------------------------
// Voting (server-side, via the awards-vote Edge Function)
// ---------------------------------------------------------------------------
async function callVoteFunction<T>(body: Record<string, unknown>, schema: z.ZodType<T>): Promise<T> {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('awards-vote', { body });

  if (error) {
    const response = (error as { context?: Response }).context;
    if (response && typeof response.json === 'function') {
      const payload = (await response.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
      if (payload?.error?.message) {
        throw new ApiError(payload.error.code ?? 'INTERNAL_ERROR', payload.error.message, response.status);
      }
      throw new ApiError('INTERNAL_ERROR', 'Something went wrong. Please try again.', response.status);
    }
    throw new ApiError('NETWORK_ERROR', 'Could not reach the voting service. Check your connection.', 0);
  }

  return schema.parse(data);
}

/** Note what this does NOT send: an amount. The server prices the order; the UI's running total is only a preview. */
export async function createVoteIntent(campaignSlug: string, input: CreateVoteIntentInput): Promise<CreateVoteIntentResponse> {
  return callVoteFunction({ action: 'create-intent', campaignSlug, ...input }, CreateVoteIntentResponseSchema);
}

export async function initializePayment(voteIntentId: string): Promise<InitializePaymentResponse> {
  return callVoteFunction({ action: 'initialize-payment', voteIntentId }, InitializePaymentResponseSchema);
}

/** Ask the server for the real state of a payment (and, in test mode / after Paystack, to confirm it). */
export async function verifyVotePayment(reference: string): Promise<VotePaymentResult> {
  return callVoteFunction({ action: 'verify-payment', reference }, VotePaymentResultSchema);
}
