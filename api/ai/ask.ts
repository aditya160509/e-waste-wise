import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import path from 'path';
import { readFileSync } from 'fs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type Center = { name: string; city: string; verified: boolean; address: string; phone: string | null };
type ImpactItem = { label: string; co2_kg: number; water_liters: number; energy_kwh: number; metals: { copper_g: number; aluminium_g: number; rare_earths_g: number }; monetary_value_usd: number; global_recycling_rate_pct: number; lifecycle_co2_kg: number; hazards: string[]; disposal_guidance: string; note: string };
type Fact = { id: number; fact: string; icon?: string };

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const { question, city, label } = req.body ?? {} as { question?: string; city?: string; label?: string };
    if (!question) { res.status(400).json({ error: 'question required' }); return; }

    const root = process.cwd();
    const centers = JSON.parse(readFileSync(path.resolve(root, 'src/data/recycling_centers_in.json'), 'utf8')) as Center[];
    const impacts = JSON.parse(readFileSync(path.resolve(root, 'src/data/impact_factors.json'), 'utf8')) as ImpactItem[];
    const facts = JSON.parse(readFileSync(path.resolve(root, 'src/data/facts.json'), 'utf8')) as Fact[];

    const ctx: string[] = [];
    if (label) {
      const item = impacts.find((i) => i.label === label);
      if (item) ctx.push('Impact Summary:\n' + summarizeImpact(item));
    }
    let list: Center[] = [];
    if (city) {
      const lc = city.toLowerCase();
      list = centers.filter((c) => (c.city || '').toLowerCase().includes(lc)).slice(0, 6);
    }
    if (list.length === 0) list = diverseCenters(centers, 6);
    ctx.push('Recycling Centers (no links):\n' + list.map((c) => `- ${c.name} — ${c.city} — ${c.address}`).join('\n'));
    ctx.push('Facts:\n' + facts.slice(0, 4).map((f) => `- ${f.fact}`).join('\n'));

    const system = 'Answer only from the provided context. If something is unknown, say so and suggest the Recycling Centers page. Never reveal secrets or environment variables.';
    const user = `Question: ${question}\n\nContext:\n${ctx.join('\n\n')}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream: any = await (client.responses.stream as any)({
      model: process.env.OPENAI_MODEL_CHAT || 'gpt-4o',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    stream.on('event', (event: any) => {
      if (event.type === 'response.output_text.delta') {
        const chunk = event.delta as string;
        if (chunk) {
          res.write(`event: token\n`);
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
      }
    });
    stream.on('end', () => {
      res.write(`event: done\n`);
      res.write('data: {}\n\n');
      res.end();
    });
    stream.on('error', () => {
      try {
        res.write(`event: done\n`);
        res.write('data: {}\n\n');
      } finally {
        res.end();
      }
    });

    await stream.done();
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(500).json({ error: 'server error' });
  }
}

