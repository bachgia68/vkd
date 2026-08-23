#!/usr/bin/env node
/**
 * Image optimization pipeline
 * Input: raw image URL
 * Process: download → upscale (Real-ESRGAN) → compress (Sharp) → output
 * Output: optimized webp <300KB
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');
const axios = require('axios');

const UPSCAYL_API = process.env.UPSCAYL_API || 'http://localhost:7860';
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Download image from URL
 */
async function downloadImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

/**
 * Upscale image using Real-ESRGAN (4x)
 */
async function upscaleImage(inputBuffer) {
  try {
    console.log('🔼 Upscaling with Real-ESRGAN (4x)...');

    // Save temp file
    const tempDir = path.join(__dirname, '../images/temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempInput = path.join(tempDir, 'input.png');
    const tempOutput = path.join(tempDir, 'output.png');

    fs.writeFileSync(tempInput, inputBuffer);

    // Call Upscayl API
    const response = await axios.post(`${UPSCAYL_API}/api/upscale`, {
      input_path: tempInput,
      output_path: tempOutput,
      model: 'RealESRGAN_x4plus',
      scale: 4
    });

    if (!fs.existsSync(tempOutput)) {
      throw new Error('Upscale failed - no output file');
    }

    const upscaledBuffer = fs.readFileSync(tempOutput);

    // Cleanup
    fs.unlinkSync(tempInput);
    fs.unlinkSync(tempOutput);

    return upscaledBuffer;
  } catch (error) {
    console.warn('⚠️  Upscale failed, skipping: ' + error.message);
    return inputBuffer; // Fallback: use original
  }
}

/**
 * Compress & optimize image with Sharp
 * Output: webp, 1024x1024 max, <300KB
 */
async function compressImage(inputBuffer, filename) {
  console.log('📦 Compressing with Sharp...');

  const outputPath = path.join(OUTPUT_DIR, `${path.parse(filename).name}.webp`);

  let quality = 80;
  let compressed;

  // Iterative compression until <300KB
  for (let attempt = 0; attempt < 5; attempt++) {
    compressed = await sharp(inputBuffer)
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality })
      .toBuffer();

    const sizeKB = compressed.length / 1024;
    console.log(`  Attempt ${attempt + 1}: ${sizeKB.toFixed(1)}KB (quality: ${quality})`);

    if (sizeKB < 300) break;
    quality -= 10;
  }

  fs.writeFileSync(outputPath, compressed);
  const finalSizeKB = compressed.length / 1024;
  console.log(`✅ Optimized: ${finalSizeKB.toFixed(1)}KB → ${outputPath}`);

  return compressed;
}

/**
 * Main pipeline
 */
async function processImage(imageUrl, filename) {
  try {
    console.log(`\n🖼️  Processing: ${filename}`);

    // Download
    console.log('📥 Downloading...');
    const downloaded = await downloadImage(imageUrl);
    console.log(`  Downloaded: ${(downloaded.length / 1024).toFixed(1)}KB`);

    // Upscale
    const upscaled = await upscaleImage(downloaded);

    // Compress
    const compressed = await compressImage(upscaled, filename);

    return {
      success: true,
      filename,
      size: compressed.length,
      sizeKB: (compressed.length / 1024).toFixed(1),
      path: path.join(OUTPUT_DIR, `${path.parse(filename).name}.webp`)
    };
  } catch (error) {
    console.error(`❌ Failed to process ${filename}: ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

// CLI usage
if (require.main === module) {
  const imageUrl = process.argv[2];
  const filename = process.argv[3] || 'image.png';

  if (!imageUrl) {
    console.log('Usage: node scripts/optimize-image.js <image-url> [filename]');
    process.exit(1);
  }

  processImage(imageUrl, filename).then(result => {
    console.log('\n📋 Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { processImage, downloadImage, upscaleImage, compressImage };
