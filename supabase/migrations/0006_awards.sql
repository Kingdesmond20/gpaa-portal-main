-- Awards & public voting, built on Supabase (replaces the never-deployed
-- gpaa-voting-platform API as the backend for the /awards pages).
--
-- Model: campaign -> categories -> contestants (many-to-many with categories).
-- A vote is bought through an ORDER: quantity x unit price, priced on the
-- server, stored against a peppered phone hash (never the number), and counted
-- only once its payment is confirmed server-side. Orders are written solely by
-- the awards-vote Edge Function (service role); browsers can never insert,
-- update or mark an order paid.

-- ---------------------------------------------------------------------------
-- Campaigns
-- ---------------------------------------------------------------------------
create table public.award_campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text,
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED', 'ARCHIVED')),
  currency text not null default 'GHS' check (char_length(currency) = 3),
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text not null default 'Africa/Accra',
  vote_unit_price numeric(12, 2) not null check (vote_unit_price > 0),
  max_quantity_per_transaction integer not null default 100 check (max_quantity_per_transaction > 0),
  max_transaction_amount numeric(12, 2) not null default 1000 check (max_transaction_amount > 0),
  -- Vote counts are hidden from the public unless an admin turns this on.
  show_results boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create trigger award_campaigns_touch_updated_at
  before update on public.award_campaigns
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Categories, contestants, and their link table
-- ---------------------------------------------------------------------------
create table public.award_categories (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.award_campaigns (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (campaign_id, slug)
);

create table public.award_contestants (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.award_campaigns (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  full_name text not null,
  bio text,
  photo_url text,
  -- DISQUALIFIED contestants disappear from the public site and can't be voted for.
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'DISQUALIFIED')),
  created_at timestamptz not null default now(),
  unique (campaign_id, slug)
);

create table public.award_contestant_categories (
  contestant_id uuid not null references public.award_contestants (id) on delete cascade,
  category_id uuid not null references public.award_categories (id) on delete cascade,
  primary key (contestant_id, category_id)
);

create index award_categories_campaign_idx on public.award_categories (campaign_id, display_order);
create index award_contestants_campaign_idx on public.award_contestants (campaign_id);
create index award_contestant_categories_category_idx on public.award_contestant_categories (category_id);

-- ---------------------------------------------------------------------------
-- Vote orders (server-written only)
-- ---------------------------------------------------------------------------
create table public.award_vote_orders (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.award_campaigns (id),
  category_id uuid not null references public.award_categories (id),
  contestant_id uuid not null references public.award_contestants (id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price > 0),
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null,
  -- HMAC-SHA256(pepper, normalised phone). The number itself is never stored.
  phone_hash text not null,
  status text not null default 'PENDING_PAYMENT'
    check (status in ('PENDING_PAYMENT', 'PAYMENT_SUCCESS', 'FAILED')),
  payment_reference text not null unique,
  idempotency_key text,
  -- True for votes confirmed by the test-mode PAYMENT_MODE=simulated switch.
  is_simulated boolean not null default false,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  unique (campaign_id, idempotency_key)
);

create index award_vote_orders_tally_idx
  on public.award_vote_orders (campaign_id, contestant_id, category_id)
  where status = 'PAYMENT_SUCCESS';
create index award_vote_orders_phone_idx on public.award_vote_orders (phone_hash, created_at);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.award_campaigns enable row level security;
alter table public.award_categories enable row level security;
alter table public.award_contestants enable row level security;
alter table public.award_contestant_categories enable row level security;
alter table public.award_vote_orders enable row level security;

-- Public can read everything about a campaign once it is out of DRAFT and not
-- ARCHIVED. Admins can read and write all of it.
create policy "Published campaigns are public"
  on public.award_campaigns for select
  using (status in ('SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED') or public.is_admin());
create policy "Admins manage campaigns"
  on public.award_campaigns for all
  using (public.is_admin()) with check (public.is_admin());

create policy "Categories of published campaigns are public"
  on public.award_categories for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.award_campaigns c
      where c.id = award_categories.campaign_id
        and c.status in ('SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED')
    )
  );
create policy "Admins manage categories"
  on public.award_categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy "Active contestants of published campaigns are public"
  on public.award_contestants for select
  using (
    public.is_admin()
    or (
      status = 'ACTIVE'
      and exists (
        select 1 from public.award_campaigns c
        where c.id = award_contestants.campaign_id
          and c.status in ('SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED')
      )
    )
  );
create policy "Admins manage contestants"
  on public.award_contestants for all
  using (public.is_admin()) with check (public.is_admin());

create policy "Contestant category links follow contestant visibility"
  on public.award_contestant_categories for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.award_contestants ct
      where ct.id = award_contestant_categories.contestant_id
        and ct.status = 'ACTIVE'
        and exists (
          select 1 from public.award_campaigns c
          where c.id = ct.campaign_id
            and c.status in ('SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED')
        )
    )
  );
create policy "Admins manage contestant category links"
  on public.award_contestant_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Orders: admins may read them. Nobody writes them from a browser.
create policy "Admins read vote orders"
  on public.award_vote_orders for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Table privileges (see 0005: Supabase's defaults are far too broad)
-- ---------------------------------------------------------------------------
revoke all on public.award_campaigns from anon, authenticated;
revoke all on public.award_categories from anon, authenticated;
revoke all on public.award_contestants from anon, authenticated;
revoke all on public.award_contestant_categories from anon, authenticated;
revoke all on public.award_vote_orders from anon, authenticated;

grant select on public.award_campaigns, public.award_categories,
  public.award_contestants, public.award_contestant_categories to anon;
-- Writes are gated by the is_admin() policies above.
grant select, insert, update, delete on public.award_campaigns, public.award_categories,
  public.award_contestants, public.award_contestant_categories to authenticated;
grant select on public.award_vote_orders to authenticated;

-- ---------------------------------------------------------------------------
-- Results. Counts come only from PAYMENT_SUCCESS orders. Public callers get
-- them only when the campaign has show_results on; admins always do.
-- ---------------------------------------------------------------------------
create or replace function public.award_results(p_campaign_id uuid)
returns table (category_id uuid, contestant_id uuid, votes bigint)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not (
    public.is_admin()
    or exists (
      select 1 from public.award_campaigns c
      where c.id = p_campaign_id
        and c.show_results
        and c.status in ('OPEN', 'PAUSED', 'CLOSED')
    )
  ) then
    raise exception 'Results are not available for this campaign' using errcode = '42501';
  end if;

  return query
    select o.category_id, o.contestant_id, sum(o.quantity)::bigint
    from public.award_vote_orders o
    join public.award_contestants ct on ct.id = o.contestant_id and ct.status = 'ACTIVE'
    where o.campaign_id = p_campaign_id and o.status = 'PAYMENT_SUCCESS'
    group by o.category_id, o.contestant_id;
end;
$$;

-- Admin-only headline numbers for the dashboard.
create or replace function public.award_campaign_stats(p_campaign_id uuid)
returns table (
  total_orders bigint,
  paid_orders bigint,
  votes bigint,
  revenue numeric,
  simulated_votes bigint
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only' using errcode = '42501';
  end if;

  return query
    select
      count(*)::bigint,
      count(*) filter (where o.status = 'PAYMENT_SUCCESS')::bigint,
      coalesce(sum(o.quantity) filter (where o.status = 'PAYMENT_SUCCESS'), 0)::bigint,
      coalesce(sum(o.amount) filter (where o.status = 'PAYMENT_SUCCESS' and not o.is_simulated), 0),
      coalesce(sum(o.quantity) filter (where o.status = 'PAYMENT_SUCCESS' and o.is_simulated), 0)::bigint
    from public.award_vote_orders o
    where o.campaign_id = p_campaign_id;
end;
$$;

revoke execute on function public.award_results(uuid) from public;
revoke execute on function public.award_campaign_stats(uuid) from public;
grant execute on function public.award_results(uuid) to anon, authenticated;
grant execute on function public.award_campaign_stats(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Nominee photos: public read, admin-only write.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('award-photos', 'award-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Award photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'award-photos');

create policy "Admins manage award photos"
  on storage.objects for all
  using (bucket_id = 'award-photos' and public.is_admin())
  with check (bucket_id = 'award-photos' and public.is_admin());
