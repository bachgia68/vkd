const fs = require('fs');

const GROQ_API_KEY = fs.readFileSync('.env', 'utf8').match(/GROQ_API_KEY=(.+)/)[1].trim();

const REGEN = [
  { id: 2, theme: 'brewing_guide', prompt: 'Hướng dẫn ngâm rượu và ngâm mật ong với CỦ SÂM NGỌC LINH TƯƠI của Sam TA: rửa sạch củ sâm, tỷ lệ sâm với rượu/mật ong, thời gian ngâm, cách bảo quản bình ngâm' },
  { id: 5, theme: 'qa_common', prompt: 'Giải đáp 3 câu hỏi thường gặp về CỦ SÂM NGỌC LINH của Sam TA: (1) Ai nên dùng sâm, (2) Liều lượng dùng mỗi ngày bao nhiêu, (3) Bảo quản sâm thế nào cho tươi lâu' },
];

async function generateScript(item) {
  const prompt = `Viết 1 kịch bản bán hàng TikTok bằng tiếng Việt, dài 250-350 từ (45-60 giây), chủ đề: ${item.prompt}. Thương hiệu: Sam TA, sản phẩm là CỦ SÂM NGỌC LINH TƯƠI. Giọng điệu: mộc mạc, chân thành, tự nhiên. Kết thúc bằng lời kêu gọi đặt hàng rõ ràng. KHÔNG dùng từ: điều trị, chữa khỏi, đặc trị, thần dược, khỏi hẳn bệnh. PHẢI có nguyên văn câu này ở gần cuối: "Sản phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh." CHỈ viết script, không giải thích, không lời mở đầu.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.choices[0].message.content.trim();
}

(async () => {
  const scripts = JSON.parse(fs.readFileSync('scripts/batch-1-scripts.json', 'utf8'));

  for (const item of REGEN) {
    console.log(`Generating script ${item.id} via Groq: ${item.theme}...`);
    const content = await generateScript(item);
    const idx = scripts.findIndex(s => s.id === item.id);
    scripts[idx] = { id: item.id, theme: item.theme, content, wordCount: content.split(/\s+/).length };
    console.log(`  -> ${scripts[idx].wordCount} words`);
  }

  fs.writeFileSync('scripts/batch-1-scripts.json', JSON.stringify(scripts, null, 2), 'utf8');
  console.log('DONE');
})();
