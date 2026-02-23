"""Test SSE streaming with iter_content for chunk-level visibility."""
import requests
import json
import time
import sys

print("=== Chunk-level SSE Test ===", flush=True)
start = time.time()

r = requests.post(
    "http://127.0.0.1:3000/api/chat",
    json={"message": "سلام", "locale": "fa"},
    stream=True,
    timeout=(10, 180)
)
t_hdrs = time.time() - start
print(f"Headers at {t_hdrs:.1f}s: {r.status_code}", flush=True)
print(f"X-Session-Id: {r.headers.get('x-session-id', 'NONE')}", flush=True)

chunks = 0
total_bytes = 0
for chunk in r.iter_content(chunk_size=256):
    if not chunk:
        continue
    chunks += 1
    total_bytes += len(chunk)
    now = time.time() - start
    text = chunk.decode("utf-8", errors="replace").strip()
    if chunks <= 5 or chunks % 10 == 0:
        preview = text[:120].replace("\n", " ")
        print(f"  Chunk {chunks} at {now:.1f}s ({len(chunk)}B): {preview}", flush=True)

total = time.time() - start
print(f"\nDone: {chunks} chunks, {total_bytes}B in {total:.1f}s", flush=True)
