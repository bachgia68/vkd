"""
TA Studio Backend v2.0
- Gemini free (script + image generation)
- Veo 3 / Imagen 3 support
- Serve frontend tại http://localhost:5050
- Admin panel API
- Job queue với progress tracking
"""

import asyncio
import base64
import io
import json
import os
import socket
import subprocess
import sys
import threading
import time
import uuid
from pathlib import Path

from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS

# ── Paths ──────────────────────────────────────────────────────────────────
BASE       = Path(__file__).parent
FRONTEND   = BASE.parent / "frontend"
UPLOADS    = BASE / "uploads"
OUTPUT     = BASE / "output"
ADMIN_DATA = BASE / "admin_data.json"
FFMPEG     = Path(r"C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe")
FFPROBE    = FFMPEG.parent / "ffprobe.exe"
PYTHON     = Path(sys.executable)

for d in (UPLOADS, OUTPUT): d.mkdir(parents=True, exist_ok=True)

# ── Config từ env (mutable để set live qua API) ───────────────────────────
GEMINI_KEY       = os.environ.get("GEMINI_API_KEY", "")
DID_KEY          = os.environ.get("DID_API_KEY", "")
KLING_KEY        = os.environ.get("KLING_API_KEY", "")
TELEGRAM_TOKEN   = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT    = os.environ.get("TELEGRAM_CHAT_ID", "")
ADMIN_PASSWORD   = os.environ.get("ADMIN_PASSWORD", "ta2026")

# ── Admin data (products, backgrounds, characters) ─────────────────────────
DEFAULT_ADMIN = {
    "products": [
        {"id": "sam-cu",    "name": "Sâm Ngọc Linh – Củ tươi",  "emoji": "🌿", "active": True},
        {"id": "nuoc-sam",  "name": "Nước uống Sâm Ngọc Linh",   "emoji": "🧴", "active": True},
        {"id": "combo-qua", "name": "Combo Quà Tặng Sâm TA",      "emoji": "📦", "active": True},
        {"id": "bot-sam",   "name": "Bột Sâm Ngọc Linh",          "emoji": "✨", "active": True},
    ],
    "backgrounds": [
        {"id": "nui-ngoc-linh", "name": "Núi Ngọc Linh",    "emoji": "🏔️", "prompt": "misty Ngoc Linh mountain forest Vietnam, golden hour", "active": True},
        {"id": "rung-nguyen",   "name": "Rừng nguyên sinh",  "emoji": "🌲", "prompt": "ancient rainforest Vietnam, green light through trees", "active": True},
        {"id": "ruong-sam",     "name": "Ruộng sâm",         "emoji": "🌱", "prompt": "sam ngo linh ginseng farm rows, misty morning", "active": True},
        {"id": "studio",        "name": "Studio trắng",      "emoji": "⬜", "prompt": "clean white studio backdrop, professional photography", "active": True},
        {"id": "khang-trang",   "name": "Phòng sang trọng",  "emoji": "🏠", "prompt": "elegant Vietnamese interior, warm lighting, luxury", "active": True},
    ],
    "characters": [
        {"id": "mai",  "name": "Mai",      "emoji": "👩",  "desc": "KOL chính – trẻ trung, thân thiện", "active": True},
        {"id": "lan",  "name": "Lan",      "emoji": "👱‍♀️", "desc": "Chuyên gia sức khoẻ",              "active": True},
        {"id": "hung", "name": "Hùng",     "emoji": "👨",  "desc": "Người bán hàng nam",               "active": True},
        {"id": "bac",  "name": "Bác sĩ",   "emoji": "🧑‍⚕️", "desc": "Chuyên gia y tế",                  "active": True},
    ],
    "voices": [
        {"id": "vi-VN-HoaiMyNeural",    "name": "HoàiMy",    "desc": "Nữ · Miền Nam · Tự nhiên 🔥", "active": True},
        {"id": "vi-VN-NamMinhNeural",   "name": "NamMinh",   "desc": "Nam · Miền Bắc · Chuyên nghiệp", "active": True},
        {"id": "vi-VN-ThuHuongNeural",  "name": "ThuHương",  "desc": "Nữ · Miền Bắc · Thân thiện",    "active": True},
        {"id": "vi-VN-QuangNeural",     "name": "Quang",     "desc": "Nam · Trung tính · Mạnh mẽ",     "active": True},
    ],
    "ai_models": {
        "script":    "gemini-2.0-flash",
        "image":     "imagen-3.0-generate-002",
        "video":     "veo-3.0-generate-preview",
        "lipsync":   "none",
    },
    "brand": {
        "name": "TA SÂM NGỌC LINH",
        "tagline": "Quốc bảo Việt Nam",
        "primary_color": "#c9a050",
        "watermark": True,
        "hashtags": "#samngoclinh #samta #suckhoe #thảodược #quốcbảo",
    },
    "schedule": {"slots": ["08:00", "12:00", "20:00"], "auto_post": False},
    "videos": [],
}

def load_admin() -> dict:
    if ADMIN_DATA.exists():
        try:
            return json.loads(ADMIN_DATA.read_text(encoding="utf-8"))
        except Exception:
            pass
    return dict(DEFAULT_ADMIN)

def save_admin(data: dict):
    ADMIN_DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

# ── Flask ──────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=str(FRONTEND), static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "*"}})
jobs: dict[str, dict] = {}

def job_update(jid: str, **kw): jobs.setdefault(jid, {}).update(kw)

# ── Gemini client ─────────────────────────────────────────────────────────
def get_gemini():
    if not GEMINI_KEY:
        return None
    try:
        from google import genai
        return genai.Client(api_key=GEMINI_KEY)
    except Exception:
        return None

# ── TTS ───────────────────────────────────────────────────────────────────
def run_tts(text: str, out: Path, voice: str = "vi-VN-HoaiMyNeural") -> bool:
    try:
        r = subprocess.run(
            [str(PYTHON), "-m", "edge_tts", "--voice", voice,
             "--text", text, "--write-media", str(out)],
            capture_output=True, timeout=90,
        )
        return out.exists()
    except Exception as e:
        print(f"TTS error: {e}"); return False

# ── FFprobe ───────────────────────────────────────────────────────────────
def probe_duration(path: Path) -> float:
    r = subprocess.run(
        [str(FFPROBE), "-v", "error", "-show_entries", "format=duration",
         "-of", "json", str(path)],
        capture_output=True, text=True,
    )
    try: return float(json.loads(r.stdout)["format"]["duration"])
    except: return 0.0

# ── Gemini: generate script ───────────────────────────────────────────────
def ai_generate_script(product: str, style: str, duration_sec: int, extra: str = "") -> str:
    client = get_gemini()
    prompt = (
        f"Viết kịch bản video bán hàng bằng tiếng Việt tự nhiên.\n"
        f"Sản phẩm: {product}\nPhong cách: {style}\n"
        f"Mục tiêu ~{int(duration_sec * 2.3)} từ (~{duration_sec}s đọc).\n"
        f"{('Yêu cầu thêm: ' + extra) if extra else ''}\n"
        f"Kết thúc bằng CTA rõ ràng. Chỉ trả kịch bản, không giải thích."
    )
    if client:
        try:
            r = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            return r.text.strip()
        except Exception as e:
            print(f"Gemini error: {e}")
    # fallback Claude Haiku
    try:
        import anthropic
        c = anthropic.Anthropic()
        m = c.messages.create(
            model="claude-haiku-4-5-20251001", max_tokens=500,
            messages=[{"role": "user", "content": prompt}],
        )
        return m.content[0].text.strip()
    except Exception:
        return "Sâm Ngọc Linh – Quốc bảo Việt Nam. Hàm lượng saponin cao nhất thế giới. Tăng cường sức khoẻ, cải thiện giấc ngủ. Liên hệ ngay!"

# ── Gemini: generate image ────────────────────────────────────────────────
def ai_generate_image(prompt: str, out: Path) -> bool:
    client = get_gemini()
    if not client:
        return False
    try:
        r = client.models.generate_images(
            model="imagen-3.0-generate-002",
            prompt=prompt,
            config={"number_of_images": 1, "aspect_ratio": "9:16"},
        )
        if r.generated_images:
            img_bytes = base64.b64decode(r.generated_images[0].image.image_bytes)
            out.write_bytes(img_bytes)
            return True
    except Exception as e:
        print(f"Imagen error: {e}")
    return False

# ── Gemini: generate video (Veo) ──────────────────────────────────────────
def ai_generate_video_veo(prompt: str, duration: int, out: Path) -> bool:
    client = get_gemini()
    if not client:
        return False
    try:
        from google.genai import types
        op = client.models.generate_video(
            model="veo-3.0-generate-preview",
            prompt=prompt,
            config=types.GenerateVideoConfig(
                aspect_ratio="9:16",
                duration_seconds=min(duration, 8),
                number_of_videos=1,
            ),
        )
        # Poll operation
        for _ in range(60):
            time.sleep(3)
            op = client.operations.get(op)
            if op.done:
                break
        if op.done and not op.error and op.response:
            video_bytes = base64.b64decode(op.response.generated_videos[0].video.video_bytes)
            out.write_bytes(video_bytes)
            return True
    except Exception as e:
        print(f"Veo error: {e}")
    return False

# ── FFmpeg: assemble slideshow ────────────────────────────────────────────
def build_slideshow(images: list[Path], audio: Path, out: Path, brand_name: str = "TA SÂM NGỌC LINH") -> bool:
    if not images: return False
    audio_dur = probe_duration(audio)
    per = max(2.5, audio_dur / len(images))
    workdir = out.parent / (out.stem + "_work"); workdir.mkdir(exist_ok=True)

    clips = []
    for i, img in enumerate(images):
        clip = workdir / f"c{i:02d}.mp4"
        # Ken Burns zoom effect
        vf = (
            f"scale=1200:2134:force_original_aspect_ratio=increase,"
            f"crop=1080:1920:(iw-1080)/2:(ih-1920)/2,"
            f"zoompan=z='min(zoom+0.0008,1.15)':d={int(per*25)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920,"
            f"setsar=1"
        )
        r = subprocess.run(
            [str(FFMPEG), "-y", "-loop", "1", "-i", str(img),
             "-vf", vf, "-t", str(per), "-r", "25",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-an",
             str(clip)],
            capture_output=True, timeout=120,
        )
        if r.returncode == 0 and clip.exists(): clips.append(clip)

    if not clips: return False

    # concat
    clist = workdir / "c.txt"
    clist.write_text("\n".join(f"file '{p.resolve()}'" for p in clips), encoding="utf-8")
    concat = workdir / "concat.mp4"
    subprocess.run([str(FFMPEG), "-y", "-f", "concat", "-safe", "0",
                    "-i", str(clist), "-c", "copy", str(concat)],
                   capture_output=True, timeout=120)

    # extend/trim to audio
    vd = probe_duration(concat)
    if vd < audio_dur:
        ext = workdir / "ext.mp4"
        subprocess.run([str(FFMPEG), "-y", "-i", str(concat),
                        "-vf", f"tpad=stop_mode=clone:stop_duration={audio_dur-vd:.2f}",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", str(ext)],
                       capture_output=True, timeout=120)
        if ext.exists(): concat = ext

    # Watermark + subtitle + mux audio
    drawtext = (
        f"drawtext=text='{brand_name}':"
        f"fontcolor=white:fontsize=36:x=(w-text_w)/2:y=50:"
        f"box=1:boxcolor=black@0.55:boxborderw=8"
    )
    r = subprocess.run(
        [str(FFMPEG), "-y",
         "-i", str(concat), "-i", str(audio),
         "-vf", drawtext,
         "-map", "0:v", "-map", "1:a", "-shortest",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
         "-c:a", "aac", "-b:a", "128k",
         str(out)],
        capture_output=True, timeout=300,
    )
    return out.exists()

# ── Render worker ─────────────────────────────────────────────────────────
def render_worker(jid: str, script: str, voice: str, bg_id: str, use_veo: bool):
    try:
        admin = load_admin()
        brand = admin.get("brand", {})
        job_dir = UPLOADS / jid; job_dir.mkdir(parents=True, exist_ok=True)
        out_dir = OUTPUT / jid; out_dir.mkdir(parents=True, exist_ok=True)

        # Step 1: TTS
        job_update(jid, status="running", progress=15, step="🎙️ Tạo giọng đọc...")
        audio = out_dir / "narration.mp3"
        if not run_tts(script, audio, voice):
            job_update(jid, status="error", step="❌ Lỗi TTS"); return

        # Step 2: Generate / collect images
        job_update(jid, progress=35, step="🖼️ Chuẩn bị ảnh...")
        images = sorted(list(job_dir.glob("*.jpg")) + list(job_dir.glob("*.jpeg")) + list(job_dir.glob("*.png")))

        if not images:
            # Generate with Imagen 3
            job_update(jid, progress=40, step="🤖 AI đang tạo ảnh (Gemini Imagen 3)...")
            bg = next((b for b in admin.get("backgrounds", []) if b["id"] == bg_id), None)
            prompts = [
                f"Sâm Ngọc Linh Vietnamese ginseng root, premium quality, {bg['prompt'] if bg else 'mountain forest'}, photorealistic",
                f"Vietnamese woman holding Sam Ngoc Linh ginseng, {bg['prompt'] if bg else 'nature background'}, warm lighting, 4K",
                f"TA brand premium ginseng product packaging, elegant, {bg['prompt'] if bg else 'white background'}, studio photo",
            ]
            for i, p in enumerate(prompts):
                img_out = out_dir / f"ai_img_{i:02d}.jpg"
                ai_generate_image(p, img_out)
                if img_out.exists(): images.append(img_out)
                job_update(jid, progress=40 + i * 5, step=f"🖼️ Đang tạo ảnh {i+1}/{len(prompts)}...")

        # Fallback nếu không có ảnh nào
        if not images:
            from PIL import Image, ImageDraw, ImageFont
            ph = out_dir / "placeholder.jpg"
            img = Image.new("RGB", (1080, 1920), (20, 35, 20))
            draw = ImageDraw.Draw(img)
            draw.text((540, 920), "TA SÂM NGỌC LINH", fill=(201, 160, 80), anchor="mm")
            draw.text((540, 980), "Quốc bảo Việt Nam", fill=(180, 140, 60), anchor="mm")
            img.save(ph)
            images = [ph]

        # Step 3: Veo video generation (nếu bật)
        veo_clips = []
        if use_veo and GEMINI_KEY:
            job_update(jid, progress=55, step="🎬 Veo 3 đang tạo video clip...")
            bg = next((b for b in admin.get("backgrounds", []) if b["id"] == bg_id), None)
            veo_prompt = f"Cinematic 9:16 vertical video, {bg['prompt'] if bg else 'mountain forest Vietnam'}, smooth camera movement, premium product showcase, 4K quality"
            veo_out = out_dir / "veo_clip.mp4"
            if ai_generate_video_veo(veo_prompt, 8, veo_out):
                veo_clips.append(veo_out)
                job_update(jid, progress=70, step="✅ Veo 3 tạo xong clip!")

        # Step 4: Assemble video
        job_update(jid, progress=75, step="⚡ Render video cuối...")
        out_video = out_dir / "final_video.mp4"

        if veo_clips:
            # Concat veo clips + assemble with audio
            all_clips = veo_clips + images  # mix
            ok = build_slideshow(images, audio, out_video, brand.get("name", "TA SÂM NGỌC LINH"))
        else:
            ok = build_slideshow(images, audio, out_video, brand.get("name", "TA SÂM NGỌC LINH"))

        if not ok:
            job_update(jid, status="error", step="❌ Render thất bại"); return

        duration = probe_duration(out_video)

        # Save to admin video history
        admin_data = load_admin()
        admin_data.setdefault("videos", []).insert(0, {
            "id": jid,
            "created": time.strftime("%Y-%m-%d %H:%M"),
            "duration": round(duration, 1),
            "script_preview": script[:80] + "...",
            "url": f"/api/download/{jid}",
        })
        admin_data["videos"] = admin_data["videos"][:50]  # keep last 50
        save_admin(admin_data)

        job_update(jid, status="done", progress=100, step="🎉 Hoàn thành!",
                   output_file=str(out_video), duration=round(duration, 1),
                   download_url=f"/api/download/{jid}")

    except Exception as e:
        job_update(jid, status="error", step=f"❌ Lỗi: {e}")
        import traceback; traceback.print_exc()

# ══════════════════════════════════════════════════════════════════════════
# ROUTES — Frontend serving
# ══════════════════════════════════════════════════════════════════════════

@app.route("/")
def root():
    return send_from_directory(str(FRONTEND), "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(str(FRONTEND), filename)

# ══════════════════════════════════════════════════════════════════════════
# API ROUTES
# ══════════════════════════════════════════════════════════════════════════

@app.route("/api/health")
def health():
    local_ip = socket.gethostbyname(socket.gethostname())
    return jsonify({
        "status": "ok",
        "version": "2.2",
        "studio": "TA Studio",
        "gemini": bool(GEMINI_KEY),
        "did": bool(DID_KEY),
        "kling": bool(KLING_KEY),
        "telegram": bool(TELEGRAM_TOKEN),
        "local_ip": local_ip,
        "ffmpeg": FFMPEG.exists(),
    })

@app.route("/api/set-key", methods=["POST"])
def api_set_key():
    """Cập nhật API keys live, không cần restart."""
    global GEMINI_KEY, DID_KEY, KLING_KEY
    d = request.json or {}
    if "gemini" in d and d["gemini"]:
        GEMINI_KEY = d["gemini"].strip()
    if "did" in d and d["did"]:
        DID_KEY = d["did"].strip()
    if "kling" in d and d["kling"]:
        KLING_KEY = d["kling"].strip()
    return jsonify({"ok": True, "gemini": bool(GEMINI_KEY), "did": bool(DID_KEY), "kling": bool(KLING_KEY)})

@app.route("/api/config")
def api_config():
    return jsonify(load_admin())

@app.route("/api/generate-script", methods=["POST"])
def api_generate_script():
    d = request.json or {}
    script = ai_generate_script(
        d.get("product", "Sâm Ngọc Linh"),
        d.get("style", "Bán hàng · Thuyết phục"),
        int(d.get("duration", 45)),
        d.get("extra", ""),
    )
    hashtags = load_admin().get("brand", {}).get("hashtags", "")
    return jsonify({"script": script, "hashtags": hashtags})

@app.route("/api/generate-image", methods=["POST"])
def api_generate_image():
    d = request.json or {}
    prompt = d.get("prompt", "")
    if not prompt:
        return jsonify({"error": "prompt required"}), 400
    jid = d.get("job_id", str(uuid.uuid4()))
    job_dir = UPLOADS / jid; job_dir.mkdir(parents=True, exist_ok=True)
    count = len(list(job_dir.glob("ai_*.jpg")))
    out = job_dir / f"ai_{count:02d}.jpg"
    ok = ai_generate_image(prompt, out)
    if ok:
        return jsonify({"ok": True, "job_id": jid, "file": out.name})
    return jsonify({"ok": False, "error": "Gemini Imagen unavailable"})

@app.route("/api/upload-image", methods=["POST"])
def api_upload_image():
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400
    f = request.files["file"]
    jid = request.form.get("job_id", str(uuid.uuid4()))
    jdir = UPLOADS / jid; jdir.mkdir(parents=True, exist_ok=True)
    count = len(list(jdir.glob("*.jpg")) + list(jdir.glob("*.png")))
    ext = Path(f.filename).suffix.lower() or ".jpg"
    dest = jdir / f"{count:02d}_upload{ext}"
    f.save(dest)
    return jsonify({"job_id": jid, "file": dest.name})

@app.route("/api/render", methods=["POST"])
def api_render():
    d = request.json or {}
    script = d.get("script", "").strip()
    if not script:
        return jsonify({"error": "script required"}), 400
    jid = d.get("job_id", str(uuid.uuid4()))
    job_update(jid, status="queued", progress=0, step="⏳ Đang chuẩn bị...")
    t = threading.Thread(target=render_worker, args=(
        jid, script,
        d.get("voice", "vi-VN-HoaiMyNeural"),
        d.get("bg_id", "nui-ngoc-linh"),
        d.get("use_veo", False) and bool(GEMINI_KEY),
    ), daemon=True)
    t.start()
    return jsonify({"job_id": jid, "status": "queued"})

@app.route("/api/status/<jid>")
def api_status(jid):
    job = jobs.get(jid)
    if not job: return jsonify({"error": "not found"}), 404
    return jsonify(job)

@app.route("/api/download/<jid>")
def api_download(jid):
    video = OUTPUT / jid / "final_video.mp4"
    if not video.exists():
        return jsonify({"error": "video not ready"}), 404
    return send_file(str(video), as_attachment=True,
                     download_name=f"ta_video_{jid[:8]}.mp4",
                     mimetype="video/mp4")

@app.route("/api/preview/<jid>")
def api_preview(jid):
    video = OUTPUT / jid / "final_video.mp4"
    if not video.exists():
        return jsonify({"error": "not ready"}), 404
    return send_file(str(video), mimetype="video/mp4", conditional=True)

@app.route("/api/videos")
def api_videos():
    admin = load_admin()
    return jsonify(admin.get("videos", []))

@app.route("/api/send-telegram", methods=["POST"])
def api_send_telegram():
    d = request.json or {}
    jid = d.get("job_id", "")
    video = OUTPUT / jid / "final_video.mp4"
    if not video.exists():
        return jsonify({"error": "video not ready"}), 400
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT:
        return jsonify({"error": "Telegram not configured"}), 500
    import urllib.request
    boundary = "---TATelegramBound"
    caption = d.get("caption", "")[:200]
    parts = []
    parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{TELEGRAM_CHAT}\r\n'.encode())
    if caption:
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n{caption}\r\n'.encode())
    video_bytes = video.read_bytes()
    parts.append(
        f'--{boundary}\r\nContent-Disposition: form-data; name="video"; filename="ta.mp4"\r\nContent-Type: video/mp4\r\n\r\n'.encode()
        + video_bytes + f'\r\n--{boundary}--\r\n'.encode()
    )
    body = b"".join(parts)
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendVideo",
        data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=120).read())
        return jsonify({"ok": True, "message_id": resp.get("result", {}).get("message_id")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Admin API ─────────────────────────────────────────────────────────────

@app.route("/api/upload-video", methods=["POST"])
def api_upload_video():
    """Upload video đã quay để chỉnh sửa."""
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400
    f = request.files["file"]
    jid = request.form.get("job_id", "edit_" + str(uuid.uuid4())[:8])
    jdir = UPLOADS / jid; jdir.mkdir(parents=True, exist_ok=True)
    ext = Path(f.filename).suffix.lower() or ".mp4"
    dest = jdir / f"source{ext}"
    f.save(dest)
    duration = probe_duration(dest)
    return jsonify({"ok": True, "job_id": jid, "file": dest.name, "duration": round(duration, 1)})

@app.route("/api/edit-video", methods=["POST"])
def api_edit_video():
    """Chỉnh sửa video: trim, add_audio, add_text, resize."""
    d = request.json or {}
    jid = d.get("job_id", "")
    ops = d.get("operations", [])
    if not jid:
        return jsonify({"error": "job_id required"}), 400
    jdir = UPLOADS / jid
    # Find source video
    sources = list(jdir.glob("source*")) if jdir.exists() else []
    if not sources:
        return jsonify({"error": "Chưa upload video nguồn"}), 400
    t = threading.Thread(target=edit_worker, args=(jid, sources[0], ops, d), daemon=True)
    t.start()
    return jsonify({"ok": True, "job_id": jid, "status": "processing"})

def edit_worker(jid: str, source: Path, ops: list, params: dict):
    try:
        job_update(jid, status="running", progress=10, step="🎬 Bắt đầu xử lý video...")
        out_dir = OUTPUT / jid; out_dir.mkdir(parents=True, exist_ok=True)
        current = source

        for i, op in enumerate(ops):
            otype = op.get("type", "")
            pct = 10 + int((i / max(len(ops), 1)) * 70)
            job_update(jid, progress=pct, step=f"⚙️ Đang {otype}...")

            if otype == "trim":
                start = op.get("start", 0)
                end = op.get("end", 0)
                trimmed = out_dir / f"trimmed_{i}.mp4"
                subprocess.run([
                    str(FFMPEG), "-y", "-i", str(current),
                    "-ss", str(start), "-to", str(end),
                    "-c", "copy", str(trimmed)
                ], capture_output=True, timeout=120)
                if trimmed.exists(): current = trimmed

            elif otype == "add_audio":
                script_text = op.get("script", "") or params.get("script", "")
                voice = op.get("voice", "vi-VN-HoaiMyNeural")
                if script_text:
                    audio = out_dir / f"tts_{i}.mp3"
                    if run_tts(script_text, audio, voice):
                        muxed = out_dir / f"muxed_{i}.mp4"
                        subprocess.run([
                            str(FFMPEG), "-y",
                            "-i", str(current), "-i", str(audio),
                            "-map", "0:v", "-map", "1:a",
                            "-c:v", "copy", "-c:a", "aac",
                            "-shortest", str(muxed)
                        ], capture_output=True, timeout=300)
                        if muxed.exists(): current = muxed

            elif otype == "add_text":
                text = op.get("text", "TA SÂM NGỌC LINH")
                pos = op.get("position", "top")  # top / bottom / center
                fs = op.get("fontsize", 40)
                y_map = {"top": "50", "bottom": "h-100", "center": "(h-text_h)/2"}
                y = y_map.get(pos, "50")
                drawtext = f"drawtext=text='{text}':fontcolor=white:fontsize={fs}:x=(w-text_w)/2:y={y}:box=1:boxcolor=black@0.5:boxborderw=6"
                texted = out_dir / f"texted_{i}.mp4"
                subprocess.run([
                    str(FFMPEG), "-y", "-i", str(current),
                    "-vf", drawtext, "-c:a", "copy", str(texted)
                ], capture_output=True, timeout=300)
                if texted.exists(): current = texted

            elif otype == "resize":
                w = op.get("width", 1080)
                h = op.get("height", 1920)
                resized = out_dir / f"resized_{i}.mp4"
                subprocess.run([
                    str(FFMPEG), "-y", "-i", str(current),
                    "-vf", f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2",
                    "-c:a", "copy", str(resized)
                ], capture_output=True, timeout=300)
                if resized.exists(): current = resized

        # Final output
        final = out_dir / "final_video.mp4"
        if current != final:
            import shutil; shutil.copy2(str(current), str(final))

        duration = probe_duration(final)
        # Save to history
        admin_data = load_admin()
        admin_data.setdefault("videos", []).insert(0, {
            "id": jid, "created": time.strftime("%Y-%m-%d %H:%M"),
            "duration": round(duration, 1),
            "script_preview": "Video đã chỉnh sửa",
            "url": f"/api/download/{jid}", "source": "edit",
        })
        admin_data["videos"] = admin_data["videos"][:50]
        save_admin(admin_data)
        job_update(jid, status="done", progress=100, step="✅ Hoàn thành!",
                   output_file=str(final), duration=round(duration, 1))
    except Exception as e:
        job_update(jid, status="error", step=f"❌ {e}")

@app.route("/api/upload-kol", methods=["POST"])
def api_upload_kol():
    """Upload ảnh KOL để dùng cho D-ID talking head."""
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400
    f = request.files["file"]
    kol_dir = BASE / "kol_photos"; kol_dir.mkdir(exist_ok=True)
    name = request.form.get("name", "kol")
    dest = kol_dir / f"{name}.jpg"
    f.save(dest)
    return jsonify({"ok": True, "path": str(dest), "name": name})

@app.route("/api/kol-photos")
def api_kol_photos():
    kol_dir = BASE / "kol_photos"
    photos = []
    if kol_dir.exists():
        for f in sorted(kol_dir.glob("*.jpg")):
            photos.append({"name": f.stem, "url": f"/api/kol-photo/{f.name}"})
    return jsonify(photos)

@app.route("/api/kol-photo/<filename>")
def api_kol_photo(filename):
    kol_dir = BASE / "kol_photos"
    p = kol_dir / filename
    if not p.exists():
        return jsonify({"error": "not found"}), 404
    return send_file(str(p), mimetype="image/jpeg")

@app.route("/api/did-talk", methods=["POST"])
def api_did_talk():
    """
    Tạo talking head video bằng D-ID API.
    Cần: DID_KEY, ảnh KOL (kol_name), script text, voice_id.
    D-ID docs: https://docs.d-id.com/reference/talks
    """
    global DID_KEY
    if not DID_KEY:
        return jsonify({"error": "D-ID API key chưa nhập. Vào AI Model → D-ID Key."}), 400
    d = request.json or {}
    kol_name = d.get("kol_name", "mai")
    script_text = d.get("script", "")
    voice_id = d.get("voice_id", "vi-VN-HoaiMyNeural")
    if not script_text:
        return jsonify({"error": "script required"}), 400

    # Get KOL photo URL – D-ID cần URL public.
    # Ta host ảnh từ backend của chính mình, nhưng D-ID cần access từ internet.
    # → Cần ngrok hoặc upload ảnh lên D-ID trước.
    kol_dir = BASE / "kol_photos"
    kol_photo = kol_dir / f"{kol_name}.jpg"
    if not kol_photo.exists():
        return jsonify({"error": f"Chưa upload ảnh KOL '{kol_name}'. Vào tab Ảnh KOL để upload."}), 400

    import urllib.request as urlreq
    import json as _json

    local_ip = socket.gethostbyname(socket.gethostname())
    base_url = f"http://{local_ip}:5050"

    # Step 1: Upload ảnh lên D-ID (để lấy public URL)
    try:
        with open(kol_photo, "rb") as img_f:
            img_data = img_f.read()
        boundary = "---DIDUploadBound"
        body = (
            f'--{boundary}\r\nContent-Disposition: form-data; name="image"; filename="kol.jpg"\r\nContent-Type: image/jpeg\r\n\r\n'.encode()
            + img_data + f'\r\n--{boundary}--\r\n'.encode()
        )
        req = urlreq.Request(
            "https://api.d-id.com/images",
            data=body,
            headers={
                "Authorization": f"Basic {DID_KEY}",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
            },
            method="POST"
        )
        resp = _json.loads(urlreq.urlopen(req, timeout=30).read())
        image_url = resp.get("url", "")
        if not image_url:
            return jsonify({"error": "D-ID upload ảnh thất bại", "detail": resp}), 500
    except Exception as e:
        return jsonify({"error": f"D-ID upload ảnh lỗi: {e}"}), 500

    # Step 2: Tạo talk request
    # D-ID tự làm TTS (chọn voice phù hợp) hoặc ta cung cấp audio URL
    # Dùng D-ID TTS với Microsoft vi-VN voice
    talk_payload = _json.dumps({
        "source_url": image_url,
        "script": {
            "type": "text",
            "subtitles": False,
            "provider": {
                "type": "microsoft",
                "voice_id": voice_id,
            },
            "input": script_text,
        },
        "config": {"fluent": True, "pad_audio": 0.0},
    }).encode()

    try:
        req2 = urlreq.Request(
            "https://api.d-id.com/talks",
            data=talk_payload,
            headers={
                "Authorization": f"Basic {DID_KEY}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST"
        )
        resp2 = _json.loads(urlreq.urlopen(req2, timeout=30).read())
        talk_id = resp2.get("id", "")
        if not talk_id:
            return jsonify({"error": "D-ID tạo talk thất bại", "detail": resp2}), 500
        return jsonify({"ok": True, "talk_id": talk_id, "status": resp2.get("status", "created")})
    except Exception as e:
        return jsonify({"error": f"D-ID talk request lỗi: {e}"}), 500

@app.route("/api/did-status/<talk_id>")
def api_did_status(talk_id):
    """Poll D-ID talk status."""
    global DID_KEY
    if not DID_KEY:
        return jsonify({"error": "no D-ID key"}), 400
    import urllib.request as urlreq
    import json as _json
    try:
        req = urlreq.Request(
            f"https://api.d-id.com/talks/{talk_id}",
            headers={"Authorization": f"Basic {DID_KEY}", "Accept": "application/json"},
        )
        resp = _json.loads(urlreq.urlopen(req, timeout=15).read())
        status = resp.get("status", "")
        result_url = resp.get("result_url", "")
        return jsonify({"status": status, "result_url": result_url, "duration": resp.get("duration")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/did-download", methods=["POST"])
def api_did_download():
    """Tải video từ D-ID về server để xem preview."""
    global DID_KEY
    d = request.json or {}
    result_url = d.get("result_url", "")
    jid = d.get("job_id", str(uuid.uuid4()))
    if not result_url:
        return jsonify({"error": "result_url required"}), 400
    import urllib.request as urlreq
    out_dir = OUTPUT / jid; out_dir.mkdir(parents=True, exist_ok=True)
    out_video = out_dir / "final_video.mp4"
    try:
        req = urlreq.Request(result_url, headers={"Authorization": f"Basic {DID_KEY}"} if DID_KEY else {})
        data = urlreq.urlopen(req, timeout=120).read()
        out_video.write_bytes(data)
        duration = probe_duration(out_video)
        # Save to history
        admin_data = load_admin()
        admin_data.setdefault("videos", []).insert(0, {
            "id": jid, "created": time.strftime("%Y-%m-%d %H:%M"),
            "duration": round(duration, 1),
            "script_preview": d.get("script_preview", "D-ID Video"),
            "url": f"/api/download/{jid}", "source": "d-id",
        })
        admin_data["videos"] = admin_data["videos"][:50]
        save_admin(admin_data)
        return jsonify({"ok": True, "job_id": jid, "duration": round(duration, 1)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    d = request.json or {}
    if d.get("password") == ADMIN_PASSWORD:
        return jsonify({"ok": True, "token": "ta_admin_" + ADMIN_PASSWORD})
    return jsonify({"error": "Sai mật khẩu"}), 401

@app.route("/api/admin/save", methods=["POST"])
def admin_save():
    auth = request.headers.get("X-Admin-Token", "")
    if not auth.startswith("ta_admin_"):
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    if not data: return jsonify({"error": "no data"}), 400
    save_admin(data)
    return jsonify({"ok": True})

@app.route("/api/admin/config")
def admin_config():
    return jsonify(load_admin())

# ── QR code for phone access ──────────────────────────────────────────────
@app.route("/api/qr")
def api_qr():
    try:
        import qrcode
        local_ip = socket.gethostbyname(socket.gethostname())
        url = f"http://{local_ip}:5050"
        qr = qrcode.QRCode(box_size=8, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        return send_file(buf, mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Kling AI: text-to-video / image-to-video ──────────────────────────────
import urllib.request as _urllib_req
import urllib.error as _urllib_err

KLING_API = "https://api.klingai.com/v1/videos"

def _kling_headers():
    return {
        "Authorization": f"Bearer {KLING_KEY}",
        "Content-Type": "application/json",
    }

def _kling_post(endpoint: str, payload: dict):
    import urllib.request, urllib.error, json as _json
    data = _json.dumps(payload).encode()
    req = urllib.request.Request(f"{KLING_API}/{endpoint}", data=data,
                                  headers=_kling_headers(), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return _json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode(), "code": e.code}

def _kling_get(endpoint: str):
    import urllib.request, urllib.error, json as _json
    req = urllib.request.Request(f"{KLING_API}/{endpoint}",
                                  headers=_kling_headers(), method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return _json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode(), "code": e.code}


@app.route("/api/kling-generate", methods=["POST"])
def api_kling_generate():
    if not KLING_KEY:
        return jsonify({"error": "Kling key chưa cấu hình — nhập trong tab AI Model"}), 400
    d = request.json or {}
    mode     = d.get("mode", "text2video")   # text2video | image2video
    prompt   = d.get("prompt", "")
    duration = d.get("duration", 5)          # 5 hoặc 10 giây/clip
    ratio    = d.get("ratio", "16:9")
    model    = d.get("model", "kling-v1-5")  # kling-v1 | kling-v1-5 | kling-v2

    if not prompt:
        return jsonify({"error": "prompt required"}), 400

    if mode == "text2video":
        payload = {
            "model": model,
            "prompt": prompt,
            "duration": duration,
            "aspect_ratio": ratio,
            "cfg_scale": 0.5,
        }
        resp = _kling_post("text2video", payload)
    else:
        image_url = d.get("image_url", "")
        if not image_url:
            return jsonify({"error": "image_url required for image2video"}), 400
        payload = {
            "model": model,
            "image": image_url,
            "prompt": prompt,
            "duration": duration,
            "cfg_scale": 0.5,
        }
        resp = _kling_post("image2video", payload)

    if "error" in resp:
        return jsonify(resp), 400
    task_id = resp.get("data", {}).get("task_id") or resp.get("task_id", "")
    return jsonify({"ok": True, "task_id": task_id, "mode": mode, "raw": resp})


@app.route("/api/kling-status/<task_id>")
def api_kling_status(task_id: str):
    if not KLING_KEY:
        return jsonify({"error": "Kling key chưa cấu hình"}), 400
    mode = request.args.get("mode", "text2video")
    resp = _kling_get(f"{mode}/{task_id}")
    data = resp.get("data", {})
    status = data.get("task_status", "")
    video_url = ""
    if status == "succeed":
        works = data.get("task_result", {}).get("videos", [])
        video_url = works[0].get("url", "") if works else ""
    return jsonify({
        "status": status,
        "video_url": video_url,
        "raw": resp,
    })


@app.route("/api/kling-download", methods=["POST"])
def api_kling_download():
    """Download Kling video về server và trả path."""
    d = request.json or {}
    video_url = d.get("video_url", "")
    if not video_url:
        return jsonify({"error": "video_url required"}), 400
    jid = str(uuid.uuid4())
    out_dir = OUTPUT / jid
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "kling_video.mp4"
    try:
        import urllib.request
        urllib.request.urlretrieve(video_url, out_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"ok": True, "job_id": jid,
                    "url": f"/api/download/{jid}/kling_video.mp4"})


if __name__ == "__main__":
    local_ip = socket.gethostbyname(socket.gethostname())
    print("\n" + "═" * 52)
    print("  TA STUDIO v2.0  — Video Marketing Platform")
    print("═" * 52)
    print(f"  💻 Máy tính : http://localhost:5050")
    print(f"  📱 Điện thoại: http://{local_ip}:5050")
    print(f"  📲 QR Code   : http://{local_ip}:5050/api/qr")
    print(f"  🔑 Admin pass: {ADMIN_PASSWORD}")
    print(f"  🤖 Gemini    : {'✅ Đã cấu hình' if GEMINI_KEY else '⚠️ Chưa có API key'}")
    print("═" * 52 + "\n")
    app.run(host="0.0.0.0", port=5050, debug=False, threaded=True)
