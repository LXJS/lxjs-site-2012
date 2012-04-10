var marked = require('marked')
  , plates = require('plates')
  , fs = require('fs')
  , layout = fs.readFileSync(__dirname + '/../assets/layout.html', 'utf8')
  , homepage = plates.bind(layout, {
      main: marked(fs.readFileSync(__dirname + '/../assets/home.md', 'utf8'))
    })
  ;

function index() {
  this.res.writeHead(200, {'Content-Type': 'text/html'});
  this.res.end(homepage);
}

module.exports = index;