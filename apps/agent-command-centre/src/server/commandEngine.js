import crypto from "crypto";
import { evaluateActionPolicy } from "./policyEngine.js";
import { getMarketplaceSnapshot } from "./spapiClient.js";

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function action(type, payload, confidence) {
  return {
    id: id("act"),
    type,
    payload,
    confidence,
    createdAt: new Date().toISOString()
  };
}

export async function generateAutonomousActions() {
  const snapshot = await getMarketplaceSnapshot();
  const actions = [];

  if (snapshot.lowStockSkus >= 4) {
    actions.push(
      action(
        "INVENTORY_ALERT",
        { lowStockSkus: snapshot.lowStockSkus, note: "Initiate replenishment for top 5 selling SKUs." },
        91
      )
    );
  }

  if (snapshot.buyBoxWinRate < 85) {
    actions.push(
      action(
        "PRICE_UPDATE",
        {
          deltaPercent: -1.8,
          projectedMarginPercent: 37.4,
          note: "Reduce price slightly on competing SKUs to recover buy-box share."
        },
        87
      )
    );
  }

  if (snapshot.returnRate > 2.2) {
    actions.push(
      action(
        "LISTING_UPDATE",
        {
          note: "Update usage instructions and add expectation-setting bullet in A+ section.",
          impactedSkus: 3
        },
        85
      )
    );
  }

  actions.push(
    action(
      "PPC_BUDGET_UPDATE",
      { deltaPercent: 8, note: "Shift spend to high-converting long-tail campaign clusters." },
      83
    )
  );

  return { snapshot, actions };
}

export function validateAction(actionItem) {
  const result = evaluateActionPolicy(actionItem);
  return { ...result, actionId: actionItem.id };
}

export async function executeAction(actionItem) {
  // Replace this simulated execution with specific SP-API write calls by action type.
  const accepted = Math.random() > 0.08;
  if (!accepted) {
    throw new Error(`Execution failed for ${actionItem.type} due to transient marketplace lock.`);
  }
  return {
    externalId: id("spapi"),
    status: "EXECUTED",
    message: `${actionItem.type} completed in Amazon command lane.`
  };
}
