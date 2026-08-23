#!/usr/bin/env python3
"""
make_free_sales_video.py

Free, no-GPU pipeline: nhiều clip ngắn (tải tay từ Kling/Runway free tier,
mỗi clip toi da ~10s do gioi han free) + 1 file script.txt (loi doc)
-> 1 video ban hang hoan chinh (9:16), dai bang dung do dai loi doc, khong
bi cham 10s nua.

Pipeline (toan bo chay CPU, khong can GPU roi):
  1. edge-tts:  script.txt -> audio.mp3  (giong doc mien phi, khong can key)
  2. ffmpeg:    noi tat ca clip trong --clips-dir lai theo thu tu ten file,
                scale/pad ve chung 1 do phan giai 9:16
  3. ffmpeg:    neu video ngan hon audio -> keo dai bang cach dung khung
                hinh cuoi (khong bi giat/lap); neu dai hon -> cat cho khop
                dung do dai loi doc
  4. ffmpeg:    mux audio (+ bgm tuy chon, hoa am luong nho duoi loi doc)
                -> final_free_sales_video.mp4

Vi du dung:
  python make_free_sales_video.py --clips-dir clips --script script.txt --output final.mp4
  python make_free_sales_video.py --clips-dir clips --script script.txt --bgm bgm.mp3 --output final.mp4

--clips-dir: thu muc chua cac clip .mp4 tai tay tu Kling/Runway free tier
(dat ten kieu 01.mp4, 02.mp4, 03.mp4... de dam bao dung thu tu ghep).
"""

import argparse
import glob
import json
import logging
import subprocess
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

TTS_VOICE = "vi-VN-HoaiMyNeural"
OUTPUT_RESOLUTION = "1080x1920"  # 9:16


def run_cmd(cmd, step_name):
    log.info("Running step: %s", step_name)
    log.info("  $ %s", " ".join(str(c) for c in cmd))
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
    except FileNotFoundError as e:
        log.error("%s failed: executable not found (%s)", step_name, e)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        log.error("%s failed with exit code %s", step_name, e.returncode)
        log.error("stdout:\n%s", e.stdout)
        log.error("stderr:\n%s", e.stderr)
        sys.exit(1)


def generate_tts(script_path: Path, audio_path: Path, voice: str = TTS_VOICE):
    # --file bi loi "NoAudioReceived" khong on dinh tren Windows (da gap thuc
    # te); doc noi dung roi truyen qua --text on dinh hon.
    text = script_path.read_text(encoding="utf-8").strip()
    run_cmd(
        ["edge-tts", "--voice", voice, "--text", text, "--write-media", str(audio_path)],
        "Text-to-speech (edge-tts, free)",
    )
    if not audio_path.exists():
        log.error("TTS step did not produce %s", audio_path)
        sys.exit(1)


def probe_duration(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(json.loads(result.stdout)["format"]["duration"])


def concat_clips(clips_dir: Path, workdir: Path, resolution: str = OUTPUT_RESOLUTION) -> Path:
    clips = sorted(glob.glob(str(clips_dir / "*.mp4")))
    if not clips:
        log.error("No .mp4 files found in %s", clips_dir)
        sys.exit(1)
    log.info("Found %d clip(s) to concat (in this order): %s", len(clips), clips)

    width, height = resolution.split("x")
    normalized = []
    for i, clip in enumerate(clips):
        out = workdir / f"norm_{i:02d}.mp4"
        run_cmd(
            [
                "ffmpeg", "-y", "-i", clip,
                "-vf", f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
                       f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1",
                "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                str(out),
            ],
            f"Normalize clip {i + 1}/{len(clips)}",
        )
        normalized.append(out)

    concat_list = workdir / "concat_list.txt"
    concat_list.write_text("\n".join(f"file '{p.resolve()}'" for p in normalized), encoding="utf-8")

    concatenated = workdir / "concatenated.mp4"
    run_cmd(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
         "-c", "copy", str(concatenated)],
        "Concat all clips",
    )
    return concatenated


def match_video_to_audio(video_path: Path, audio_dur: float, workdir: Path) -> Path:
    video_dur = probe_duration(video_path)
    out = workdir / "matched.mp4"
    if video_dur < audio_dur:
        pad_seconds = audio_dur - video_dur
        log.info("Video (%.1fs) shorter than narration (%.1fs) — extending last frame by %.1fs",
                  video_dur, audio_dur, pad_seconds)
        run_cmd(
            ["ffmpeg", "-y", "-i", str(video_path),
             "-vf", f"tpad=stop_mode=clone:stop_duration={pad_seconds:.2f}",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
             str(out)],
            "Extend video to match narration length",
        )
    else:
        log.info("Video (%.1fs) longer than narration (%.1fs) — trimming to narration length",
                  video_dur, audio_dur)
        run_cmd(
            ["ffmpeg", "-y", "-i", str(video_path), "-t", f"{audio_dur:.2f}",
             "-c", "copy", str(out)],
            "Trim video to narration length",
        )
    return out


def mux_final_video(video_path: Path, audio_path: Path, bgm_path: Path | None, output_path: Path):
    if bgm_path is not None:
        filter_complex = (
            "[1:a]volume=0.15[bgm];"
            "[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[a]"
        )
        cmd = [
            "ffmpeg", "-y",
            "-i", str(audio_path),
            "-stream_loop", "-1", "-i", str(bgm_path),
            "-i", str(video_path),
            "-filter_complex", filter_complex,
            "-map", "2:v", "-map", "[a]",
            "-shortest",
            "-c:v", "copy", "-c:a", "aac",
            str(output_path),
        ]
    else:
        cmd = [
            "ffmpeg", "-y",
            "-i", str(video_path), "-i", str(audio_path),
            "-map", "0:v", "-map", "1:a",
            "-shortest",
            "-c:v", "copy", "-c:a", "aac",
            str(output_path),
        ]
    run_cmd(cmd, "Mux narration (+ bgm) into final video")
    if not output_path.exists():
        log.error("ffmpeg step did not produce %s", output_path)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Free, no-GPU: stitch short clips + free TTS narration into 1 sales video")
    parser.add_argument("--clips-dir", type=Path, required=True, help="Thu muc chua clip .mp4 tai tu Kling/Runway free tier")
    parser.add_argument("--script", type=Path, required=True, help="File .txt chua loi doc")
    parser.add_argument("--bgm", type=Path, default=None, help="Nhac nen tuy chon (.mp3)")
    parser.add_argument("--voice", type=str, default=TTS_VOICE, help="Giong edge-tts, mac dinh vi-VN-HoaiMyNeural")
    parser.add_argument("--workdir", type=Path, default=Path("work_free_video"))
    parser.add_argument("--output", type=Path, default=Path("final_free_sales_video.mp4"))
    args = parser.parse_args()

    if not args.clips_dir.exists():
        log.error("Missing --clips-dir: %s", args.clips_dir)
        sys.exit(1)
    if not args.script.exists():
        log.error("Missing --script: %s", args.script)
        sys.exit(1)
    if args.bgm is not None and not args.bgm.exists():
        log.error("Missing --bgm: %s", args.bgm)
        sys.exit(1)

    args.workdir.mkdir(parents=True, exist_ok=True)
    audio_path = args.workdir / "narration.mp3"

    generate_tts(args.script, audio_path, args.voice)
    audio_dur = probe_duration(audio_path)
    log.info("Narration duration: %.1fs", audio_dur)

    concatenated = concat_clips(args.clips_dir, args.workdir)
    matched = match_video_to_audio(concatenated, audio_dur, args.workdir)
    mux_final_video(matched, audio_path, args.bgm, args.output)

    log.info("Done. Final video: %s", args.output.resolve())


if __name__ == "__main__":
    main()
