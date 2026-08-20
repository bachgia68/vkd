export const config = { runtime: 'nodejs' };

const CHANNEL_LABELS: Record<string, string> = {
  facebook: '📘 Facebook',
  instagram: '📸 Instagram',
  zalo: '💬 Zalo',
  tiktok: '🎵 TikTok',
  youtube: '▶️ YouTube',
  linkedin: '💼 LinkedIn',
};

export async function POST(req: Request): Promise<Response> {
  const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '').replace(/^﻿/, '');
  const CHAT_ID = (process.env.TELEGRAM_CHAT_ID ?? '').replace(/^﻿/, '');
  const body = await req.json() as { title?: string; captions?: Record<string, string> };
  const { title, captions } = body;

  if (!captions || typeof captions !== 'object') {
    return new Response(JSON.stringify({ error: 'captions required' }), { status: 400 });
  }

  const lines: string[] = [`📝 *${(title ?? 'Bài viết').replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')}*\n`];
  for (const [key, text] of Object.entries(captions)) {
    const label = CHANNEL_LABELS[key] ?? key;
    lines.push(`${label}:\n${text}\n`);
  }
  const message = lines.join('\n');

  const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message.slice(0, 4096), parse_mode: 'Markdown' }),
  });

  if (!tgRes.ok) {
    const err = await tgRes.text();
    return new Response(JSON.stringify({ error: err }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
