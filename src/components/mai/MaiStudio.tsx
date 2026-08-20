import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  Video, FileText, Clock, CheckCircle2,
  Send, ChevronLeft, Mic, RefreshCw, Eye,
  TrendingUp, Play, ThumbsUp, ThumbsDown,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

type ScriptStatus = 'draft' | 'generating' | 'ready' | 'approved' | 'posted' | 'rejected';

interface MaiScript {
  id: string;
  title: string;
  content: string;
  status: ScriptStatus;
  voice_url: string | null;
  video_url: string | null;
  created_at: string;
  scheduled_at: string | null;
  posted_at: string | null;
  platforms: string[];
  views: number;
  likes: number;
}

interface MaiJob {
  id: string;
  script_id: string;
  stage: 'voice' | 'video' | 'posting';
  progress: number;
  message: string | null;
  error: string | null;
}

type Screen = 'scripts' | 'edit' | 'generating' | 'review' | 'history';

const N8N_WEBHOOK = import.meta.env.VITE_N8N_MAI_WEBHOOK ?? '';
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const PLATFORMS = ['TikTok', 'Facebook', 'YouTube Shorts'];

const GEMINI_PROMPTS = [
  'Viết kịch bản TikTok 30 giây bán sâm Ngọc Linh TA cho KOL Mai, hook mạnh đầu video, kể chuyện thật, CTA inbox. Format: [Hook]\n[Story]\n[CTA]',
  'Viết kịch bản về lợi ích sức khỏe của sâm Ngọc Linh TA: tăng sức đề kháng, chống oxy hóa. Giọng chia sẻ tự nhiên, không quảng cáo lộ liễu.',
  'Viết kịch bản video quà tặng doanh nhân: sâm Ngọc Linh TA là quà tặng đẳng cấp nhất Việt Nam. Nhấn vào khan hiếm và uy tín.',
];

// ── Helpers ────────────────────────────────────────────────────────────────

function statusLabel(s: ScriptStatus) {
  return {
    draft: { text: 'Nháp', cls: 'bg-zinc-700 text-zinc-300' },
    generating: { text: 'Đang tạo...', cls: 'bg-amber-900 text-amber-300 animate-pulse' },
    ready: { text: 'Sẵn sàng duyệt', cls: 'bg-emerald-900 text-emerald-300' },
    approved: { text: 'Đã duyệt', cls: 'bg-sky-900 text-sky-300' },
    posted: { text: 'Đã đăng', cls: 'bg-violet-900 text-violet-300' },
    rejected: { text: 'Từ chối', cls: 'bg-red-900 text-red-400' },
  }[s];
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'vừa xong';
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

// ── MaiStudio ──────────────────────────────────────────────────────────────

export default function MaiStudio() {
  const [screen, setScreen] = useState<Screen>('scripts');
  const [scripts, setScripts] = useState<MaiScript[]>([]);
  const [selected, setSelected] = useState<MaiScript | null>(null);
  const [editContent, setEditContent] = useState('');
  const [job, setJob] = useState<MaiJob | null>(null);
  const [platforms, setPlatforms] = useState<string[]>(['TikTok', 'Facebook']);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Load scripts ──────────────────────────────────────────────────────

  async function loadScripts() {
    setLoading(true);
    const { data } = await supabase
      .from('mai_scripts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    if (data) setScripts(data as MaiScript[]);
    setLoading(false);
  }

  useEffect(() => { loadScripts(); }, []);

  // ── Realtime: watch generating job ───────────────────────────────────

  useEffect(() => {
    if (!selected || selected.status !== 'generating') return;

    const jobSub = supabase
      .channel(`mai_jobs_${selected.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'mai_jobs',
        filter: `script_id=eq.${selected.id}`,
      }, (payload) => {
        setJob(payload.new as MaiJob);
      })
      .subscribe();

    const scriptSub = supabase
      .channel(`mai_script_${selected.id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'mai_scripts',
        filter: `id=eq.${selected.id}`,
      }, (payload) => {
        const updated = payload.new as MaiScript;
        setSelected(updated);
        setScripts(prev => prev.map(s => s.id === updated.id ? updated : s));
        if (updated.status === 'ready') setScreen('review');
        if (updated.status === 'rejected' || updated.status === 'draft') setScreen('scripts');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jobSub);
      supabase.removeChannel(scriptSub);
    };
  }, [selected?.id, selected?.status]);

  // ── Actions ───────────────────────────────────────────────────────────

  function openScript(script: MaiScript) {
    setSelected(script);
    setEditContent(script.content);
    setError('');
    if (script.status === 'ready' || script.status === 'approved') {
      setScreen('review');
    } else if (script.status === 'generating') {
      setScreen('generating');
    } else {
      setScreen('edit');
    }
  }

  async function triggerGenerate() {
    if (!selected || !N8N_WEBHOOK) {
      setError('Chưa cấu hình N8N_MAI_WEBHOOK trong .env');
      return;
    }
    setTriggering(true);
    setError('');

    // Save edits first
    const { error: saveErr } = await supabase
      .from('mai_scripts')
      .update({ content: editContent, status: 'generating' })
      .eq('id', selected.id);

    if (saveErr) { setError(saveErr.message); setTriggering(false); return; }

    // Trigger n8n
    try {
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script_id: selected.id,
          text: editContent,
          platforms,
        }),
      });
      setSelected({ ...selected, content: editContent, status: 'generating' });
      setScreen('generating');
    } catch (e) {
      setError('Không kết nối được n8n webhook. Kiểm tra tunnel đang chạy?');
    }
    setTriggering(false);
  }

  async function approveVideo() {
    if (!selected) return;
    await supabase
      .from('mai_scripts')
      .update({ status: 'approved', platforms })
      .eq('id', selected.id);

    // Trigger posting workflow
    if (N8N_WEBHOOK) {
      fetch(N8N_WEBHOOK.replace('/generate', '/post'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script_id: selected.id, platforms }),
      }).catch(() => {});
    }
    setSelected({ ...selected, status: 'approved' });
    setScripts(prev => prev.map(s => s.id === selected.id ? { ...s, status: 'approved' } : s));
    setScreen('scripts');
    loadScripts();
  }

  async function rejectVideo() {
    if (!selected) return;
    await supabase
      .from('mai_scripts')
      .update({ status: 'rejected' })
      .eq('id', selected.id);
    setScreen('scripts');
    loadScripts();
  }

  const [geminiLoading, setGeminiLoading] = useState(false);

  async function generateWithGemini(promptIdx: number) {
    if (!GEMINI_KEY) {
      setError('Chưa có VITE_GEMINI_API_KEY trong .env');
      return;
    }
    setGeminiLoading(true);
    setError('');
    try {
      // Supports both AIza... (API key) and AQ... (OAuth token)
      const isOAuth = GEMINI_KEY.startsWith('AQ.');
      const url = isOAuth
        ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
        : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isOAuth) headers['Authorization'] = `Bearer ${GEMINI_KEY}`;

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ contents: [{ parts: [{ text: GEMINI_PROMPTS[promptIdx] }] }] }),
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      if (text) setEditContent(text);
      else setError(data?.error?.message ?? 'Gemini không trả về nội dung');
    } catch {
      setError('Lỗi kết nối Gemini API');
    }
    setGeminiLoading(false);
  }

  async function addScript() {
    const { data } = await supabase
      .from('mai_scripts')
      .insert({
        title: `Script ${new Date().toLocaleDateString('vi-VN')}`,
        content: '',
        status: 'draft',
        platforms: ['TikTok', 'Facebook'],
      })
      .select()
      .single();
    if (data) {
      setScripts(prev => [data as MaiScript, ...prev]);
      openScript(data as MaiScript);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col max-w-md mx-auto relative">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          {screen !== 'scripts' && (
            <button
              onClick={() => setScreen('scripts')}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                {screen === 'scripts' && '✨ Mai Studio'}
                {screen === 'edit' && '✍️ Kịch bản'}
                {screen === 'generating' && '⏳ Đang tạo video'}
                {screen === 'review' && '🎬 Duyệt video'}
                {screen === 'history' && '📊 Lịch sử'}
              </span>
            </div>
            {screen === 'scripts' && (
              <p className="text-xs text-zinc-500 mt-0.5">Chọn kịch bản để tạo video</p>
            )}
          </div>
          {screen === 'scripts' && (
            <button
              onClick={loadScripts}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto pb-20">

        {/* Script list */}
        {screen === 'scripts' && (
          <div className="p-4 space-y-3">
            <button
              onClick={addScript}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-orange-400 transition-colors"
            >
              <FileText size={18} />
              <span className="font-medium">Viết kịch bản mới</span>
            </button>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-28 rounded-xl bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : scripts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <Video size={40} className="mx-auto mb-3 opacity-30" />
                <p>Chưa có kịch bản nào</p>
                <p className="text-sm mt-1">n8n sẽ tự tạo mỗi ngày lúc 8h</p>
              </div>
            ) : (
              scripts.map(script => {
                const badge = statusLabel(script.status);
                return (
                  <button
                    key={script.id}
                    onClick={() => openScript(script)}
                    className="w-full text-left bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-semibold text-sm text-white leading-tight flex-1">
                        {script.title || 'Script không có tiêu đề'}
                      </span>
                      <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-2">
                      {script.content || <span className="italic text-zinc-600">Chưa có nội dung</span>}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {relativeTime(script.created_at)}
                      </span>
                      {script.platforms?.length > 0 && (
                        <span>{script.platforms.join(' · ')}</span>
                      )}
                      {script.status === 'posted' && (
                        <>
                          <span className="flex items-center gap-1">
                            <Eye size={11} /> {(script.views || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={11} /> {(script.likes || 0).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Edit script */}
        {screen === 'edit' && selected && (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                Tiêu đề
              </label>
              <input
                type="text"
                defaultValue={selected.title}
                onBlur={async e => {
                  await supabase.from('mai_scripts').update({ title: e.target.value }).eq('id', selected.id);
                }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                placeholder="Tiêu đề kịch bản..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Kịch bản (ElevenLabs sẽ đọc văn bản này)
                </label>
                <span className="text-[10px] text-zinc-600">AI tạo nhanh:</span>
              </div>
              <div className="flex gap-1.5 mb-2">
                {['Bán hàng', 'Sức khỏe', 'Quà tặng'].map((label, i) => (
                  <button
                    key={i}
                    onClick={() => generateWithGemini(i)}
                    disabled={geminiLoading}
                    className="flex-1 py-1.5 text-[11px] font-medium rounded-lg bg-violet-900/50 hover:bg-violet-800/70 border border-violet-700/50 text-violet-300 disabled:opacity-40 transition-colors"
                  >
                    {geminiLoading ? '...' : `✨ ${label}`}
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={12}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                placeholder="Nhập kịch bản bán hàng tại đây...&#10;&#10;Ví dụ:&#10;Xin chào mọi người, mình là Mai. Hôm nay mình muốn chia sẻ về sâm Ngọc Linh của nhà TA..."
              />
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-zinc-600">
                  {editContent.length} ký tự · ~{Math.ceil(editContent.length / 15)} giây
                </span>
                <span className="text-[11px] text-zinc-600">
                  Phù hợp: 300–800 ký tự cho video 30-60s
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                Đăng lên
              </label>
              <div className="flex gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatforms(prev =>
                      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                    )}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      platforms.includes(p)
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 rounded-lg px-3 py-2 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={triggerGenerate}
              disabled={triggering || !editContent.trim()}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2"
            >
              {triggering ? (
                <><RefreshCw size={20} className="animate-spin" /> Đang khởi động...</>
              ) : (
                <><Video size={20} /> Tạo video ngay</>
              )}
            </button>

            <p className="text-center text-xs text-zinc-600">
              ElevenLabs tạo giọng Mai → Kling AI tạo video → thông báo khi xong
            </p>
          </div>
        )}

        {/* Generating */}
        {screen === 'generating' && (
          <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-zinc-700 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Video size={28} className="text-orange-400" />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">Đang tạo video</h2>
            <p className="text-zinc-400 text-sm mb-8">
              Sẽ thông báo khi video sẵn sàng để duyệt
            </p>

            {/* Stage tracker */}
            <div className="w-full max-w-xs space-y-3">
              {(
                [
                  { key: 'voice', icon: <Mic size={16} />, label: 'Tạo giọng Mai (ElevenLabs)' },
                  { key: 'video', icon: <Video size={16} />, label: 'Tạo video (Kling AI)' },
                  { key: 'posting', icon: <Send size={16} />, label: 'Chuẩn bị đăng' },
                ] as const
              ).map(({ key, icon, label }) => {
                const stages = ['voice', 'video', 'posting'];
                const currentIdx = stages.indexOf(job?.stage ?? 'voice');
                const thisIdx = stages.indexOf(key);
                const done = currentIdx > thisIdx;
                const active = currentIdx === thisIdx;
                return (
                  <div
                    key={key}
                    className={`px-4 py-3 rounded-xl border transition-all ${
                      done ? 'bg-emerald-950 border-emerald-800' :
                      active ? 'bg-orange-950 border-orange-700' :
                      'bg-zinc-900 border-zinc-800 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={done ? 'text-emerald-400' : active ? 'text-orange-400' : 'text-zinc-600'}>
                        {done ? <CheckCircle2 size={16} /> : icon}
                      </span>
                      <span className={`text-sm font-medium flex-1 ${done ? 'text-emerald-300' : active ? 'text-orange-300' : 'text-zinc-500'}`}>
                        {label}
                      </span>
                      {active && job && (
                        <span className="text-xs text-orange-400 font-mono">{job.progress}%</span>
                      )}
                      {done && (
                        <span className="text-xs text-emerald-500">✓</span>
                      )}
                    </div>
                    {active && job && (
                      <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {job?.message && (
              <p className="mt-4 text-xs text-zinc-500 italic">{job.message}</p>
            )}
            {job?.error && (
              <p className="mt-4 text-sm text-red-400">{job.error}</p>
            )}
          </div>
        )}

        {/* History */}
        {screen === 'history' && (
          <div className="p-4 space-y-3">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Video đã đăng</h2>
            {scripts.filter(s => s.status === 'posted' || s.status === 'approved').length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
                <p>Chưa có video nào được đăng</p>
              </div>
            ) : (
              scripts
                .filter(s => s.status === 'posted' || s.status === 'approved')
                .map(script => (
                  <div key={script.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="font-semibold text-sm text-white mb-1">{script.title}</p>
                    <div className="flex gap-4 text-xs text-zinc-500 mt-2">
                      <span className="flex items-center gap-1"><Eye size={11} /> {(script.views || 0).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={11} /> {(script.likes || 0).toLocaleString()}</span>
                      <span>{script.platforms?.join(' · ')}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Review */}
        {screen === 'review' && selected && (
          <div className="flex flex-col">
            {/* Video */}
            <div className="bg-black aspect-[9/16] w-full relative">
              {selected.video_url ? (
                <video
                  ref={videoRef}
                  src={selected.video_url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <div className="text-center">
                    <Play size={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Video chưa sẵn sàng</p>
                  </div>
                </div>
              )}
            </div>

            {/* Script preview */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Kịch bản</p>
              <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">{selected.content}</p>
            </div>

            {/* Platform badges */}
            <div className="px-4 py-3 flex gap-2">
              {selected.platforms?.map(p => (
                <span key={p} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">{p}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="p-4 grid grid-cols-2 gap-3">
              <button
                onClick={rejectVideo}
                className="flex items-center justify-center gap-2 py-4 bg-zinc-800 hover:bg-red-950 border border-zinc-700 hover:border-red-800 text-zinc-300 hover:text-red-400 rounded-xl font-semibold transition-all"
              >
                <ThumbsDown size={20} />
                Làm lại
              </button>
              <button
                onClick={approveVideo}
                className="flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors"
              >
                <ThumbsUp size={20} />
                Duyệt & Đăng
              </button>
            </div>

            <p className="pb-4 text-center text-xs text-zinc-600">
              "Duyệt & Đăng" sẽ tự động post lên {selected.platforms?.join(', ')}
            </p>
          </div>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      {screen === 'scripts' && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-zinc-950/95 backdrop-blur border-t border-zinc-800 px-6 py-3 z-10">
          <div className="flex justify-around">
            {[
              { key: 'scripts', icon: <FileText size={22} />, label: 'Kịch bản' },
              { key: 'history', icon: <TrendingUp size={22} />, label: 'Kết quả' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setScreen(tab.key as Screen)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  screen === tab.key ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.icon}
                <span className="text-[11px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
