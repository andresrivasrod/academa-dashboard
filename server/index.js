// server/index.js
// Proxy combinado: Backend Academa + Mux (free tier)
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import fetch from "node-fetch"; // si usas Node 18+, puedes quitar esto y usar global fetch

const app = express();
const PORT = process.env.PORT || 4000;

// ====== CORS global (para que el frontend hable solo con :4000) ======
app.use(cors());

// ====== PROXY al BACKEND (montado ANTES de cualquier body parser) ======
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: "http://34.10.68.32:3000", // tu backend real
    changeOrigin: true,
    xfwd: true,
    logLevel: "debug",
    proxyTimeout: 15000,
    onError(err, req, res) {
      console.error("[Proxy Backend] Error:", err?.message);
      if (!res.headersSent) res.status(502).send("Bad Gateway");
    },
  })
);

// (Opcional) logging simple para ver qué entra al proxy
app.use((req, _res, next) => {
  console.log(`[Mux/Local] ${req.method} ${req.url}`);
  next();
});

// ====== Endpoints Mux (free tier) ======
const BASE = "https://api.mux.com/data/v1";
const TOKEN_ID = process.env.MUX_TOKEN_ID;
const TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

if (!TOKEN_ID || !TOKEN_SECRET) {
  console.warn("⚠️  MUX_TOKEN_ID/MUX_TOKEN_SECRET no están definidos.");
}

const auth =
  TOKEN_ID && TOKEN_SECRET
    ? "Basic " + Buffer.from(`${TOKEN_ID}:${TOKEN_SECRET}`).toString("base64")
    : null;

async function muxGet(path, params = {}) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, vv));
    else if (v !== undefined) url.searchParams.append(k, v);
  });

  const res = await fetch(url.toString(), {
    headers: auth ? { Authorization: auth } : {},
  });
  if (!res.ok) {
    const body = await res.text();
    return { error: true, status: res.status, body };
  }
  return res.json();
}

// No ponemos app.use(express.json()) antes del proxy al backend.
// Para estos endpoints GET de Mux no lo necesitamos. Si en el futuro
// agregas POST locales, pon express.json() DESPUÉS del proxy del backend.

app.get("/metrics/views", async (req, res) => {
  const period = req.query.period || "30d";
  const muxPeriod = String(period).replace("d", ":days").replace("h", ":hours");
  const data = await muxGet("/video-views", { "timeframe[]": muxPeriod });
  res.json(data);
});

app.get("/metrics/top-assets", async (req, res) => {
  const period = req.query.period || "30d";
  const muxPeriod = String(period).replace("d", ":days").replace("h", ":hours");
  const limit = parseInt(req.query.limit || "10", 10);

  const data = await muxGet("/video-views", { "timeframe[]": muxPeriod });
  if (data.error) return res.json(data);

  const buckets = new Map();
  (data.data || []).forEach((row) => {
    const title = row.video_title || "Untitled";
    buckets.set(title, (buckets.get(title) || 0) + 1);
  });

  const top = Array.from(buckets.entries())
    .map(([title, views]) => ({ title, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  res.json({ status: "success", data: top });
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running on http://localhost:${PORT}`);
  console.log(`   ↳ /api/v1/*  → Backend (34.10.68.32:3000)`);
  console.log(`   ↳ /metrics/* → Mux API`);
});
