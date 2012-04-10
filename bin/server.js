var director = require('director')
    static = require('node-static')
    file = new static.Server('./public/');
    ;

var home = require('../routes/home')

var routes = {
  "/": { get: home}
}

var router = new director.http.Router(routes)



var server = require('http').createServer(function(req, res) {
  router.dispatch(req, res, function(err) {
    if (err) {
      file.serve(req, res)
    }
  })
});

server.listen(8080);