import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import path from 'path';
import { readFileSync } from 'fs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Cache data across invocations
let LABELS: string[] | null = null;

function loadLabels(): string[] {
  if (LABELS) return LABELS;
  const impactPath = path.resolve(process.cwd(), 'src/data/impact_factors.json');
  const impacts = JSON.parse(readFileSync(impactPath, 'utf8')) as Array<{ label: string }>;
  LABELS = impacts.map((x) => x.label);
  return LABELS;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { text } = req.body ?? {};
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'text required' });
      return;
    }
    const labels = loadLabels();
    const rsp = await (client.responses.create as any)({
      model: process.env.OPENAI_MODEL_CLASSIFY || 'gpt-4o-mini',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'DeviceClass',
          strict: true,
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
        },
      },
      input: [
        { role: 'system', content: 'Classify the device into exactly one allowed label. If ambiguous, choose the closest. Output JSON only.' },
        { role: 'user', content: text },
      ],
    });

    const output = (rsp && (rsp as any).output_text) as string | undefined;
    if (!output) return res.status(500).json({ error: 'no output' });
    return res.status(200).send(output);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
}

