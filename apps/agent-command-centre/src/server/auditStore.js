import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), ".runtime");
const LEDGER_PATH = path.join(DATA_DIR, "action-ledger.json");

const state = {
  controls: {
    autoExecution: true,
    killSwitch: false,
    circuitOpen: false,
    failureCount: 0
  },
  actions: [],
  snapshots: []
};

async function persist() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LEDGER_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function initAuditStore() {
  try {
    const raw = await fs.readFile(LEDGER_PATH, "utf8");
    const parsed = JSON.parse(raw);
    state.controls = { ...state.controls, ...(parsed.controls || {}) };
    state.actions = Array.isArray(parsed.actions) ? parsed.actions : [];
    state.snapshots = Array.isArray(parsed.snapshots) ? parsed.snapshots : [];
  } catch {
    await persist();
  }
}

export function getControls() {
  return state.controls;
}

export async function updateControls(patch) {
  state.controls = { ...state.controls, ...patch };
  await persist();
  return state.controls;
}

export async function openCircuit(reason) {
  state.controls.circuitOpen = true;
  state.controls.lastCircuitReason = reason;
  await persist();
}

export async function resetCircuit() {
  state.controls.circuitOpen = false;
  state.controls.failureCount = 0;
  state.controls.lastCircuitReason = null;
  await persist();
}

export async function increaseFailureCount() {
  state.controls.failureCount += 1;
  await persist();
  return state.controls.failureCount;
}

export async function appendAction(entry) {
  state.actions.unshift(entry);
  state.actions = state.actions.slice(0, 300);
  await persist();
}

export function listActions(limit = 100) {
  return state.actions.slice(0, limit);
}

export async function addSnapshot(snapshot) {
  state.snapshots.unshift(snapshot);
  state.snapshots = state.snapshots.slice(0, 1000);
  await persist();
}

export function listSnapshots(limit = 120) {
  return state.snapshots.slice(0, limit);
}
