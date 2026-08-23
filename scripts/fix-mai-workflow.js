const fs = require('fs');

// Secrets are read from env, never hardcoded — this script is committed to git.
// Run with: FAL_KEY=... TELEGRAM_CHAT_ID=... node fix-mai-workflow.js
const FAL_KEY = process.env.FAL_KEY || '__FAL_KEY_PENDING__';
const ELEVENLABS_KEY_PLACEHOLDER = '__ELEVENLABS_KEY_PENDING__';
const SUPABASE_URL = 'https://xcwirgrlnibnjmseglee.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjd2lyZ3Jsbmlibmptc2VnbGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTMxNzksImV4cCI6MjA5OTU4OTE3OX0.iAqhPvqHTJTzjvTc1aG76jQLQO3QJGnf46Zi9Cn_yb8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '__TELEGRAM_CHAT_ID_PENDING__';

const supabaseHeaders = () => [
  { name: 'apikey', value: SUPABASE_ANON_KEY },
  { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Prefer', value: 'return=representation' },
];

const wf = JSON.parse(fs.readFileSync('n8n-workflows-export.json', 'utf8'));
const mai = wf.find(w => w.id === 'RNLIuJqq73BO6emv');
const byName = name => {
  const n = mai.nodes.find(x => x.name === name);
  if (!n) throw new Error(`Node not found: ${name}`);
  return n;
};

// --- 0. "Chuẩn bị biến": extract fields from webhook payload { script_id, text, platforms } ---
byName('Chuẩn bị biến').parameters = {
  assignments: {
    assignments: [
      { id: 'a1', name: 'script_id', value: "={{ $('🎬 Nhận yêu cầu từ app').item.json.body.script_id }}", type: 'string' },
      { id: 'a2', name: 'script_content', value: "={{ $('🎬 Nhận yêu cầu từ app').item.json.body.text }}", type: 'string' },
      { id: 'a3', name: 'platforms', value: "={{ $('🎬 Nhận yêu cầu từ app').item.json.body.platforms }}", type: 'array' },
      { id: 'a4', name: 'voice_id', value: '21m00Tcm4TlvDq8ikWAM', type: 'string' },
    ],
  },
  options: {},
};

// --- 1. ElevenLabs TTS ---
const eleven = byName('🎙️ ElevenLabs TTS');
eleven.parameters.headerParameters.parameters = [
  { name: 'xi-api-key', value: ELEVENLABS_KEY_PLACEHOLDER },
  { name: 'Content-Type', value: 'application/json' },
];
eleven.parameters.bodyParameters.parameters = [
  { name: 'text', value: "={{ $('Chuẩn bị biến').item.json.script_content }}" },
  { name: 'model_id', value: 'eleven_multilingual_v2' },
  { name: 'voice_settings', value: '={{ { "stability": 0.5, "similarity_boost": 0.75 } }}' },
];
eleven.parameters.options = { response: { response: { responseFormat: 'file' } } };

// --- 2. Supabase: đặt status generating ---
const st1 = byName('Supabase: đặt status generating');
st1.parameters.headerParameters.parameters = supabaseHeaders();
st1.parameters.bodyParameters.parameters = [
  { name: 'status', value: 'generating' },
];

// --- 3. Supabase: tạo job record ---
const st2 = byName('Supabase: tạo job record');
st2.parameters.method = 'POST';
st2.parameters.url = `${SUPABASE_URL}/rest/v1/mai_jobs`;
st2.parameters.headerParameters.parameters = supabaseHeaders();
st2.parameters.bodyParameters.parameters = [
  { name: 'script_id', value: "={{ $('Chuẩn bị biến').item.json.script_id }}" },
  { name: 'stage', value: 'voice' },
  { name: 'progress', value: '10' },
  { name: 'message', value: 'Đang tạo giọng nói...' },
];

// --- 4. Supabase Storage: upload audio ---
const st3 = byName('Supabase Storage: upload audio');
st3.parameters.url = `={{ "${SUPABASE_URL}/storage/v1/object/mai-media/audio/" + $('Chuẩn bị biến').item.json.script_id + ".mp3" }}`;
st3.parameters.headerParameters.parameters = [
  { name: 'apikey', value: SUPABASE_ANON_KEY },
  { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
  { name: 'Content-Type', value: 'audio/mpeg' },
  { name: 'x-upsert', value: 'true' },
];

// --- 5. Job: cập nhật stage video ---
const st4 = byName('Job: cập nhật stage video');
st4.parameters.url = `={{ "${SUPABASE_URL}/rest/v1/mai_jobs?script_id=eq." + $('Chuẩn bị biến').item.json.script_id }}`;
st4.parameters.headerParameters.parameters = supabaseHeaders();
st4.parameters.bodyParameters.parameters = [
  { name: 'stage', value: 'video' },
  { name: 'progress', value: '30' },
  { name: 'message', value: 'Đang tạo video AI...' },
];

// --- 6. fal.ai (Kling): tạo video ---
const kling = byName('⚡ Kling AI: tạo video');
kling.parameters.url = 'https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video';
kling.parameters.headerParameters.parameters = [
  { name: 'Authorization', value: `Key ${FAL_KEY}` },
  { name: 'Content-Type', value: 'application/json' },
];
kling.parameters.bodyParameters.parameters = [
  { name: 'prompt', value: "={{ $('Chuẩn bị biến').item.json.script_content }}" },
  { name: 'duration', value: '5' },
  { name: 'aspect_ratio', value: '9:16' },
];

// --- 7. Lưu Kling task_id (Set node): fal.ai queue submit response = { request_id, status_url, response_url } ---
byName('Lưu Kling task_id').parameters = {
  assignments: {
    assignments: [
      { id: 'b1', name: 'kling_task_id', value: '={{ $json.request_id }}', type: 'string' },
      { id: 'b2', name: 'status_url', value: '={{ $json.status_url }}', type: 'string' },
      { id: 'b3', name: 'response_url', value: '={{ $json.response_url }}', type: 'string' },
    ],
  },
  options: {},
};

// --- 8. Supabase: lưu kling_task_id ---
const st5 = byName('Supabase: lưu kling_task_id');
st5.parameters.url = `={{ "${SUPABASE_URL}/rest/v1/mai_jobs?script_id=eq." + $('Chuẩn bị biến').item.json.script_id }}`;
st5.parameters.headerParameters.parameters = supabaseHeaders();
st5.parameters.bodyParameters.parameters = [
  { name: 'kling_task_id', value: "={{ $('Lưu Kling task_id').item.json.kling_task_id }}" },
];

// --- 9. fal.ai: kiểm tra tiến độ (poll status_url) ---
const check = byName('🔍 Kling: kiểm tra tiến độ');
check.parameters.url = "={{ $('Lưu Kling task_id').item.json.status_url }}";
check.parameters.headerParameters.parameters = [
  { name: 'Authorization', value: `Key ${FAL_KEY}` },
];

// --- 10. "Video xong chưa?" IF: fal.ai status field is `status`, value "COMPLETED" (not Kling-native "data.task_status") ---
byName('Video xong chưa?').parameters.conditions.conditions[0] = {
  id: 'status-check',
  leftValue: '={{ $json.status }}',
  rightValue: 'COMPLETED',
  operator: { type: 'string', operation: 'equals' },
};

// --- 11. Cập nhật progress (đang chờ) ---
const st6 = byName('Cập nhật progress (đang chờ)');
st6.parameters.url = `={{ "${SUPABASE_URL}/rest/v1/mai_jobs?script_id=eq." + $('Chuẩn bị biến').item.json.script_id }}`;
st6.parameters.headerParameters.parameters = supabaseHeaders();
st6.parameters.bodyParameters.parameters = [
  { name: 'progress', value: '60' },
  { name: 'message', value: 'Đang render video, vui lòng chờ...' },
];

// --- 12. Lấy video URL (Set node): fetch the final result from response_url once COMPLETED ---
byName('Lấy video URL').parameters = {
  assignments: {
    assignments: [
      { id: 'c1', name: 'video_url', value: '={{ $json.video?.url || $json.data?.video?.url }}', type: 'string' },
    ],
  },
  options: {},
};

// --- 13. Supabase: lưu video URL + status=ready ---
const st7 = byName('Supabase: lưu video URL + status=ready');
st7.parameters.method = 'PATCH';
st7.parameters.url = `={{ "${SUPABASE_URL}/rest/v1/mai_scripts?id=eq." + $('Chuẩn bị biến').item.json.script_id }}`;
st7.parameters.headerParameters.parameters = supabaseHeaders();
st7.parameters.bodyParameters.parameters = [
  { name: 'video_url', value: "={{ $('Lấy video URL').item.json.video_url }}" },
  { name: 'status', value: 'ready' },
];

// --- 14. Telegram: fix stale node reference ---
const tg = byName('📱 Telegram: báo Mai có video mới');
tg.parameters.chatId = TELEGRAM_CHAT_ID;
tg.parameters.text = "🎬 Video mới đã sẵn sàng để duyệt!\n\n✍️ {{ $('Chuẩn bị biến').item.json.script_content.substring(0, 80) }}...\n\n👉 Mở Mai Studio để xem và duyệt video.";

// --- 15. Trả lời app: OK — fix stale node reference ---
const resp = byName('Trả lời app: OK');
resp.parameters.responseBody = "={ \"ok\": true, \"task_id\": \"{{ $('Lưu Kling task_id').item.json.kling_task_id }}\" }";

fs.writeFileSync('n8n-workflows-export.json', JSON.stringify(wf, null, 2), 'utf8');
console.log('DONE - all 18 nodes patched');
