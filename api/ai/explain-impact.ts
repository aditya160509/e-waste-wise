import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import path from 'path';
import { readFileSync } from 'fs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  try {
    const { label } = req.body ?? {};
    if (!label || typeof label !== 'string') { res.status(400).json({ error: 'label required' }); return; }
    const impactPath = path.resolve(process.cwd(), 'src/data/impact_factors.json');
    const impacts = JSON.parse(readFileSync(impactPath, 'utf8')) as ImpactItem[];
    const item = impacts.find((i) => i.label === label);
    if (!item) { res.status(400).json({ error: 'unknown label' }); return; }

    const context = summarizeImpact(item);
    const prompt = `Using only the following context, write a concise, user-friendly markdown explanation of the impact. Do not invent numbers; only reference what’s in the context.\n\nContext:\n${context}`;

    const rsp = await client.responses.create({
      model: process.env.OPENAI_MODEL_CHAT || 'gpt-4o',
      input: [
        { role: 'system', content: 'You explain environmental impact clearly and concisely using only provided context.' },
        { role: 'user', content: prompt },
      ],
    });
    const text = (rsp as any).output_text as string | undefined;
    res.status(200).json({ markdown: (text || '').trim() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
}

