import http.server, socketserver, filesystem_bundler

PORT = 33003
class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/programs.js":
            filesystem_bundler.update_programs()
            print("rebuilt filesystem!")
        return super().do_GET()
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

handler_object = RequestHandler
with socketserver.TCPServer(("", PORT), handler_object) as httpd:
    print(f"serving at: http://localhost:{PORT}")
    print("press ctrl+c to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("stopped soyserver")