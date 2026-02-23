"""Fast SSE streaming test with proper chunked reading."""
import socket
import json
import time

print("=== Fast SSE Streaming Test ===", flush=True)
start = time.time()

# Use raw socket for maximum control over buffering
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(("127.0.0.1", 3000))
sock.settimeout(120)

# Send HTTP request
payload = json.dumps({"message": "سلام خوبی؟ یک برنامه سفر ۲ روزه شیراز بده", "locale": "fa"})
request = (
    f"POST /api/chat HTTP/1.1\r\n"
    f"Host: 127.0.0.1:3000\r\n"
    f"Content-Type: application/json\r\n"
    f"Content-Length: {len(payload.encode())}\r\n"
    f"Connection: close\r\n"
    f"\r\n"
    f"{payload}"
)
sock.sendall(request.encode())
print(f"Request sent at {time.time()-start:.1f}s", flush=True)

# Read response with timing
data = b""
events = 0
first_byte = None
headers_end = None

while True:
    try:
        chunk = sock.recv(1024)
        if not chunk:
            break
        now = time.time() - start
        
        if first_byte is None:
            first_byte = now
            print(f"First byte at {now:.1f}s", flush=True)
        
        data += chunk
        
        # Check if we have headers
        if headers_end is None and b"\r\n\r\n" in data:
            headers_end = now
            hdr_end_idx = data.index(b"\r\n\r\n")
            headers = data[:hdr_end_idx].decode("utf-8", errors="replace")
            print(f"Headers complete at {now:.1f}s", flush=True)
            for line in headers.split("\r\n")[:5]:
                print(f"  {line}", flush=True)
        
        # Count SSE events in this chunk
        text = chunk.decode("utf-8", errors="replace")
        new_events = text.count("data: ")
        if new_events:
            events += new_events
            print(f"  +{new_events} events at {now:.1f}s (total: {events})", flush=True)
            
    except socket.timeout:
        print(f"Socket timeout at {time.time()-start:.1f}s", flush=True)
        break

total = time.time() - start
print(f"\n=== Summary ===", flush=True)
print(f"First byte: {first_byte:.1f}s" if first_byte else "No data", flush=True)
print(f"Headers: {headers_end:.1f}s" if headers_end else "No headers", flush=True)
print(f"Total events: {events} in {total:.1f}s", flush=True)

# Extract response text
full = data.decode("utf-8", errors="replace")
tokens = []
for line in full.split("\n"):
    if line.startswith("data: "):
        try:
            d = json.loads(line[6:])
            if d.get("token"):
                tokens.append(d["token"])
        except:
            pass
response_text = "".join(tokens)
print(f"\n=== AI Response ({len(response_text)} chars) ===", flush=True)
print(response_text[:400], flush=True)

sock.close()
