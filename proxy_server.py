import http.server
import requests
# create a server that has one route :
# /
# it has a query parameter called url
# it will make a request to the url and return the response

# let's create a handler


class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        print(self.path)
        # get the url from the query parameter
        url = "=".join(self.path.split('=')[1:])
        print('url')
        # make a request to the url
        response = requests.get(url)
        # return the response
        self.send_response(response.status_code)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response.content)

    # handle OPTIONS requests
    def do_OPTIONS(self):
        # send the headers back
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With')
        self.end_headers()

# create a server


server = http.server.HTTPServer(('localhost', 8090), ProxyHandler)
print('Server running on localhost:8090')
server.serve_forever()
