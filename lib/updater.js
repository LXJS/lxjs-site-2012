var githook = require('githubhook'),
    spawn = require('child_process').spawn;

var PUBLIC_PATH = '/home/trodrigues/lxjs.org/htdocs',
    SOURCE_PATH = '/tmp/lxjs';

function cleanup(done) {
  console.log('cleaning');
  var rm = spawn('rm', ['-rf', SOURCE_PATH]);
  rm.stdout.setEncoding('utf-8');
  rm.stdout.on('data', function(data) { console.log('done cleaning'); console.log(data); });
  if(done) done();
}

function copyFiles() {
  var rmdest = spawn('rm', ['-rf', PUBLIC_PATH]);
  rmdest.stdout.setEncoding('utf-8');
  rmdest.stdout.on('data', function(data) { console.log(data); });

  rmdest.stderr.setEncoding('utf-8');
  rmdest.stderr.on('data', function(data) { console.log(data); });

  rmdest.on('exit', function(){
    var cp = spawn('mv', [SOURCE_PATH+'/public', PUBLIC_PATH]);

    cp.stdout.setEncoding('utf-8');
    cp.stdout.on('data', function(data) { console.log(data); });

    cp.stderr.setEncoding('utf-8');
    cp.stderr.on('data', function(data) { console.log(data); });

    cp.on('exit', function(code) {
      console.log('done with cp', code);
      cleanup();
    });
  });
}

function cloneRepo() {
  var clone = spawn('git', ['clone', 'git@github.com:pgte/lxjs.git', SOURCE_PATH]);

  clone.stdout.on('data', function(data) { console.log(data); });
  clone.stdout.setEncoding('utf-8');

  clone.stderr.on('data', function(data) { console.log(data); });
  clone.stderr.setEncoding('utf-8');

  clone.on('exit', function(code) {
    if(code === 0)
      copyFiles();
    else
      console.log('fail on cloning');
  });
}

cleanup(function() {
  cloneRepo();

  githook(3045, {
    'github': 'https://github.com/pgte/lxjs'
  }, function(err, response) {
    if(response.ref.indexOf('master') >= 0){
      console.log('Commit by '+ response.pusher.name +' at '+response.head_commit.timestamp);
      cloneRepo();
    }
  });
});
