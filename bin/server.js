var director = require('director')
  , stat     = require('node-static')
  , file     = new stat.Server('./public/')
  , home     = require('../routes/home')
  , speakers = require('../routes/speakers')
  , routes   = 
    { "/"                         : { get: home}
    , "/reverse-call-for-speakers" : {get: speakers}
    }
  , router = new director.http.Router(routes)
  ;

var server = require('http').createServer(function(req, res) {
  router.dispatch(req, res, function(err) {
    if (err) {
      file.serve(req, res);
      return;
    }
  });
});

server.listen(8080);