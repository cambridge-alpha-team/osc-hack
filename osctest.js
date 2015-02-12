
var osc = require('node-osc');
var oscClient = new osc.Client('127.0.0.1', 4557);

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

var STATIC = path.join(process.cwd(), "unvisual-frontend");

http.createServer(function(request, response) {

  var ROOT = "/unvisual/";

  var uri = url.parse(request.url).pathname;
  if (uri.indexOf(ROOT) !== 0) {
      response.writeHead(302, {"Location": ROOT});
      response.end();
      return;
  }
  uri = uri.slice(ROOT.length);

  console.log(request.method, JSON.stringify(uri));

  if (uri.indexOf("rest") === 0) {
    if (request.method !== "POST") {
      response.writeHead(400, {"Content-Type": "text/plain"});
      response.write("400 Bad Request\n");
      response.end();
      return;
    }

    var body = "";

    request.on("data", function(chunk) {
        body += chunk;
    });

    request.on("end", function() {
      switch (uri) {
        case "rest/osc/run":
          oscClient.send('/run-code', body);

          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write("OK\n");
          response.end();
          return;

        case "rest/osc/stop":
          oscClient.send('/stop-all-jobs', body);

          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write("OK\n");
          response.end();
          return;

        default:
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write("404 Not Found\n");
          response.end();
          return;
      }
      return;
    });

    return;
  }

  if (request.method !== "GET") {
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("400 Bad Request\n");
    response.end();
    return;
  }

  var filename = path.join(STATIC, uri);

  var FORMATS = {
    ".css": "text/css",
    ".html": "text/html",
    ".js": "text/javascript",
  };

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    var ext = path.extname(filename);

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, {
        "Content-Type": FORMATS[ext] || "application/octet-stream",
      });
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Server running at\n  => http://localhost:" + port + "/");
console.log("CTRL + C to shutdown");

