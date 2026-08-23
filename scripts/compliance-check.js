const fs = require('fs');

const BLACKLIST = [
  'dieu tri', 'chua khoi', 'chua dut diem', 'dac tri', 'than duoc', 'thuoc tien',
  'khoi han benh', 'het han benh', 'co cong dung nhu thuoc',
  '100% khoi', 'cam ket khoi', 'chong ung thu', 'ngua ung thu',
  'tot hon thuoc tay', 'cam ket hieu qua 100%', 'an toan tuyet doi', 'khong tac dung phu',
];

const DISCLAIMER = 'Sản phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh.';

function stripDiacritics(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, m => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase();
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function detectRepetition(text) {
  // Only flags verbatim repetition of longer phrases (6+ words) — short brand
  // names or set phrases naturally repeat 3+ times in normal ad copy.
  const words = text.split(/\s+/);
  const hexagramCounts = {};
  for (let i = 0; i < words.length - 5; i++) {
    const gram = words.slice(i, i + 6).join(' ').toLowerCase();
    hexagramCounts[gram] = (hexagramCounts[gram] || 0) + 1;
  }
  const maxRepeat = Math.max(0, ...Object.values(hexagramCounts));
  return { maxRepeat, isGibberish: maxRepeat >= 3 };
}

function checkScript(script) {
  const disclaimerCount = countOccurrences(script.content, DISCLAIMER);
  let content = script.content;

  if (disclaimerCount > 1) {
    content = content.split(DISCLAIMER).filter(Boolean).join('').trim();
  } else if (disclaimerCount === 1) {
    content = content.replace(DISCLAIMER, '').trim();
  }

  const normalizedBody = stripDiacritics(content);
  const violations = BLACKLIST.filter(term => normalizedBody.includes(term));
  const { maxRepeat, isGibberish } = detectRepetition(content);

  const finalContent = `${content.trim()}\n\n${DISCLAIMER}`;

  return {
    ...script,
    content: finalContent,
    compliance: {
      violations,
      isGibberish,
      maxRepeat,
      pass: violations.length === 0 && !isGibberish,
    },
  };
}

const scripts = JSON.parse(fs.readFileSync('scripts/batch-1-scripts.json', 'utf8'));
const checked = scripts.map(checkScript);

fs.writeFileSync('scripts/batch-1-scripts.json', JSON.stringify(checked, null, 2), 'utf8');
fs.writeFileSync('scripts/compliance-check-log.json', JSON.stringify(
  checked.map(s => ({ id: s.id, theme: s.theme, ...s.compliance })), null, 2
), 'utf8');

console.log('--- Compliance Check Results ---');
checked.forEach(s => {
  const reasons = [];
  if (s.compliance.violations.length) reasons.push(`blacklist: ${s.compliance.violations.join(', ')}`);
  if (s.compliance.isGibberish) reasons.push(`repetition x${s.compliance.maxRepeat} (gibberish)`);
  const status = s.compliance.pass ? 'PASS' : `FAIL (${reasons.join('; ')})`;
  console.log(`Script ${s.id} (${s.theme}): ${status}`);
});
