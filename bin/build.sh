#/bin/bash
BASEDIR=$1
cat \
  $BASEDIR/assets/js/libs/jquery.masonry.min.js \
  $BASEDIR/assets/js/libs/jquery.scrollTo-1.4.2-min.js \
  $BASEDIR/assets/js/libs/jquery.ba-bbq.min.js \
  $BASEDIR/assets/js/libs/leaflet.js \
  $BASEDIR/assets/js/libs/bootstrap-transition.js \
  $BASEDIR/assets/js/libs/bootstrap-modal.js \
  $BASEDIR/assets/js/libs/bootstrap-carousel.js \
  $BASEDIR/assets/js/libs/jquery.tweet.js \
  $BASEDIR/assets/js/libs/jquery.tumblr.js \
  $BASEDIR/assets/js/libs/konami.js \
  $BASEDIR/assets/js/general.js \
  >$BASEDIR/assets/js/lxjs.js
./node_modules/uglify-js/bin/uglifyjs $BASEDIR/assets/js/lxjs.js > $BASEDIR/assets/js/lxjs.min.js
./bin/replace_script_tags.js $BASEDIR/index.html
