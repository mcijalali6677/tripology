import re

with open('/etc/nginx/sites-enabled/tripology', 'r') as f:
    conf = f.read()

# Add SSE settings (proxy_buffering off and X-Accel-Buffering) to all location blocks
# Insert after every proxy_read_timeout 120s;
conf = conf.replace(
    'proxy_read_timeout 120s;\n    }',
    'proxy_read_timeout 120s;\n        # SSE support\n        proxy_buffering off;\n        proxy_set_header X-Accel-Buffering no;\n    }'
)

with open('/tmp/tripology_nginx_new', 'w') as f:
    f.write(conf)

print('Done')
import subprocess
subprocess.run(['diff', '/etc/nginx/sites-enabled/tripology', '/tmp/tripology_nginx_new'])
