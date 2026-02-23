import re

with open('/etc/nginx/sites-enabled/tripology', 'r') as f:
    conf = f.read()

# Increase proxy_read_timeout from 120s to 300s for all locations
conf = conf.replace('proxy_read_timeout 120s;', 'proxy_read_timeout 300s;')

with open('/etc/nginx/sites-enabled/tripology', 'w') as f:
    f.write(conf)

print('Updated proxy_read_timeout to 300s')
