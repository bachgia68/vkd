const fs = require('fs');

const THEMES = [
  { id: 1, theme: 'fake_detection', prompt: 'Cach phan biet sam Ngoc Linh that va gia: mau sac, tem chong hang gia, mui huong dac trung' },
  { id: 2, theme: 'brewing_guide', prompt: 'Huong dan ngam ruou va ngam mat ong voi cu sam tuoi Sam TA: ty le, thoi gian ngam, cach bao quan' },
  { id: 3, theme: 'limited_offer', prompt: 'Uu dai gioi han hom nay cho sam Ngoc Linh Sam TA: giam gia, tang kem, so luong co han' },
  { id: 4, theme: 'testimonial', prompt: 'Chia se cam nhan khach hang da dung sam Ngoc Linh Sam TA, cam thay khoe khoan hon, ngu ngon hon' },
  { id: 5, theme: 'qa_common', prompt: 'Giai dap cac cau hoi thuong gap ve sam Ngoc Linh: ai nen dung, lieu luong, bao quan the nao' },
];

async function generateScript(themeObj) {
  const prompt = `Viet 1 kich ban ban hang TikTok bang tieng Viet, dai 250-350 tu (45-60 giay), chu de: ${themeObj.prompt}. Thuong hieu: Sam TA. Giong dieu: moc mac, chan thanh. Ket thuc bang loi keu goi dat hang ro rang. KHONG dung tu: dieu tri, chua khoi, dac tri, than duoc, khoi han. PHAI co nguyen van cau nay o gan cuoi: "San pham nay khong phai la thuoc, khong co tac dung thay the thuoc chua benh." CHI viet script, khong giai thich, khong loi mo dau.`;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen2.5:7b-instruct', prompt, stream: false }),
  });
  const data = await res.json();
  return data.response.trim();
}

(async () => {
  const results = [];
  for (const t of THEMES) {
    console.log(`Generating script ${t.id}: ${t.theme}...`);
    const content = await generateScript(t);
    results.push({ id: t.id, theme: t.theme, content, wordCount: content.split(/\s+/).length });
    console.log(`  -> ${results[results.length - 1].wordCount} words`);
  }
  fs.writeFileSync('scripts/batch-1-scripts.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('DONE -> scripts/batch-1-scripts.json');
})();
