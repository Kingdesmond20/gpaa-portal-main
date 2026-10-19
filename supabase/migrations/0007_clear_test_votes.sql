-- Admin-only: remove the test-mode (PAYMENT_MODE=simulated) orders of a
-- campaign. Real, paid orders are never touched, so it is safe to run at
-- go-live and it lets a campaign that only has test votes be deleted.
create or replace function public.award_clear_test_votes(p_campaign_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  removed bigint;
begin
  if not public.is_admin() then
    raise exception 'Admins only' using errcode = '42501';
  end if;

  -- Test-mode orders only: ones confirmed in simulated mode, plus unpaid ones
  -- created with a sim_ reference. Real orders (gv_ references, is_simulated
  -- false) are never matched, whatever their status.
  delete from public.award_vote_orders
  where campaign_id = p_campaign_id
    and (is_simulated or payment_reference like 'sim\_%');
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke execute on function public.award_clear_test_votes(uuid) from public;
grant execute on function public.award_clear_test_votes(uuid) to authenticated;
