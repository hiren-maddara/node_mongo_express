const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url);
  res.end("Hello from server"); //send back response

  //basic routing
  if (req.url === "/" || req.url === "/overview") {
    res.end("This is overview");
  } else if (req.url === "/product") {
    res.end("This is product");
  } else {
    // res.writeHead(404);
    res.end("Page not found");
  }
});

server.listen(8000, "127.0.0.1");
