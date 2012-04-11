var director = require('director')
  , stat     = require('node-static')
  , fs       = require('fs')
  , file     = new stat.Server('./public/')
  , layout   = fs.readFileSync(__dirname + '/../assets/layout.html', 'utf8')
  ;

var routes = {};

[
    ''
  , 'where'
  , 'tickets'
  , 'reverse-call-for-speakers'
  , 'schedule'
  , 'about'
].forEach(function(route) {
  routes['/' + route] = { get: require('../routes/' + (route || 'home'))(layout) }
})

var router = new director.http.Router(routes)

require('http').createServer(function(req, res) {
  router.dispatch(req, res, function(err) {
    if (err) {
      file.serve(req, res)
    }
  })
}).listen(8080)