import requests
import time

# First warm up the model with a tiny request
print("Warming up model...")
start = time.time()
r = requests.post(
    "http://127.0.0.1:11434/api/chat",
    json={"model": "gemma3:4b", "messages": [{"role": "user", "content": "test"}], "stream": False, "options": {"num_predict": 5}},
    timeout=60
)
print(f"Warmup done in {time.time()-start:.1f}s: {r.json().get('message',{}).get('content','')[:50]}")

# Now test through the full Next.js pipeline
print("\nTesting full pipeline...")
start = time.time()
first_token = None
r = requests.post(
    "http://127.0.0.1:3000/api/chat",
    json={"message": "سلام! بهترین رستوران های تهران کجاست؟", "locale": "fa"},
    stream=True,
    timeout=300
)
print(f"Status: {r.status_code}")
print(f"Content-Type: {r.headers.get('content-type', 'N/A')}")

count = 0
full_text = ""
for line in r.iter_lines():
    count += 1
    if line:
        text = line.decode('utf-8')
        if first_token is None and 'token' in text:
            first_token = time.time() - start
            print(f"First token at: {first_token:.1f}s")
        if 'token' in text:
            import json as jsonlib
            try:
                data = jsonlib.loads(text.replace('data: ', ''))
                full_text += data.get('token', '')
            except:
                pass
        if count <= 10 or count % 20 == 0:
            print(f"  [{count}] {text[:150]}")
    if count > 200:
        print("... (truncated)")
        break

elapsed = time.time() - start
print(f"\nTotal time: {elapsed:.1f}s, Lines: {count}")
print(f"Response preview: {full_text[:500]}")
