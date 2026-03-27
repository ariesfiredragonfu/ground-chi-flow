#!/usr/bin/env node
/**
 * Quick test: send one message to the Grok bridge with the Coach system prompt.
 * Run from GroundChiFlow: node scripts/test-coach-bridge.mjs
 * Set GROK_BRIDGE_URL or EXPO_PUBLIC_GROK_BRIDGE_URL if needed (default https://grok.howell-forge.com).
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load prompt from AgentPrompt.ts (we need the string; simple regex extract)
const agentPath = join(root, 'constants', 'AgentPrompt.ts');
const agentSrc = readFileSync(agentPath, 'utf8');
const match = agentSrc.match(/HEALTH_AGENT_SYSTEM_PROMPT = `([\s\S]*?)`;/);
const systemPrompt = match ? match[1].replace(/\\`/g, '`') : 'You are a health coach.';

const bridgeUrl = process.env.GROK_BRIDGE_URL || process.env.EXPO_PUBLIC_GROK_BRIDGE_URL || 'https://grok.howell-forge.com';
const base = bridgeUrl.replace(/\/$/, '');
const endpoint = `${base}/ask`;

const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: 'Good morning! Where do I start?' },
];

console.log('Testing Coach bridge at', endpoint);
console.log('---');

try {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error('Bridge error:', data.error || res.statusText);
    process.exit(1);
  }

  const content = data.choices?.[0]?.message?.content;
  if (content) {
    console.log('Coach reply:');
    console.log(content);
    console.log('---');
    console.log('OK Coach bridge and Step 1 prompt responded.');
  } else {
    console.error('No reply in response:', JSON.stringify(data).slice(0, 200));
    process.exit(1);
  }
} catch (e) {
  console.error('Request failed:', e.message);
  process.exit(1);
}
