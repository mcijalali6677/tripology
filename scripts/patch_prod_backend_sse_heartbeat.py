from __future__ import annotations

from pathlib import Path


TARGET = Path("/opt/tripology/backend/app/api/v1/chat.py")


def main() -> None:
    text = TARGET.read_text(encoding="utf-8")

    changed = False

    if "asyncio.wait(" in text and "create_task" in text and "heartbeat" in text:
        print("already patched (heartbeat)")
    else:
        if "\nimport asyncio\n" not in text:
            if "\nimport json\n" not in text:
                raise SystemExit("PATCH_FAILED: import json not found")
            text = text.replace("\nimport json\n", "\nimport asyncio\nimport json\n", 1)
            changed = True

        if "\nimport contextlib\n" not in text:
            if "\nimport asyncio\n" in text:
                text = text.replace("\nimport asyncio\n", "\nimport asyncio\nimport contextlib\n", 1)
                changed = True

        done_line = "            yield f\"data: {json.dumps({'done': True, 'content': full_response})}"
        done_idx = text.find(done_line)
        if done_idx == -1:
            raise SystemExit("PATCH_FAILED: done-yield line not found")

        # Replace the heartbeat/token loop in-place.
        wait_for_idx = text.find("await asyncio.wait_for(token_stream.__anext__()")
        while_true_idx = text.rfind("            while True:", 0, done_idx)
        if wait_for_idx != -1 and while_true_idx != -1 and while_true_idx < done_idx:
            loop_start = while_true_idx
        else:
            # Fallback: look for the older async-for block
            loop_start = text.find("            async for token in chat_agent.chat_stream(")
            if loop_start == -1:
                raise SystemExit("PATCH_FAILED: could not locate token loop to replace")

        hb_loop = (
            "            next_token_task = asyncio.create_task(token_stream.__anext__())\n"
            "            try:\n"
            "                while True:\n"
            "                    done, _pending = await asyncio.wait({next_token_task}, timeout=5.0)\n"
            "                    if not done:\n"
            "                        yield f\"data: {json.dumps({'status': 'thinking', 'heartbeat': True})}\\n\\n\"\n"
            "                        continue\n\n"
            "                    try:\n"
            "                        token = next_token_task.result()\n"
            "                    except StopAsyncIteration:\n"
            "                        break\n\n"
            "                    full_response += token\n"
            "                    yield f\"data: {json.dumps({'token': token})}\\n\\n\"\n"
            "                    next_token_task = asyncio.create_task(token_stream.__anext__())\n"
            "            finally:\n"
            "                if next_token_task and not next_token_task.done():\n"
            "                    next_token_task.cancel()\n"
            "                    with contextlib.suppress(Exception):\n"
            "                        await next_token_task\n"
        )

        text = text[:loop_start] + hb_loop + text[done_idx:]
        changed = True
        print("patched (heartbeat)")

    # Ensure SSE is never gzipped
    if "\"Content-Encoding\": \"identity\"" not in text:
        marker = "\"X-Accel-Buffering\": \"no\","  # already exists in headers
        if marker not in text:
            print("WARN: could not find X-Accel-Buffering header to add Content-Encoding")
        else:
            text = text.replace(
                marker,
                marker + "\n            \"Content-Encoding\": \"identity\"," ,
            )
            changed = True
            print("patched (content-encoding)")

    if changed:
        TARGET.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
