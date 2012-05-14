var fs = require('fs'),
    path = require('path'),
    srcFile = process.argv[2];

    console.log('changing '+ srcFile);
if(!srcFile){
  console.log('fail');
  process.exit(1);
}

if(path.existsSync(path.dirname(srcFile)+'/../.git')){
  console.log('do NOT run this in development');
  process.exit(1);
}

fs.readFile(srcFile, 'utf-8', function(err, data) {
  if(err) throw err;
  console.log('replacing');
  console.log(/<!--START-SCRIPT-TAGS(.|\s|\n)*END-SCRIPT-TAGS-->/g.exec(data));

  data = data.replace(
    /<!--START-SCRIPT-TAGS(.|\s|\n)*END-SCRIPT-TAGS-->/g, 
    '<script src="assets/js/lxjs.min.js"></script>'
  );

  console.log('writing');
  fs.writeFile(srcFile, data, 'utf-8', function(err) {
    if(err) throw err;
    console.log('file '+srcFile+' is ready');
  });
});
