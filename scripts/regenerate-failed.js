const fs = require('fs');

const REGEN = [
  { id: 2, theme: 'brewing_guide', prompt: 'Huong dan ngam ruou va ngam mat ong voi CU SAM NGOC LINH TUOI (khong phai mat ong don thuan) cua Sam TA: rua sach cu sam, ty le sam voi ruou/mat ong, thoi gian ngam, cach bao quan binh ngam' },
  { id: 3, theme: 'limited_offer', prompt: 'Uu dai gioi han hom nay khi mua CU SAM NGOC LINH TUOI cua Sam TA: giam gia phan tram, tang kem qua, chi con so luong it, keu goi mua ngay hom nay' },
  { id: 5, theme: 'qa_common', prompt: 'Giai dap 3 cau hoi thuong gap ve CU SAM NGOC LINH cua Sam TA: (1) Ai nen dung sam, (2) Lieu luong dung moi ngay bao nhieu, (3) Bao quan sam the nao cho tuoi lau' },
];

async function generateScript(item) {
  const prompt = `Viet 1 kich ban ban hang TikTok bang tieng Viet, dai 250-350 tu (45-60 giay), chu de: ${item.prompt}. Thuong hieu: Sam TA, san pham la CU SAM NGOC LINH TUOI (khong phai san phamkhac). Giong dieu: moc mac, chan thanh, TU NHIEN khong lap tu. Ket thuc bang loi keu goi dat hang ro rang. KHONG dung tu: dieu tri, chua khoi, dac tri, than duoc, khoi han benh. KHONG lap lai cung 1 cau nhieu lan. PHAI co nguyen van cau nay o gan cuoi: "San pham nay khong phai la thuoc, khong co tac dung thay the thuoc chua benh." CHI viet script, khong giai thich, khong loi mo dau, khong dung tu viet tat khong dau.`;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5:7b-instruct',
      prompt,
      stream: false,
      options: { temperature: 0.6, repeat_penalty: 1.3, repeat_last_n: 128 },
    }),
  });
  const data = await res.json();
  return data.response.trim();
}

(async () => {
  const scripts = JSON.parse(fs.readFileSync('scripts/batch-1-scripts.json', 'utf8'));

  for (const item of REGEN) {
    console.log(`Regenerating script ${item.id}: ${item.theme}...`);
    const content = await generateScript(item);
    const idx = scripts.findIndex(s => s.id === item.id);
    scripts[idx] = { id: item.id, theme: item.theme, content, wordCount: content.split(/\s+/).length };
    console.log(`  -> ${scripts[idx].wordCount} words`);
  }

  fs.writeFileSync('scripts/batch-1-scripts.json', JSON.stringify(scripts, null, 2), 'utf8');
  console.log('DONE -> scripts/batch-1-scripts.json (regenerated 2, 3, 5)');
})();
