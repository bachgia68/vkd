const fs = require('fs');
const { execFileSync } = require('child_process');

const PYTHON = 'C:\\Users\\DELL\\AppData\\Local\\Python\\bin\\python.exe';
const VOICE = 'vi-VN-HoaiMyNeural';

function cleanForSpeech(text) {
  return text
    .replace(/\[.*?\]/g, '') // stage directions like [Âm nhạc nền...]
    .replace(/\(.*?\)/g, '') // parenthetical directions
    .replace(/\*\*/g, '') // markdown bold
    .replace(/["""]/g, '') // stray quotes
    .replace(/\n{2,}/g, '. ') // paragraph breaks -> pause
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const scripts = JSON.parse(fs.readFileSync('scripts/batch-1-scripts.json', 'utf8'));

for (const s of scripts) {
  const clean = cleanForSpeech(s.content);
  const txtPath = `audio/script-${s.id}-clean.txt`;
  const mp3Path = `audio/script-${s.id}-voiceover.mp3`;
  fs.writeFileSync(txtPath, clean, 'utf8');

  console.log(`Generating audio for script ${s.id} (${s.theme})...`);
  execFileSync(PYTHON, ['-m', 'edge_tts', '--voice', VOICE, '--file', txtPath, '--write-media', mp3Path], { stdio: 'inherit' });
  console.log(`  -> ${mp3Path}`);
}

console.log('DONE - all 5 voiceovers generated');
