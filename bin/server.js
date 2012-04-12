var HTTPServer = require('http-server').HTTPServer;

var httpServer = new HTTPServer({
    root: './public/'
});

httpServer.listen(process.env.PORT || process.env.C9_PORT || 8080);

process.on('SIGINT', function() {
  httpServer.log('http-server stopped.'.red);
  return process.exit();
});
