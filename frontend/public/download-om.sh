#!/bin/bash
# Run this once to download the Om chant audio for the website
# Requires yt-dlp: pip install yt-dlp
# Or install via: sudo apt install yt-dlp

echo "Downloading Om chant audio..."
yt-dlp -x --audio-format mp3 --audio-quality 5 \
  -o "om-chant.%(ext)s" \
  "https://www.youtube.com/watch?v=oRmSfJK5jg8"

echo "Done! om-chant.mp3 is ready. Place it in frontend/public/"
