import requests
import time
import sys

print("Warming up gemma3:4b model...", flush=True)
start = time.time()
try:
    r = requests.post(
        "http://127.0.0.1:11434/api/chat",
        json={
            "model": "gemma3:4b",
            "messages": [{"role": "user", "content": "hi"}],
            "stream": False,
            "options": {"num_predict": 3}
        },
        timeout=120
    )
    elapsed = time.time() - start
    print(f"Model warm! Took {elapsed:.1f}s", flush=True)
    print(f"Response: {r.json().get('message',{}).get('content','')[:50]}", flush=True)
except Exception as e:
    print(f"Warmup failed after {time.time()-start:.1f}s: {e}", flush=True)
    sys.exit(1)
