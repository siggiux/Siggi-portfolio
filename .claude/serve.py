#!/usr/bin/env python3
import os
import functools
import http.server
import socketserver

PROJECT_DIR = "/Users/sigurdurgudmundsson/Documents/Projects/Siggi-portfolio"

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=PROJECT_DIR)

port = int(os.environ.get("PORT", "0"))
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("127.0.0.1", port), Handler)
actual_port = httpd.server_address[1]
print(f"serving {PROJECT_DIR} on port {actual_port}", flush=True)
httpd.serve_forever()
