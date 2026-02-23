import http.client
import json
import time
import sys

# Simple test using bare http.client to avoid any request library quirks
print("Sending request to Next.js /api/chat...", flush=True)
start = time.time()

conn = http.client.HTTPConnection("127.0.0.1", 3000, timeout=300)
payload = json.dumps({"message": "hi", "locale": "en"})
headers = {"Content-Type": "application/json"}

conn.request("POST", "/api/chat", body=payload, headers=headers)
print(f"Request sent at {time.time()-start:.1f}s, waiting for response...", flush=True)

resp = conn.getresponse()
print(f"Got response at {time.time()-start:.1f}s: {resp.status} {resp.reason}", flush=True)
print(f"Content-Type: {resp.getheader('content-type')}", flush=True)

# Read data in chunks
total = 0
first_data = None
while True:
    chunk = resp.read(4096)
    if not chunk:
        break
    total += len(chunk)
    if first_data is None:
        first_data = time.time() - start
        print(f"First data at: {first_data:.1f}s", flush=True)
        text = chunk.decode('utf-8', errors='replace')
        print(f"Data preview: {text[:500]}", flush=True)

elapsed = time.time() - start
print(f"\nTotal: {total} bytes in {elapsed:.1f}s", flush=True)
conn.close()
