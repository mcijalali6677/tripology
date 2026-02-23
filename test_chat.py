import requests
import time
import json

start = time.time()
try:
    r = requests.post(
        "http://127.0.0.1:3000/api/chat",
        json={"message": "Hello! What are the top places to visit in Tehran?", "locale": "en"},
        stream=True,
        timeout=180
    )
    print(f"Status: {r.status_code}")
    print(f"Content-Type: {r.headers.get('content-type', 'N/A')}")

    count = 0
    for line in r.iter_lines():
        count += 1
        if line:
            text = line.decode('utf-8')
            print(text[:300])
        if count > 50:
            print("... (truncated)")
            break

    elapsed = time.time() - start
    print(f"\nTotal time: {elapsed:.1f}s, Lines: {count}")
except Exception as e:
    elapsed = time.time() - start
    print(f"ERROR after {elapsed:.1f}s: {e}")
