#!/usr/bin/env python3
"""
generate_sale_video.py

Automation pipeline: face.jpg + product.jpg + script.txt -> final_sales_video.mp4 (9:16)

Pipeline:
  1. edge-tts:        script.txt -> audio.mp3  (vi-VN-HoaiMyNeural)
  2. Deep-Live-Cam:   face.jpg + product.jpg -> swapped.jpg (face swap onto product image/template)
  3. SadTalker:       swapped.jpg + audio.mp3 -> talking.mp4 (lip-sync)
  4. ffmpeg:          talking.mp4 + bgm.mp3 -> final_sales_video.mp4 (9:16, bgm mixed under narration)

Requires Deep-Live-Cam and SadTalker already cloned + their own venvs/deps installed
(paths configured below). See install commands at bottom of this file.
"""

import argparse
import glob
import logging
import subprocess
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

# ---- Configure these paths for your machine -------------------------------
DEEP_LIVE_CAM_DIR = Path("~/Deep-Live-Cam").expanduser()
DEEP_LIVE_CAM_PY = DEEP_LIVE_CAM_DIR / "run.py"

SADTALKER_DIR = Path("~/SadTalker").expanduser()
SADTALKER_PY = SADTALKER_DIR / "inference.py"

TTS_VOICE = "vi-VN-HoaiMyNeural"
OUTPUT_RESOLUTION = "1080x1920"  # 9:16
# -----------------------------------------------------------------------------


def run_cmd(cmd, step_name, cwd=None):
    log.info("Running step: %s", step_name)
    log.info("  $ %s", " ".join(str(c) for c in cmd))
    try:
        subprocess.run(cmd, cwd=cwd, check=True, capture_output=True, text=True)
    except FileNotFoundError as e:
        log.error("%s failed: executable not found (%s)", step_name, e)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        log.error("%s failed with exit code %s", step_name, e.returncode)
        log.error("stdout:\n%s", e.stdout)
        log.error("stderr:\n%s", e.stderr)
        sys.exit(1)


def generate_tts(script_path: Path, audio_path: Path, voice: str = TTS_VOICE):
    run_cmd(
        ["edge-tts", "--voice", voice, "--file", str(script_path), "--write-media", str(audio_path)],
        "Text-to-speech (edge-tts)",
    )
    if not audio_path.exists():
        log.error("TTS step did not produce %s", audio_path)
        sys.exit(1)


def face_swap(face_path: Path, product_path: Path, output_path: Path):
    if not DEEP_LIVE_CAM_PY.exists():
        log.error("Deep-Live-Cam not found at %s (clone it and set DEEP_LIVE_CAM_DIR)", DEEP_LIVE_CAM_PY)
        sys.exit(1)
    run_cmd(
        [
            sys.executable, str(DEEP_LIVE_CAM_PY),
            "-s", str(face_path),
            "-t", str(product_path),
            "-o", str(output_path),
            "--many-faces",
        ],
        "Face swap (Deep-Live-Cam)",
        cwd=DEEP_LIVE_CAM_DIR,
    )
    if not output_path.exists():
        log.error("Face swap step did not produce %s", output_path)
        sys.exit(1)


def lip_sync(image_path: Path, audio_path: Path, result_dir: Path) -> Path:
    if not SADTALKER_PY.exists():
        log.error("SadTalker not found at %s (clone it and set SADTALKER_DIR)", SADTALKER_PY)
        sys.exit(1)
    result_dir.mkdir(parents=True, exist_ok=True)
    run_cmd(
        [
            sys.executable, str(SADTALKER_PY),
            "--driven_audio", str(audio_path),
            "--source_image", str(image_path),
            "--result_dir", str(result_dir),
            "--still",
            "--preprocess", "full",
            "--enhancer", "gfpgan",
        ],
        "Lip-sync (SadTalker)",
        cwd=SADTALKER_DIR,
    )
    produced = sorted(result_dir.glob("**/*.mp4"), key=lambda p: p.stat().st_mtime)
    if not produced:
        log.error("Lip-sync step did not produce any .mp4 in %s", result_dir)
        sys.exit(1)
    return produced[-1]


def mux_final_video(talking_video: Path, bgm_path: Path, output_path: Path, resolution: str = OUTPUT_RESOLUTION):
    width, height = resolution.split("x")
    filter_complex = (
        f"[0:v]scale={width}:{height}:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1[v];"
        f"[1:a]volume=0.15[bgm];"
        f"[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[a]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-i", str(talking_video),
        "-stream_loop", "-1", "-i", str(bgm_path),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "[a]",
        "-shortest",
        "-c:v", "libx264", "-c:a", "aac",
        str(output_path),
    ]
    run_cmd(cmd, "Final mux (ffmpeg)")
    if not output_path.exists():
        log.error("ffmpeg step did not produce %s", output_path)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate a sales video with face-swap + lip-sync")
    parser.add_argument("--face", type=Path, default=Path("face.jpg"))
    parser.add_argument("--product", type=Path, default=Path("product.jpg"))
    parser.add_argument("--script", type=Path, default=Path("script.txt"))
    parser.add_argument("--bgm", type=Path, default=Path("bgm.mp3"))
    parser.add_argument("--workdir", type=Path, default=Path("work"))
    parser.add_argument("--output", type=Path, default=Path("final_sales_video.mp4"))
    args = parser.parse_args()

    for required in (args.face, args.product, args.script, args.bgm):
        if not required.exists():
            log.error("Missing required input file: %s", required)
            sys.exit(1)

    args.workdir.mkdir(parents=True, exist_ok=True)
    audio_path = args.workdir / "audio.mp3"
    swapped_path = args.workdir / "swapped.jpg"
    sadtalker_result_dir = args.workdir / "sadtalker_out"

    generate_tts(args.script, audio_path)
    face_swap(args.face, args.product, swapped_path)
    talking_video = lip_sync(swapped_path, audio_path, sadtalker_result_dir)
    mux_final_video(talking_video, args.bgm, args.output)

    log.info("Done. Final video: %s", args.output.resolve())


if __name__ == "__main__":
    main()
