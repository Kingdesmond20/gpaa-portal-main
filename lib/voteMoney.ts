/**
 * Pesewa-integer money arithmetic — a direct port of
 * gpaa-voting-platform's packages/money/src/money.ts. gpaa-website is a
 * separate, standalone project (its own package.json, no shared pnpm
 * workspace with the voting platform), so this is vendored rather than
 * imported; keep it in lockstep with that file by hand if the pricing
 * rule ever changes there.
 *
 * Business rule: amount = quantity × campaign.voteUnitPrice, computed on
 * integer minor units (pesewas), never on floating-point cedis — so
 * quantity × price can never drift by a cent. 1 GHS = 100 pesewas.
 */

export type Pesewas = number & { readonly __brand: 'Pesewas' };

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoneyError';
  }
}

function assertSafeInteger(value: number, context: string): void {
  if (!Number.isInteger(value)) {
    throw new MoneyError(`${context} must be an integer number of pesewas, got ${value}`);
  }
  if (!Number.isSafeInteger(value)) {
    throw new MoneyError(`${context} exceeds the safe integer range`);
  }
}

export function cedisNumberToPesewas(cedis: number): Pesewas {
  const value = Math.round(cedis * 100);
  assertSafeInteger(value, 'cedisNumberToPesewas()');
  return value as Pesewas;
}

export function pesewasToCedisString(amount: Pesewas): string {
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const whole = Math.floor(abs / 100);
  const fraction = abs % 100;
  return `${negative ? '-' : ''}${whole}.${fraction.toString().padStart(2, '0')}`;
}

export function formatGHS(amount: Pesewas): string {
  return `GHS ${pesewasToCedisString(amount)}`;
}

export function formatCedis(cedis: number): string {
  return formatGHS(cedisNumberToPesewas(cedis));
}

export function calculateVoteAmountPesewas(unitPricePesewas: Pesewas, quantity: number): Pesewas {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new MoneyError(`quantity must be a positive integer, got ${quantity}`);
  }
  if (unitPricePesewas <= 0) {
    throw new MoneyError(`unitPricePesewas must be positive, got ${unitPricePesewas}`);
  }
  const amount = unitPricePesewas * quantity;
  assertSafeInteger(amount, 'calculateVoteAmountPesewas() result');
  return amount as Pesewas;
}

/**
 * The most votes one transaction can buy: the lower of the campaign's
 * per-transaction quantity cap and what fits under its amount cap — the same
 * two checks awards-vote's create-intent applies, in pesewas so the division
 * can't drift. Returns at least 1 so the form always has a usable range.
 */
export function maxVotesPerTransaction(
  unitPriceCedis: number,
  maxQuantity: number,
  maxTransactionAmountCedis: number,
): number {
  const unit = cedisNumberToPesewas(unitPriceCedis);
  const byAmount = unit > 0 ? Math.floor(cedisNumberToPesewas(maxTransactionAmountCedis) / unit) : maxQuantity;
  return Math.max(1, Math.min(maxQuantity, byAmount));
}

/**
 * Preview of what the server will charge. Returns null for a quantity the
 * server would reject anyway, so the caller can simply not render a total.
 * The authoritative amount is always whatever the API itself returns (R3)
 * — this exists only so the form can show a running total without a
 * round-trip.
 */
export function previewTotal(unitPriceCedis: number, quantity: number): string | null {
  if (!Number.isInteger(quantity) || quantity < 1) return null;
  try {
    return formatGHS(calculateVoteAmountPesewas(cedisNumberToPesewas(unitPriceCedis), quantity));
  } catch {
    return null;
  }
}
