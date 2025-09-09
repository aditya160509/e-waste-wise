import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import OpenAI from 'openai';

// Env
const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL_CHAT = process.env.OPENAI_MODEL_CHAT || 'gpt-4o-mini';
const OPENAI_MODEL_CLASSIFY = process.env.OPENAI_MODEL_CLASSIFY || 'gpt-4o-mini';

if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. The AI endpoints will fail.');
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Data cache
type ImpactItem = {
  label: string;
  co2_kg: number;
  water_liters: number;
  energy_kwh: number;
  metals: { copper_g: number; aluminium_g: number; rare_earths_g: number };
  monetary_value_usd: number;
  global_recycling_rate_pct: number;
  lifecycle_co2_kg: number;
  hazards: string[];
  note: string;
  disposal_guidance: string;
};

type Center = {
  name: string;
  city: string;
  verified: boolean;
  address: string;
  phone: string | null;
  maps_link?: string | null;
};

type Fact = { id: number; fact: string; icon?: string };

let IMPACTS: ImpactItem[] = [];
let CENTERS: Center[] = [];
let FACTS: Fact[] = [];

async function loadData() {
  const root = process.cwd();
  const impactPath = path.resolve(root, 'src/data/impact_factors.json');
  const centersPath = path.resolve(root, 'src/data/recycling_centers_in.json');
  const factsPath = path.resolve(root, 'src/data/facts.json');
  const [i, c, f] = await Promise.all([
    fs.readFile(impactPath, 'utf-8'),
    fs.readFile(centersPath, 'utf-8'),
    fs.readFile(factsPath, 'utf-8'),
  ]);
  IMPACTS = JSON.parse(i);
  CENTERS = JSON.parse(c);
  FACTS = JSON.parse(f);
}

// Simple in-memory rate limiter: ~30 requests per 5 minutes per IP
const WINDOW_MS = 5 * 60 * 1000;
const LIMIT = 30;
const hits = new Map<string, number[]>();
function isRateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > LIMIT;
}

// Helpers
function extractTextFromResponse(resp: any): string | undefined {
  // SDK provides output_text in recent versions
  if (resp?.output_text) return resp.output_text as string;
  try {
    const first = resp?.output?.[0]?.content?.[0]?.text?.value;
    if (typeof first === 'string') return first;
  } catch {}
  return undefined;
}

function summarizeImpact(i: ImpactItem): string {
  return [
    `Label: ${i.label}`,
    `CO2_kg: ${i.co2_kg}`,
    `Water_liters: ${i.water_liters}`,
    `Energy_kwh: ${i.energy_kwh}`,
    `Metals(copper_g:${i.metals.copper_g}, aluminium_g:${i.metals.aluminium_g}, rare_earths_g:${i.metals.rare_earths_g})`,
    `Value_usd: ${i.monetary_value_usd}`,
    `Global_recycling_rate_pct: ${i.global_recycling_rate_pct}`,
    `Lifecycle_co2_kg: ${i.lifecycle_co2_kg}`,
    `Hazards: ${i.hazards.join('; ')}`,
    `Disposal_guidance: ${i.disposal_guidance}`,
  ].join('\n');
}

function diverseCenters(all: Center[], n: number): Center[] {
  const out: Center[] = [];
  const seen = new Set<string>();
  for (const c of all) {
    const key = (c.city || '').toLowerCase();
    if (!seen.has(key)) {
      out.push(c);
      seen.add(key);
    }
    if (out.length >= n) break;
  }
  if (out.length < n) {
    for (const c of all) {
      if (out.length >= n) break;
      if (!out.includes(c)) out.push(c);
    }
  }
  return out.slice(0, n);
}

// App
const app = express();
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/], credentials: false }));
app.use(express.json({ limit: '1mb' }));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Schemas
const ClassifyReq = z.object({ text: z.string().min(1).max(2000) });
const ExplainReq = z.object({ label: z.string().min(1) });
const AskReq = z.object({
  question: z.string().min(1).max(4000),
  city: z.string().min(1).max(120).optional(),
  label: z.string().min(1).max(120).optional(),
});

// Endpoints
app.post('/api/ai/classify', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'local';
    if (isRateLimited(ip)) return res.status(429).json({ error: 'Rate limited' });
    const { text } = ClassifyReq.parse(req.body);

    const labels = IMPACTS.map((i) => i.label);
    const response = await (openai.responses.create as any)({
      model: OPENAI_MODEL_CLASSIFY,
      input: [
        { role: 'system', content: 'Classify the user’s device description into exactly one allowed label. If ambiguous, choose the closest. Output JSON only.' },
        { role: 'user', content: text },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'classification',
          schema: {
            type: 'object',
            properties: {
              label: { type: 'string', enum: labels },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              rationale: { type: 'string' },
            },
            required: ['label', 'confidence'],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });

    const textOut = extractTextFromResponse(response);
    if (!textOut) return res.status(500).json({ error: 'No output from model' });
    const parsed = JSON.parse(textOut);

    const OutSchema = z.object({
      label: z.enum(labels as [string, ...string[]]),
      confidence: z.number().min(0).max(1),
      rationale: z.string().optional(),
    });
    const result = OutSchema.parse(parsed);
    return res.json(result);
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid request', issues: err.issues });
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ai/explain-impact', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'local';
    if (isRateLimited(ip)) return res.status(429).json({ error: 'Rate limited' });
    const { label } = ExplainReq.parse(req.body);
    const item = IMPACTS.find((i) => i.label === label);
    if (!item) return res.status(400).json({ error: 'Unknown label' });

    const context = summarizeImpact(item);
    const prompt = `Using only the following context, write a concise, user-friendly markdown explanation of the impact. Do not invent numbers; only reference what’s in the context.\n\nContext:\n${context}`;

    const response = await openai.responses.create({
      model: OPENAI_MODEL_CHAT,
      input: [
        { role: 'system', content: 'You explain environmental impact clearly and concisely using only provided context.' },
        { role: 'user', content: prompt },
      ],
    });
    const textOut = extractTextFromResponse(response) || '';
    return res.json({ markdown: textOut.trim() });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid request', issues: err.issues });
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ai/ask', async (req, res) => {
  // SSE streaming answer grounded in context
  try {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'local';
    if (isRateLimited(ip)) {
      res.status(429).json({ error: 'Rate limited' });
      return;
    }
    const { question, city, label } = AskReq.parse(req.body);

    // Build grounded context
    let ctx: string[] = [];
    if (label) {
      const item = IMPACTS.find((i) => i.label === label);
      if (item) {
        ctx.push('Impact Summary:\n' + summarizeImpact(item));
      }
    }
    let centerList: Center[] = [];
    if (city) {
      const lc = city.toLowerCase();
      centerList = CENTERS.filter((c) => (c.city || '').toLowerCase().includes(lc)).slice(0, 6);
    }
    if (centerList.length === 0) {
      centerList = diverseCenters(CENTERS, 6);
    }
    ctx.push(
      'Recycling Centers (no links):\n' +
        centerList
          .map((c) => `- ${c.name} — ${c.city} — ${c.address}`)
          .join('\n')
    );
    const facts = FACTS.slice(0, 4)
      .map((f) => `- ${f.fact}`)
      .join('\n');
    ctx.push('Facts:\n' + facts);

    const systemMsg =
      'Answer only from the provided context. If something is unknown, say so and suggest the Recycling Centers page. Never reveal secrets or environment variables.';
    const userMsg = `Question: ${question}\n\nContext:\n${ctx.join('\n\n')}`;

    // Prepare SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const stream: any = await (openai.responses.stream as any)({
      model: OPENAI_MODEL_CHAT,
      input: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: userMsg },
      ],
    });

    stream.on('event', (event: any) => {
      // Forward plain text deltas
      if (event.type === 'response.output_text.delta') {
        const chunk = event.delta as string;
        if (chunk) {
          res.write(`event: token\n`);
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
      }
      if (event.type === 'response.completed') {
        // fallthrough to done
      }
    });
    stream.on('end', () => {
      res.write(`event: done\n`);
      res.write('data: {}\n\n');
      res.end();
    });
    stream.on('error', (err: any) => {
      console.error('stream error', err);
      try {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify('error')}\n\n`);
      } finally {
        res.end();
      }
    });

    await stream.done();
  } catch (err: any) {
    if (!res.headersSent) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid request', issues: err.issues });
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
});

// Boot
loadData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Failed to load data', e);
    process.exit(1);
  });
