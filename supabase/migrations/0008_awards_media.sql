-- Presentation fields for awards: a campaign cover/poster, category artwork,
-- and a short nominee code (e.g. "PA-03") so voters can find a nominee quickly.
alter table public.award_campaigns add column cover_image_url text;
alter table public.award_categories add column image_url text;
alter table public.award_contestants add column code text
  check (code is null or code ~ '^[A-Za-z0-9-]{2,12}$');

-- One code per nominee within a campaign (case-insensitive).
create unique index award_contestants_code_idx
  on public.award_contestants (campaign_id, upper(code))
  where code is not null;
