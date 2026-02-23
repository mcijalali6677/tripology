"""Test with a real travel question to verify streaming with longer responses."""
import http.client
import json
import time

print("=== Travel Question Streaming Test ===", flush=True)
start = time.time()

conn = http.client.HTTPConnection("127.0.0.1", 3000, timeout=300)
payload = json.dumps({
    "message": "برنامه سفر ۳ روزه اصفهان با جاهای دیدنی و رستوران و هزینه",
    "locale": "fa"
})
conn.request("POST", "/api/chat", body=payload, headers={"Content-Type": "application/json"})
print(f"Request sent at {time.time()-start:.1f}s", flush=True)

resp = conn.getresponse()
t_hdrs = time.time() - start
print(f"Headers at {t_hdrs:.1f}s: {resp.status}", flush=True)
print(f"X-Session-Id: {resp.getheader('x-session-id')}", flush=True)

buf = b""
events = 0
first_byte = None
full_text = ""

while True:
    byte = resp.read(1)
    if not byte:
        break
    if first_byte is None:
        first_byte = time.time() - start
        print(f"First byte at {first_byte:.1f}s", flush=True)
    buf += byte
    if buf.endswith(b"\n\n"):
        events += 1
        line = buf.decode("utf-8", errors="replace").strip()
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
                if data.get("token"):
                    full_text += data["token"]
                if events <= 5 or events % 20 == 0:
                    now = time.time() - start
                    print(f"Event {events} at {now:.1f}s: {line[:80]}", flush=True)
            except:
                pass
        buf = b""

total = time.time() - start
print(f"\n=== Summary ===", flush=True)
print(f"Headers: {t_hdrs:.1f}s | First byte: {first_byte:.1f}s | Total: {total:.1f}s", flush=True)
print(f"Events: {events}", flush=True)
print(f"\n=== Response (first 500 chars) ===", flush=True)
print(full_text[:500], flush=True)
conn.close()
