#!/usr/bin/env python3
"""
Lightweight GitHub webhook listener.
Listens on port 9000 for push events and triggers deploy.sh
"""
import http.server
import json
import subprocess
import hmac
import hashlib
import os
import threading

PORT = 9000
SECRET = os.environ.get('WEBHOOK_SECRET', 'tripology-deploy-secret-2026')
DEPLOY_SCRIPT = '/opt/tripology/deploy.sh'
LOG = '/var/log/tripology-deploy.log'

class WebhookHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/webhook':
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        # Verify GitHub signature
        sig_header = self.headers.get('X-Hub-Signature-256', '')
        if SECRET and sig_header:
            expected = 'sha256=' + hmac.new(
                SECRET.encode(), body, hashlib.sha256
            ).hexdigest()
            if not hmac.compare_digest(sig_header, expected):
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b'Invalid signature')
                return

        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return

        ref = payload.get('ref', '')
        if ref == 'refs/heads/master':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Deploying...')
            # Run deploy in background thread
            threading.Thread(target=run_deploy, daemon=True).start()
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(f'Ignored ref: {ref}'.encode())

    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        with open(LOG, 'a') as f:
            f.write(f'[webhook] {args[0]}\n')

def run_deploy():
    with open(LOG, 'a') as f:
        f.write('[webhook] Starting deploy...\n')
    subprocess.run(['/bin/bash', DEPLOY_SCRIPT],
                   stdout=open(LOG, 'a'),
                   stderr=subprocess.STDOUT)

if __name__ == '__main__':
    server = http.server.HTTPServer(('0.0.0.0', PORT), WebhookHandler)
    print(f'Webhook server listening on port {PORT}')
    server.serve_forever()
