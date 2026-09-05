// Task A (Phase 11): dịch name/description/activeIngredient sang EN/ZH/FR cho
// MỌI sản phẩm còn thiếu, gọi Ollama local (qwen2.5:7b-instruct) — Claude chỉ
// viết script điều phối, phần dịch thật do model Qwen sinh ra.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const productsPath = path.join(root, 'src', 'data', 'products.ts');
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:7b-instruct';

const src = fs.readFileSync(productsPath, 'utf8');

const startMarker = 'const allProducts: Product[] = [';
const startIdx = src.indexOf(startMarker);
if (startIdx === -1) throw new Error('Không tìm thấy allProducts array');
const arrayStart = startIdx + startMarker.length - 1; // vị trí dấu '['
const closeMarker = '\r\n];\r\n\r\n// Loc san pham hidden=true';
const closeIdx = src.indexOf(closeMarker, arrayStart);
if (closeIdx === -1) throw new Error('Không tìm thấy điểm kết thúc array');
const arrayEnd = closeIdx + '\r\n]'.length; // bao gồm dấu ']'

const arrayText = src.slice(arrayStart, arrayEnd);
// eslint-disable-next-line no-new-func
const products = new Function('return ' + arrayText)();

console.log(`Tổng ${products.length} sản phẩm trong catalog.`);

function needsTranslation(p) {
  const missingName = !p.nameEn || !p.nameZh || !p.nameFr;
  const missingDesc = !p.descriptionEn || !p.descriptionZh || !p.descriptionFr;
  const missingActive = p.activeIngredient && (!p.activeIngredientEn || !p.activeIngredientZh || !p.activeIngredientFr);
  return missingName || missingDesc || missingActive;
}

const todo = products.filter(needsTranslation);
console.log(`${todo.length} sản phẩm cần dịch (thiếu ít nhất 1 field EN/ZH/FR).`);

async function callOllama(prompt) {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.2 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.response;
}

// Thuật ngữ cố định — LẤY ĐÚNG theo bản dịch đã dùng nhất quán trong
// src/data/vkdProductTranslations.ts, KHÔNG để model tự dịch/phiên âm sai
// (test thực tế cho thấy model tự ý dịch "Ngọc Linh" thành "Ngoc Ling", và
// tiếng Trung bị lẫn ký tự Latin/tiếng Hàn — phải khoá cứng thuật ngữ này).
const FIXED_TERMS = `QUY TẮC BẮT BUỘC — thuật ngữ cố định, KHÔNG tự dịch/phiên âm khác:
- "Sâm Ngọc Linh" → EN: "Ngoc Linh Ginseng" | ZH: "玉琳参" | FR: "Ginseng Ngoc Linh"
- "Ngọc Linh" (địa danh núi) → EN: "Ngoc Linh" | ZH: "玉琳" | FR: "Ngoc Linh" (giữ nguyên, KHÔNG dịch thành "Ngoc Ling" hay từ khác)
- Tên thương hiệu "TA" giữ nguyên "TA" ở mọi ngôn ngữ.`;

function buildPrompt(p) {
  return `Bạn là biên dịch viên chuyên nghiệp cho sản phẩm thảo dược Sâm Ngọc Linh. Dịch CHÍNH XÁC nội dung sau sang tiếng Anh (en), tiếng Trung giản thể (zh), tiếng Pháp (fr). TUYỆT ĐỐI KHÔNG bịa thêm công dụng/thông tin không có trong bản gốc, không thêm tính từ marketing mới, chỉ dịch nghĩa. Bản dịch tiếng Trung PHẢI dùng 100% chữ Hán giản thể, KHÔNG được lẫn chữ Latin/Hàn/Việt không dấu.

${FIXED_TERMS}

Tên sản phẩm (vi): ${p.name}
Mô tả (vi): ${p.description}
${p.activeIngredient ? `Hoạt chất chính (vi): ${p.activeIngredient}` : ''}

Trả lời DUY NHẤT một JSON object với các key sau (không thêm text nào khác ngoài JSON):
{
  "name_en": "...", "name_zh": "...", "name_fr": "...",
  "description_en": "...", "description_zh": "...", "description_fr": "..."${p.activeIngredient ? ',\n  "active_ingredient_en": "...", "active_ingredient_zh": "...", "active_ingredient_fr": "..."' : ''}
}`;
}

// Kiểm tra chất lượng thô trước khi ghi — model 7B local thỉnh thoảng lẫn chữ
// Latin vào bản dịch tiếng Trung (đã gặp thật khi test), hoặc trả rỗng. Sản
// phẩm không đạt được GHI VÀO danh sách needs_review.json thay vì ghi bậy vào
// products.ts — Joe/Qwen phiên sau xem lại thủ công.
function isZhClean(text) {
  if (!text) return false;
  const latinRun = /[A-Za-zÀ-ỹ]{3,}/.test(text.replace(/\bTA\b/g, ''));
  return !latinRun;
}

let done = 0;
let failed = 0;
const needsReview = [];
for (const p of todo) {
  try {
    const raw = await callOllama(buildPrompt(p));
    const t = JSON.parse(raw);
    const zhOk = isZhClean(t.name_zh) && isZhClean(t.description_zh) && (!t.active_ingredient_zh || isZhClean(t.active_ingredient_zh));
    if (!zhOk) {
      needsReview.push({ sku: p.sku, reason: 'zh_output_lan_chu_latin', raw: t });
      failed++;
      continue;
    }
    if (t.name_en) p.nameEn = t.name_en;
    if (t.name_zh) p.nameZh = t.name_zh;
    if (t.name_fr) p.nameFr = t.name_fr;
    if (t.description_en) p.descriptionEn = t.description_en;
    if (t.description_zh) p.descriptionZh = t.description_zh;
    if (t.description_fr) p.descriptionFr = t.description_fr;
    if (t.active_ingredient_en) p.activeIngredientEn = t.active_ingredient_en;
    if (t.active_ingredient_zh) p.activeIngredientZh = t.active_ingredient_zh;
    if (t.active_ingredient_fr) p.activeIngredientFr = t.active_ingredient_fr;
    done++;
  } catch (err) {
    failed++;
    needsReview.push({ sku: p.sku, reason: 'exception', error: err.message });
    console.error(`Lỗi dịch SKU ${p.sku}: ${err.message}`);
  }
  if ((done + failed) % 5 === 0) {
    console.log(`Tiến độ: ${done + failed}/${todo.length} (ok=${done}, fail=${failed})`);
  }
}

console.log(`Hoàn tất: ${done} thành công, ${failed} lỗi/cần review.`);
if (needsReview.length > 0) {
  fs.writeFileSync(
    path.join(root, 'tasks', 'phase11_translate_needs_review.json'),
    JSON.stringify(needsReview, null, 2),
    'utf8'
  );
  console.log(`Đã ghi ${needsReview.length} SKU cần review vào tasks/phase11_translate_needs_review.json`);
}

// Giữ nguyên field order gốc bằng cách serialize theo key order Product interface
// đã dùng nhất quán (JSON.stringify tôn trọng insertion order của object — vì ta
// mutate object hiện có (không tạo mới) nên order giữ nguyên như lúc đọc vào).
const preservedGuardAllow = new Set(
  products.filter((p) => ['samtramy', 'tumorong', 'tumorongshop', 'khanhthanh'].includes(p.supplierId)).map((p) => p.sku)
);

const serialized = products
  .map((p, i) => {
    const comment = preservedGuardAllow.has(p.sku) ? ' // supplier-guard-allow' : '';
    const comma = i < products.length - 1 ? ',' : '';
    return '  ' + JSON.stringify(p) + comma + comment;
  })
  .join('\r\n');

const newArrayText = '[\r\n' + serialized + '\r\n]';
const updatedSrc = src.slice(0, arrayStart) + newArrayText + src.slice(arrayEnd);
fs.writeFileSync(productsPath, updatedSrc, 'utf8');
console.log('Đã ghi lại products.ts với bản dịch mới.');
