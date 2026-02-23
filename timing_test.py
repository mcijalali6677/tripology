import requests, time

s = requests.post('http://127.0.0.1:8000/api/v1/chat/sessions', json={'title': 'timing test'})
sid = s.json()['id']
print(f'Session: {sid}')

t0 = time.time()
r = requests.post(
    f'http://127.0.0.1:8000/api/v1/chat/sessions/{sid}/stream',
    json={'message': 'hello'},
    stream=True,
    timeout=120
)
t_headers = time.time()
print(f'Headers at: {t_headers-t0:.1f}s  Status: {r.status_code}')

chunks = 0
for chunk in r.iter_content(chunk_size=64):
    chunks += 1
    if chunks <= 3:
        print(f'Chunk {chunks} at {time.time()-t0:.1f}s: {chunk[:60]}')
    elif chunks == 4:
        print('...')

t_end = time.time()
print(f'Done. {chunks} chunks in {t_end-t0:.1f}s')
