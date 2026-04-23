import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import {
  initAuditStore,
  getControls,
  updateControls,
  appendAction,
  listActions,
  addSnapshot,
  listSnapshots,
  increaseFailureCount,
  openCircuit,
  resetCircuit
} from "./src/server/auditStore.js";
import { enqueue, processQueue, size as queueSize } from "./src/server/actionQueue.js";
import {
  generateAutonomousActions,
  validateAction,
  executeAction
} from "./src/server/commandEngine.js";
import { getSpApiConfigStatus, getMarketplaceSnapshot } from "./src/server/spapiClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKY_RADIANT_SYSTEM_PROMPT =
  "You are the Sky Radiant India Amazon Seller Agent — expert advisor for a white-label Amazon.in seller. Sky Radiant buys products from Indian suppliers, brands them under Sky Radiant, and sells on Amazon.in and other platforms (Flipkart, Nykaa, Meesho, JioMart). Strategy: WHITE LABEL only · Under 3% return rate target · Repeat buyers priority · 35%+ net margin. Portfolio: ₹26L monthly revenue · 38% margin · 2.1% return rate · 72% repeat rate · ₹3.1Cr annual target. Be sharp, India-specific, practical. Use ₹. Max 4 paragraphs.";

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));

function requireOwner(req, res, next) {
  if (!process.env.COMMAND_CENTRE_OWNER_TOKEN) {
    return next();
  }
  const token = req.headers["x-owner-token"];
  if (token !== process.env.COMMAND_CENTRE_OWNER_TOKEN) {
    return res.status(403).json({ error: "Forbidden. Missing valid owner token." });
  }
  return next();
}

function createLedger(action, patch) {
  return {
    id: action.id,
    type: action.type,
    payload: action.payload,
    confidence: action.confidence,
    status: patch.status,
    note: patch.note || null,
    externalId: patch.externalId || null,
    error: patch.error || null,
    createdAt: action.createdAt,
    updatedAt: new Date().toISOString()
  };
}

async function executeWithGuardrails(action) {
  const controls = getControls();
  if (controls.killSwitch) {
    await appendAction(createLedger(action, { status: "BLOCKED", note: "Kill switch active." }));
    return;
  }
  if (controls.circuitOpen) {
    await appendAction(createLedger(action, { status: "BLOCKED", note: "Circuit breaker active." }));
    return;
  }

  const policy = validateAction(action);
  if (!policy.ok) {
    await appendAction(createLedger(action, { status: "REJECTED", error: policy.reason }));
    return;
  }

  try {
    const result = await executeAction(action);
    await appendAction(createLedger(action, { status: result.status, note: result.message, externalId: result.externalId }));
    await resetCircuit();
  } catch (error) {
    const failures = await increaseFailureCount();
    if (failures >= 3) {
      await openCircuit("3 consecutive execution failures.");
    }
    await appendAction(createLedger(action, { status: "FAILED", error: error.message }));
  }
}

app.get("/api/system/status", async (_, res) => {
  const snapshot = await getMarketplaceSnapshot();
  await addSnapshot(snapshot);
  return res.json({
    controls: getControls(),
    queueSize: queueSize(),
    spApi: getSpApiConfigStatus(),
    latestSnapshot: snapshot
  });
});

app.post("/api/system/controls", requireOwner, async (req, res) => {
  const { autoExecution, killSwitch, circuitOpen } = req.body || {};
  const controls = await updateControls({
    ...(typeof autoExecution === "boolean" ? { autoExecution } : {}),
    ...(typeof killSwitch === "boolean" ? { killSwitch } : {}),
    ...(typeof circuitOpen === "boolean" ? { circuitOpen } : {})
  });
  return res.json({ controls });
});

app.get("/api/commands/feed", (_, res) => {
  return res.json({
    actions: listActions(120),
    snapshots: listSnapshots(120),
    controls: getControls(),
    queueSize: queueSize()
  });
});

app.post("/api/commands/run-cycle", requireOwner, async (_, res) => {
  try {
    const controls = getControls();
    const cycle = await generateAutonomousActions();
    await addSnapshot(cycle.snapshot);

    cycle.actions.forEach((item) => enqueue(item));
    if (controls.autoExecution) {
      await processQueue(executeWithGuardrails);
    }

    return res.json({
      enqueued: cycle.actions.length,
      controls: getControls(),
      queueSize: queueSize(),
      snapshot: cycle.snapshot
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai", async (req, res) => {
  try {
    const { messages = [], systemPrompt } = req.body || {};

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY in .env" });
    }

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt || SKY_RADIANT_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.5
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: "Groq request failed", details: errorText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "No response generated.";

    return res.json({ content, raw: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
});

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

initAuditStore().then(() => {
  setInterval(async () => {
    const controls = getControls();
    if (!controls.autoExecution || controls.killSwitch || controls.circuitOpen) {
      return;
    }
    const cycle = await generateAutonomousActions();
    await addSnapshot(cycle.snapshot);
    cycle.actions.forEach((actionItem) => enqueue(actionItem));
    await processQueue(executeWithGuardrails);
  }, Number(process.env.COMMAND_CYCLE_MS || 30000));

  app.listen(PORT, () => {
    console.log(`Sky Radiant Command Centre running on port ${PORT}`);
  });
});
