#!/usr/bin/env node
var fs = require('fs'),
    path = require('path'),
    srcFile = process.argv[2];

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

  data = data.replace(
    /<!--START-SCRIPT-TAGS(.|\s|\n)*END-SCRIPT-TAGS-->/gm, 
    '<script src="assets/js/lxjs.min.js"></script>'
  );

  fs.writeFile(srcFile, data, 'utf-8', function(err) {
    if(err) throw err;
    console.log('file '+srcFile+' is ready');
  });
});
