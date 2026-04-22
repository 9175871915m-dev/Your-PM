#!/usr/bin/env python3
"""
Batch background removal for 360 animation frames.
Input:  /Users/mustafaanwarsayyed/Your PM/Animation videos/00001.jpg ... 00360.jpg
Output: /Users/mustafaanwarsayyed/Your PM/pm-guide/public/frames/frame_001.jpg ... frame_360.jpg
- Background removed by rembg (AI u2net model)
- Composited onto pure white #FFFFFF
- Upscaled 1280x720 -> 1920x1080 (LANCZOS)
- JPEG quality 88
"""

import os
import io
import sys
from rembg import remove, new_session
from PIL import Image

SRC_DIR  = "/Users/mustafaanwarsayyed/Your PM/Animation videos"
DEST_DIR = "/Users/mustafaanwarsayyed/Your PM/pm-guide/public/frames"
TOTAL    = 360
OUT_W, OUT_H = 1920, 1080

os.makedirs(DEST_DIR, exist_ok=True)

# Use u2net — good for objects with soft edges
session = new_session("u2net")

for i in range(1, TOTAL + 1):
    src_name  = f"{i:05d}.jpg"
    dest_name = f"frame_{i:03d}.jpg"
    src_path  = os.path.join(SRC_DIR, src_name)
    dest_path = os.path.join(DEST_DIR, dest_name)

    # Skip if already done
    if os.path.exists(dest_path):
        print(f"[skip] {dest_name}", flush=True)
        continue

    if not os.path.exists(src_path):
        print(f"[miss] {src_name} not found", flush=True)
        continue

    try:
        with open(src_path, "rb") as f:
            inp = f.read()

        # AI background removal
        out_bytes = remove(inp, session=session)

        # Composite onto white
        fg = Image.open(io.BytesIO(out_bytes)).convert("RGBA")
        bg_color = (10, 10, 10, 255)
        bg_layer = Image.new("RGBA", fg.size, bg_color)
        bg_layer.paste(fg, mask=fg.split()[3])
        result = bg_layer.convert("RGB")

        # Upscale to 1920x1080 for crisp rendering
        result = result.resize((OUT_W, OUT_H), Image.LANCZOS)

        result.save(dest_path, "JPEG", quality=88, optimize=True)
        print(f"[ok]   {i:03d}/360  {dest_name}", flush=True)

    except Exception as e:
        print(f"[err]  {i:03d}/360  {e}", flush=True)

print("BATCH COMPLETE", flush=True)
