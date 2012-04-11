var marked = require('marked')
  , plates = require('plates')
  , fs = require('fs')
  ;

module.exports = function(layout) {
    var homepage = plates.bind(layout, {
          homeinsert: fs.readFileSync(__dirname + '/../assets/homeinsert.html', 'utf8')
        , main: marked(fs.readFileSync(__dirname + '/../assets/home.md', 'utf8'))
    });

    return function index() {
      this.res.writeHead(200, {'Content-Type': 'text/html'});
      this.res.end(homepage);
    }
};