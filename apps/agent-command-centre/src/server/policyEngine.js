const MAX_DAILY_PRICE_DELTA_PERCENT = Number(process.env.MAX_DAILY_PRICE_DELTA_PERCENT || 8);
const MIN_MARGIN_PERCENT = Number(process.env.MIN_MARGIN_PERCENT || 35);
const MAX_BUDGET_DELTA_PERCENT = Number(process.env.MAX_BUDGET_DELTA_PERCENT || 20);

function fail(reason) {
  return { ok: false, reason };
}

export function evaluateActionPolicy(action) {
  if (!action || !action.type) {
    return fail("Malformed action payload.");
  }

  if (action.type === "PRICE_UPDATE") {
    if (Math.abs(action.payload?.deltaPercent || 0) > MAX_DAILY_PRICE_DELTA_PERCENT) {
      return fail(`Price delta exceeds cap (${MAX_DAILY_PRICE_DELTA_PERCENT}%).`);
    }
    if ((action.payload?.projectedMarginPercent || 0) < MIN_MARGIN_PERCENT) {
      return fail(`Projected margin below floor (${MIN_MARGIN_PERCENT}%).`);
    }
  }

  if (action.type === "PPC_BUDGET_UPDATE") {
    if (Math.abs(action.payload?.deltaPercent || 0) > MAX_BUDGET_DELTA_PERCENT) {
      return fail(`Budget delta exceeds cap (${MAX_BUDGET_DELTA_PERCENT}%).`);
    }
  }

  return { ok: true };
}
