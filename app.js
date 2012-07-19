var Static = require('node-static')
  , file   = new(Static.Server)('./static');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
}).listen(8081);
console.log("im on 8081");