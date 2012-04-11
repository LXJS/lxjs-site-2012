var marked = require('marked')
  , plates = require('plates')
  , fs = require('fs')
  ;



module.exports = function(layout) {
  var page = plates.bind(layout, {
      main: marked(fs.readFileSync(__dirname + '/../assets/speakers.md', 'utf8'))
  });
  
  return function index() {
    this.res.writeHead(200, {'Content-Type': 'text/html'});
    this.res.end(page);
  }
};