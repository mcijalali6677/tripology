"""Streaming test - reads SSE byte-by-byte to detect real-time token delivery."""
import http.client
import json
import time
import sys

print("=== SSE Streaming Test ===", flush=True)
start = time.time()

conn = http.client.HTTPConnection("127.0.0.1", 3000, timeout=300)
payload = json.dumps({"message": "hi", "locale": "en"})
conn.request("POST", "/api/chat", body=payload, headers={"Content-Type": "application/json"})
print(f"Request sent at {time.time()-start:.1f}s", flush=True)

resp = conn.getresponse()
t_hdrs = time.time() - start
print(f"Headers at {t_hdrs:.1f}s: {resp.status} {resp.reason}", flush=True)
print(f"Content-Type: {resp.getheader('content-type')}", flush=True)
print(f"X-Session-Id: {resp.getheader('x-session-id')}", flush=True)
print(f"Transfer-Encoding: {resp.getheader('transfer-encoding')}", flush=True)

# Read byte by byte to detect streaming
buf = b""
events = 0
first_byte_time = None
last_event_time = None

while True:
    byte = resp.read(1)
    if not byte:
        break

    if first_byte_time is None:
        first_byte_time = time.time() - start
        print(f"First byte at {first_byte_time:.1f}s", flush=True)

    buf += byte

    # Check for complete SSE event (ends with \n\n)
    if buf.endswith(b"\n\n"):
        events += 1
        now = time.time() - start
        line = buf.decode("utf-8", errors="replace").strip()
        if events <= 5:
            print(f"Event {events} at {now:.1f}s: {line[:100]}", flush=True)
        elif events == 6:
            print(f"... (showing every 10th event from now)", flush=True)
        elif events % 10 == 0:
            print(f"Event {events} at {now:.1f}s: {line[:80]}", flush=True)
        last_event_time = now
        buf = b""

total = time.time() - start
print(f"\n=== Summary ===", flush=True)
print(f"Headers: {t_hdrs:.1f}s", flush=True)
print(f"First byte: {first_byte_time:.1f}s" if first_byte_time else "No data", flush=True)
print(f"Last event: {last_event_time:.1f}s" if last_event_time else "No events", flush=True)
print(f"Total events: {events}", flush=True)
print(f"Total time: {total:.1f}s", flush=True)
conn.close()
