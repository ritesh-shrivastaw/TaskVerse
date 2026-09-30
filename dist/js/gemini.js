// Client-side helper. It calls OUR proxy (/api/gemini), never Google directly,
// so no key exists in browser code. Handles errors and a client-side cooldown.
let lastCall = 0;
const COOLDOWN_MS = 2000;

export async function askGemini(prompt, { json = false } = {}) {
  const wait = COOLDOWN_MS - (Date.now() - lastCall);
  if (wait > 0) throw new Error(`Please wait ${Math.ceil(wait / 1000)}s before the next request.`);
  lastCall = Date.now();

  let res;
  try {
    res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, json })
    });
  } catch {
    throw new Error('Network error. Is the server running?');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) throw new Error('Rate limit reached. Wait a minute and try again.');
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  if (!json) return data.text;
  try {
    return JSON.parse(data.text.replace(/```json|```/g, '').trim());
  } catch {
    throw new Error('The AI returned malformed JSON. Try again.');
  }
}