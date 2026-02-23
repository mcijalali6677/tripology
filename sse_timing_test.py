"""SSE timing test: prints when headers, thinking, first token arrive.

Designed to avoid client-side buffering issues by parsing SSE events from raw bytes.
"""

from __future__ import annotations

import json
import time
from typing import Optional

import requests


def main() -> None:
    url = "http://127.0.0.1:3000/api/chat"
    payload = {
        "message": "یک برنامه سفر ۳ روزه اصفهان با جاهای دیدنی و غذا و هزینه بده",
        "locale": "fa",
    }

    print("=== SSE timing test ===", flush=True)
    start = time.time()

    r = requests.post(url, json=payload, stream=True, timeout=(10, 240))
    t_headers = time.time() - start
    print(f"Headers: {t_headers:.2f}s  status={r.status_code}", flush=True)
    print(f"Content-Type: {r.headers.get('content-type')}", flush=True)
    print(f"X-Session-Id: {r.headers.get('x-session-id')}", flush=True)

    buf = b""
    events = 0
    t_thinking: Optional[float] = None
    t_first_token: Optional[float] = None

    for chunk in r.iter_content(chunk_size=64):
        if not chunk:
            continue
        buf += chunk

        while b"\n\n" in buf:
            raw, buf = buf.split(b"\n\n", 1)
            if not raw:
                continue

            # SSE can include multiple lines; keep only data lines
            for line in raw.split(b"\n"):
                line = line.strip()
                if not line.startswith(b"data: "):
                    continue

                data_str = line[6:].decode("utf-8", errors="replace").strip()
                if not data_str:
                    continue

                now = time.time() - start
                events += 1

                # Try parse JSON
                try:
                    obj = json.loads(data_str)
                except Exception:
                    obj = None

                if isinstance(obj, dict):
                    if obj.get("status") == "thinking" and t_thinking is None:
                        t_thinking = now
                        print(f"thinking: {t_thinking:.2f}s", flush=True)
                    if obj.get("token") and t_first_token is None:
                        t_first_token = now
                        print(f"first_token: {t_first_token:.2f}s  sample={obj.get('token')!r}", flush=True)
                    if obj.get("done"):
                        print(f"done: {now:.2f}s  events={events}", flush=True)
                        print("=== Summary ===", flush=True)
                        print(f"headers={t_headers:.2f}s thinking={t_thinking} first_token={t_first_token} events={events}", flush=True)
                        return

                # Print a few early events for visibility
                if events <= 5:
                    preview = data_str
                    if len(preview) > 140:
                        preview = preview[:140] + "…"
                    print(f"event {events} @ {now:.2f}s: {preview}", flush=True)

    end = time.time() - start
    print("=== End of stream ===", flush=True)
    print(f"total={end:.2f}s events={events} thinking={t_thinking} first_token={t_first_token}", flush=True)


if __name__ == "__main__":
    main()
