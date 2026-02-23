#!/usr/bin/env python3
"""Fix Nginx config to add webhook location block"""

with open('/etc/nginx/sites-available/tripology') as f:
    lines = f.readlines()

# Remove any broken webhook block
new_lines = []
skip = False
for line in lines:
    if 'location /webhook' in line:
        skip = True
        continue
    if skip and line.strip() == '}':
        skip = False
        continue
    if skip:
        continue
    new_lines.append(line)

# Webhook block with proper nginx variables
insert = """    location /webhook {
        proxy_pass http://127.0.0.1:9000/webhook;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
    }
"""

# Insert before the very last line (which should be closing brace of server block)
new_lines.insert(len(new_lines) - 1, insert)

with open('/etc/nginx/sites-available/tripology', 'w') as f:
    f.writelines(new_lines)
print('NGINX_FIXED')
