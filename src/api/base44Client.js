/**
 * Local "Base44-compatible" client (NO Base44 dependency).
 *
 * Why this exists:
 * - The original app used Base44 SDK (`base44.entities.*`, `base44.functions.invoke`, `base44.auth.me()`).
 * - To keep the UI/features the same while removing Base44, we provide a compatible client that:
 *   1) stores data in localStorage (works on StackBlitz immediately)
 *   2) can optionally use a real backend if VITE_API_URL is set (future-proof)
 *
 * You can later replace the REST calls in `http*` helpers with your own backend.
 */

const STORAGE_KEY = "lawyer_ai_intake_db_v1";
const USER_KEY = "lawyer_ai_intake_user_v1";

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return (globalThis.crypto?.randomUUID?.() || Math.random().toString(16).slice(2) + Date.now().toString(16));
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (!user.full_name && user.name) user.full_name = user.name;
      ensureFirmForUser(user);
      return user;
    }
  } catch {}
  return { Firm: [], Intake: [], EmailHistory: [], Message: [] };
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function ensureFirmForUser(user) {
  if (!user?.email) return null;
  const db = loadDb();
  db.Firm = db.Firm || [];
  let firm =
    db.Firm.find((f) => f.created_by === user.email) ||
    db.Firm.find((f) => Array.isArray(f.users) && f.users.includes(user.email));

  if (!firm) {
    firm = {
      id: uid(),
      name: "Demo Law Firm",
      slug: "demo-law-firm",
      logo_url: "",
      practice_areas: ["Family Law"],
      intro_text: "",
      notification_emails: [user.email],
      urgent_only_notifications: false,
      email_template: "",
      enabled_fields: {
        phone: true,
        timeline: true,
        deadline: true,
        budget: true,
        opposing_party: true,
        documents: true,
      },
      created_by: user.email,
      created_date: nowIso(),
      updated_date: nowIso(),
    };
    db.Firm.push(firm);
    saveDb(db);
  }
  return firm;
}


/** Optional backend support */
const API_BASE = import.meta.env.VITE_API_URL || "";

async function httpGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}
async function httpPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}
async function httpPatch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed`);
  return res.json();
}
async function httpDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(`DELETE ${path} failed`);
  return res.json();
}

function matchesWhere(row, where = {}) {
  return Object.entries(where).every(([k, v]) => row?.[k] === v);
}

function sortRows(rows, order) {
  if (!order) return rows;
  const desc = order.startsWith("-");
  const key = desc ? order.slice(1) : order;
  return [...rows].sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return (av > bv ? 1 : -1) * (desc ? -1 : 1);
  });
}

function entityApi(entityName) {
  return {
    async filter(where = {}, order) {
      // If you set VITE_API_URL, this will try your backend first.
      if (API_BASE) {
        const params = new URLSearchParams();
        Object.entries(where).forEach(([k, v]) => params.set(k, String(v)));
        if (order) params.set("order", order);
        return httpGet(`/api/${entityName}?${params.toString()}`);
      }

      const db = loadDb();
      const rows = (db[entityName] || []).filter((r) => matchesWhere(r, where));
      return sortRows(rows, order);
    },

    async get(id) {
      if (API_BASE) return httpGet(`/api/${entityName}/${id}`);
      const db = loadDb();
      return (db[entityName] || []).find((r) => r.id === id) || null;
    },

    async create(data) {
      if (API_BASE) return httpPost(`/api/${entityName}`, data);

      const db = loadDb();
      const row = { id: uid(), created_date: nowIso(), updated_date: nowIso(), ...data };
      db[entityName] = [row, ...(db[entityName] || [])];
      saveDb(db);
      return row;
    },

    async update(id, patch) {
      if (API_BASE) return httpPatch(`/api/${entityName}/${id}`, patch);

      const db = loadDb();
      const rows = db[entityName] || [];
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error(`${entityName}.update: not found`);
      rows[idx] = { ...rows[idx], ...patch, updated_date: nowIso() };
      db[entityName] = rows;
      saveDb(db);
      return rows[idx];
    },

    async delete(id) {
      if (API_BASE) return httpDelete(`/api/${entityName}/${id}`);

      const db = loadDb();
      db[entityName] = (db[entityName] || []).filter((r) => r.id !== id);
      saveDb(db);
      return { ok: true };
    },
  };
}

/**
 * Functions: these were Base44 server functions.
 * Here we provide safe local fallbacks so the UI continues to work.
 * You can wire these to your backend by setting VITE_API_URL and implementing /api/functions/*.
 */
const functions = {
  async invoke(name, payload) {
    if (API_BASE) {
      // Your backend should implement: POST /api/functions/:name
      const data = await httpPost(`/api/functions/${name}`, payload);
      return { data };
    }

    // Local fallbacks (minimal viable behavior)
    switch (name) {
      case "processIntake": {
        // Basic "AI-like" scoring heuristic (no external calls required)
        const { intake_id } = payload || {};
        const db = loadDb();
        const intake = (db.Intake || []).find((r) => r.id === intake_id);
        if (!intake) return { data: { ok: false } };

        const text = `${intake?.issue_summary || ""} ${intake?.notes || ""}`.toLowerCase();
        const urgentSignals = ["urgent", "court", "deadline", "eviction", "violence", "restraining", "police", "custody"];
        const score = urgentSignals.reduce((acc, w) => (text.includes(w) ? acc + 1 : acc), 0);

        const risk =
          score >= 3 ? "High" :
          score === 2 ? "Medium" :
          "Low";

        intake.ai_risk = risk;
        intake.ai_summary = intake.ai_summary || (intake.issue_summary ? `Summary: ${intake.issue_summary}` : "Summary: Intake received.");
        intake.updated_date = nowIso();

        db.Intake = db.Intake.map((r) => (r.id === intake_id ? intake : r));
        saveDb(db);

        return { data: { ok: true, risk, summary: intake.ai_summary } };
      }

      case "createCalendarEvent":
        return { data: { ok: true, calendar_event_id: uid() } };

      case "sendClientEmail": {
        // Save into EmailHistory locally for display
        const { intake_id, to, subject, body } = payload || {};
        const emailRow = await base44.entities.EmailHistory.create({
          intake_id,
          to,
          subject,
          body,
          status: "sent",
        });
        return { data: { ok: true, email_id: emailRow.id } };
      }

      case "notifyStatusChange":
        return { data: { ok: true } };

      case "autoFollowUp":
        return { data: { ok: true } };

      case "exportIntakes": {
        // Return CSV as string (client code usually downloads it)
        const { firm_id } = payload || {};
        const rows = await base44.entities.Intake.filter(firm_id ? { firm_id } : {}, "-created_date");
        const headers = Object.keys(rows[0] || { id: "" });
        const csv = [
          headers.join(","),
          ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
        ].join("\n");
        return { data: { ok: true, csv } };
      }

      case "ocrDocument":
        return { data: { ok: true, text: "" } };

      default:
        return { data: { ok: true } };
    }
  },
};

const auth = {
  async me() {
    // If backend auth exists, use it
    if (API_BASE) return httpGet("/api/auth/me");

    // Local demo user
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (!user.full_name && user.name) user.full_name = user.name;
      ensureFirmForUser(user);
      return user;
    }

    const user = {
      id: uid(),
      email: "demo@lawyerai.local",
      name: "Demo User",
      full_name: "Demo User",
      created_date: nowIso(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    ensureFirmForUser(user);
    return user;
  },

  async login({ email, name } = {}) {
    if (API_BASE) return httpPost("/api/auth/login", { email, name });
    const user = { id: uid(), email: email || "demo@lawyerai.local", name: name || "Demo User", full_name: name || "Demo User", created_date: nowIso() };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    ensureFirmForUser(user);
    return user;
  },

  logout(redirectPath = "/") {
    localStorage.removeItem(USER_KEY);
    // keep data by default; if you want wipe, also clear STORAGE_KEY
    if (redirectPath) window.location.assign(redirectPath);
  },
};



const integrations = {
  Core: {
    /**
     * Local replacement for Base44 UploadFile integration.
     * Returns a `file_url` as a data URL so it works on StackBlitz and persists.
     */
    async UploadFile({ file } = {}) {
      if (!file) throw new Error("No file provided");
      if (API_BASE) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: "POST",
          body: form,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Upload failed");
        return res.json(); // expected { file_url }
      }

      // Local: store as data URL (base64)
      const file_url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      return { file_url };
    },
  },
};
export const base44 = {
  entities: {
    Firm: entityApi("Firm"),
    Intake: entityApi("Intake"),
    EmailHistory: entityApi("EmailHistory"),
    Message: entityApi("Message"),
  },
  functions,
  auth,
  integrations,
};
