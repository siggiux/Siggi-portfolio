#!/usr/bin/env python3
import http.server

PORT = 3000
DIRECTORY = "/Users/sigurdurgudmundsson/Documents/Projects/Siggi-portfolio"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass  # suppress request logs

if __name__ == "__main__":
    with http.server.HTTPServer(("", PORT), Handler) as httpd:
        print(f"Serving {DIRECTORY} on port {PORT}", flush=True)
        httpd.serve_forever()
