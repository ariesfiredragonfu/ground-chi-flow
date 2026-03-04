/**
 * Parse pasted or typed lab result text into biomarker key-value pairs
 * using the Grok bridge. Used by Blood Work "Paste lab results" flow.
 */

import { sendToAgent } from './grokBridge';
import { LAB_EXTRACT_SYSTEM_PROMPT } from '../constants/AgentPrompt';

const BIOMARKER_KEYS = ['hrv', 'homocysteine', 'b12', 'folate', 'vitaminD', 'omega3', 'glucose'] as const;

export type BiomarkerKey = (typeof BIOMARKER_KEYS)[number];

export interface ParsedLabResult {
  key: BiomarkerKey;
  value: number;
  date?: string;
}

/**
 * Send lab text to the agent; returns parsed biomarkers or throws.
 */
export async function parseLabText(text: string): Promise<ParsedLabResult[]> {
  const reply = await sendToAgent([
    { role: 'system', content: LAB_EXTRACT_SYSTEM_PROMPT },
    { role: 'user', content: `Extract biomarker values from this lab text:\n\n${text.trim()}` },
  ]);

  // Strip optional markdown code block
  let raw = reply.trim();
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) raw = jsonMatch[1].trim();

  let data: Record<string, number | null> & { date?: string };
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Could not parse lab results. Try listing values clearly, e.g. "glucose 92, vitamin D 45".');
  }

  const date = typeof data.date === 'string' ? data.date : new Date().toISOString().slice(0, 10);
  const results: ParsedLabResult[] = [];

  for (const key of BIOMARKER_KEYS) {
    const v = data[key];
    if (v != null && typeof v === 'number' && !Number.isNaN(v)) {
      results.push({ key, value: v, date });
    }
  }

  return results;
}
