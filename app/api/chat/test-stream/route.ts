/**
 * Simple SSE test endpoint to verify streaming works in Next.js 16
 */
export const maxDuration = 60;

export async function GET() {
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  (async () => {
    for (let i = 0; i < 5; i++) {
      await writer.write(encoder.encode(`data: {"count": ${i}, "message": "hello"}\n\n`));
      await new Promise((r) => setTimeout(r, 500));
    }
    await writer.write(encoder.encode(`data: {"done": true}\n\n`));
    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
