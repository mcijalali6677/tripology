import requests
import time
import json
import sys

print("Testing full pipeline (Next.js -> FastAPI -> Ollama)...", flush=True)
start = time.time()
first_token = None
full_text = ""
count = 0

try:
    r = requests.post(
        "http://127.0.0.1:3000/api/chat",
        json={"message": "سلام! بهترین رستوران های تهران کجاست؟", "locale": "fa"},
        stream=True,
        timeout=300
    )
    print(f"Status: {r.status_code}", flush=True)
    print(f"Content-Type: {r.headers.get('content-type', 'N/A')}", flush=True)

    for line in r.iter_lines():
        count += 1
        if line:
            text = line.decode('utf-8')
            if first_token is None and 'token' in text:
                first_token = time.time() - start
                print(f"First token at: {first_token:.1f}s", flush=True)
            if text.startswith('data: '):
                try:
                    data = json.loads(text[6:])
                    if data.get('token'):
                        full_text += data['token']
                    if data.get('sessionId'):
                        print(f"SessionId: {data['sessionId']}", flush=True)
                    if data.get('done'):
                        print(f"Stream done!", flush=True)
                except:
                    pass
            if count <= 5:
                print(f"  [{count}] {text[:200]}", flush=True)
        if count > 500:
            print("... (truncated)", flush=True)
            break

    elapsed = time.time() - start
    print(f"\nTotal time: {elapsed:.1f}s, Lines: {count}", flush=True)
    print(f"Tokens: ~{len(full_text.split())}", flush=True)
    print(f"\n--- RESPONSE ---", flush=True)
    print(full_text[:1000], flush=True)
    print(f"\n--- END ---", flush=True)
except Exception as e:
    print(f"ERROR after {time.time()-start:.1f}s: {e}", flush=True)
    sys.exit(1)
