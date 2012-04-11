var marked = require('marked')
  , plates = require('plates')
  , fs = require('fs')
  , layout = fs.readFileSync(__dirname + '/../assets/layout.html', 'utf8')
  , page = plates.bind(layout, {
      main: marked(fs.readFileSync(__dirname + '/../assets/speakers.md', 'utf8'))
    })
  ;

function index() {
  this.res.writeHead(200, {'Content-Type': 'text/html'});
  this.res.end(page);
}

module.exports = index;