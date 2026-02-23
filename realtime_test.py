"""Real-time SSE streaming test using requests with iter_lines."""
import requests
import json
import time

print("=== Real-time SSE Test ===", flush=True)
start = time.time()

r = requests.post(
    "http://127.0.0.1:3000/api/chat",
    json={"message": "یک برنامه سفر ۲ روزه شیراز بده", "locale": "fa"},
    stream=True,
    timeout=(10, 180)  # 10s connect, 180s read
)
t_hdrs = time.time() - start
print(f"Headers at {t_hdrs:.1f}s: {r.status_code}", flush=True)
print(f"X-Session-Id: {r.headers.get('x-session-id', 'NONE')}", flush=True)

events = 0
full = ""
for line in r.iter_lines(decode_unicode=True):
    if not line:
        continue
    now = time.time() - start
    events += 1
    if line.startswith("data: "):
        try:
            d = json.loads(line[6:])
            if d.get("token"):
                full += d["token"]
            if events <= 5 or events % 20 == 0 or d.get("done"):
                print(f"Event {events} at {now:.1f}s: {line[:80]}", flush=True)
        except:
            if events <= 5:
                print(f"Event {events} at {now:.1f}s: {line[:80]}", flush=True)

total = time.time() - start
print(f"\n=== Summary ===", flush=True)
print(f"Headers: {t_hdrs:.1f}s | Total: {total:.1f}s | Events: {events}", flush=True)
print(f"\n=== AI Response ({len(full)} chars) ===", flush=True)
print(full[:500], flush=True)
