/* Author: Quodis */

window.APP = {};

(function() {
  var toActivate = 3;
  
  WebFontConfig = {
    google: { families: [ 'Asap:400' , 'Asap:700' , 'Asap:400italic' ] },
    fontactive: function(fontFamily,fontDescription) {
      toActivate--;
      
      if (toActivate === 0) {
        window.APP.fontActive = true;
        if (window.jQuery) {
          jQuery(document).trigger('APP.fontActive');
        }
      }
    }
  };

  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

$(function() {
  
  $(document).on('APP.fontActive', function() {
    var $navLinks = $('#page_nav a'),
      pageNavHeight = $('#page_nav').height(),
      scrollTimeout = null,
      sections = [],
      positions = [],
      $twitterFeed = $('#twitter_feed'),
      isKonamied = false,
      konami;
    
    /**
     * ANIMATIONS
     *
     */
    
    $('.panel').hover(function(){
      $(this).addClass('flip');
    }, function() {
      $(this).removeClass('flip');
    });
    
    /**
     * LAYOUT
     *
     */
     
    // Carousel
    $('.carousel').each(function() {
      if ($(this).is('visible')) {
        $(this).carousel();
      }
    });    

    // Masonry
    $('#speakers .entry_list').masonry({
      // options
      itemSelector : '.entry_item',
      columnWidth : 110,
      gutterWidth: 10
    });
    
    $('#sponsors .entry_list').masonry({
      // options
      itemSelector : '.block',
      columnWidth : 110,
      gutterWidth: 10
    });
    
    $('#contacts .entry_list').masonry({
      // options
      itemSelector : '.entry_item',
      columnWidth : 150,
      gutterWidth: 10
    });  
    
    $('.section').each(function() {
      sections.push('#' + $(this).attr('id'));
    });
    
    positions = $.map(sections, function(id) {
      return $(id).position().top;
    });
    
    /**
     * TWITTER
     *
     */
    
    if ($twitterFeed.length) {
    
      $twitterFeed.tweet({
        query: '#lxjs OR @lxjs OR "Lisbon JavaScript"',
        count: 3,
        loading_text: "Loading"
      });
      
    }
    
    $('#tumblr_feed').tumblr(
      { url     : 'http://lxjs.tumblr.com'
      , perPage : 1
      , loading : '#loading'
      , timeago : false
      });
    
    /**
     * MAPS
     *
     */
     
    function loadMaps($panel) {
      $panel.find('.map').show().each(function() {
        var $this = $(this),
          lat = parseFloat($this.attr('data-latitude'), 10),
          lng = parseFloat($this.attr('data-longitude'), 10),
          map,
          latlng = new L.LatLng(lat, lng),
          cloudmadeUrl = 'http://{s}.tile.cloudmade.com/dd360f93c4904fd18c0db65bfa686937/997/256/{z}/{x}/{y}.png',
          cloudmade = new L.TileLayer(cloudmadeUrl, {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
          }),
          Icon = L.Icon.extend({
            iconUrl: 'assets/images/marker.png',
            shadowUrl: 'assets/images/marker-shadow.png',
            iconSize: new L.Point(25, 41),
            shadowSize: new L.Point(41, 41),
            iconAnchor: new L.Point(12, 41),
            popupAnchor: new L.Point(-3, -76)
          }),
          marker = new L.Marker(latlng, {icon: new Icon()});
        
        if (!lat || !lng || $this.hasClass('leaflet-container')) return false;
        
        map = new L.Map($this.get(0), {
          center: latlng,
          layers: [cloudmade],
          zoom: 15
        });
        
        map.addLayer(marker);
      });
    }
    
    /**
     * NAVIGATION
     *
     */
     
    $('#page_nav').on('click', 'a', function(evt) {
      var $this = $(this),
      target = $this.attr('href'),
      targetId = target.substring(1);
      
      if (document.getElementById(targetId) === null) return false;
      
      // Push history
      $.bbq.pushState('/' + targetId, 2);
      
      // Prevent default behaviour
      evt.preventDefault();
    });
    
    function getNavSection(scrollTop) {
      for (var i = 1, len = positions.length; i < len; i++) {
        if (scrollTop < positions[i]) {
          return sections[i-1];
        }
      }
      return sections[sections.length - 1];
    }
    
    function highlightNavAt(position, changeHash) {
      var section = getNavSection(position);
      
      if (changeHash) {
        $(window).off('hashchange', hashChangeHandler);
        $.bbq.pushState('/' + section.replace('#', ''), 2);
        setTimeout(function() {
          $(window).on('hashchange', hashChangeHandler);
        }, 0);
      }
      
      $navLinks.removeClass('active').filter('[href="' + section + '"]').addClass('active');
    }
    
    function highlightCurrentNav(changeHash) {
      highlightNavAt($(window).scrollTop() + pageNavHeight, changeHash);
    }
    
    $(window).scroll(function() {      
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(function() {
        highlightCurrentNav(true);
      }, 150);
    });
    
    
    // Tab panels
    $('.tabs').on('click', 'a', function(evt) {
      var $this = $that = $(this),
        $parent = $this.parents('.section'),
        panel = $this.attr('href').replace('#', ''),
        $panel = $parent.find('.panel[data-panel="' + panel + '"]')
      
      if ($this.hasClass('active')) return false;
      
      $parent.find('.panel .map').hide();
        
      $parent.find('.panel.active').fadeOut('fast', function() {
        $parent.find('.tabs a').removeClass('active');
        $this.addClass('active');
      
        $panel.fadeIn('fast', function() {
          $panel.addClass('active');
          loadMaps($panel);
          $panel.find('.carousel').carousel();
          
          // Recalculate positions
          positions = $.map(sections, function(id) {
            return $(id).position().top;
          });
        });
      });
      
      evt.preventDefault();
    });
    

    /**
     * HISTORY
     *
     */
     
    function hashChangeHandler(evt) {
      // Get state
      var url = $.param.fragment().replace('/', '');
      
      if (url) {
        // Scroll to section
        $.scrollTo('#' + url, 'normal');
      }
      
      evt.preventDefault();
    }
    
    $(window).on('hashchange', hashChangeHandler);
    
    // Trigger for url present on first load
    $(window).trigger('hashchange');
    highlightCurrentNav(false);
    
    
    /**
     * KONAMI CODE
     *
     */
     
    konami = new Konami();
    
    konami.code = function() {
      if (!isKonamied) {
        logoFall();
        isKonamied = true;
      } else {
        $('#konami_easter_egg').remove();
        isKonamied = false;
      }
    };
    
    konami.iphone.code = konami.code;
    
    konami.load();
    
    function logoFall() {
      var canvas, 
        $canvas, 
        context,
        x, 
        y, 
        radius = 25, 
        clickX, 
        clickY, 
        drag = false,
        total_dots = 75,
        fps = 24,
        dots = new Array(),
        drag_i = -1,
        gravity = .05,
        friction = .98,
        bounce = -.96,
        wrap = true,
        float = true,
        imgs = new Array(),
        img1 = new Image(),
        img2 = new Image(),
        img3 = new Image(),
        this_dot = {},
        resizeTimeout;
      
      canvas = document.createElement('canvas');
      canvas.id = 'konami_easter_egg';
      canvas.width = $(window).width();
      canvas.height = $(window).height();
      $canvas = $(canvas);
      $canvas.css({position: 'fixed', zIndex: 8000, top: 0, left: 0});
      context = canvas.getContext("2d");
      
      $(window).resize(function() {
        if (resizeTimeout) clearTmeout(resizeTimeout);
        scrollTimeout = setTimeout(function() {
          canvas.width = $(window).width();
          canvas.height = $(window).height();
        }, 250);
      })
      
      img1.src = "assets/images/footer_bg.png";
      img2.src = "assets/images/easter_egg.png";
      img3.src = "assets/images/crockford.jpg";
      
      imgs[0] = img1;
      imgs[1] = img2;
      
      for (var i=0; i < total_dots; i++){
        createDot();
      }
      function createDot(x, y, r, vx, vy){
        var this_dot = {
          x:      typeof(x) != 'undefined' ? x : Math.random()*canvas.width, 
          y:      typeof(y) != 'undefined' ? y : Math.random()*-canvas.height,
          radius: typeof(r) != 'undefined' ? r : 25,
          scale:  Math.floor(10 + (1+50-10)*Math.random()),
          vx:     typeof(vx) != 'undefined' ? vx : Math.random()*3-1,
          vy:     typeof(vy) != 'undefined' ? vy : Math.random()*3,
          //this will pick a digit 1, 2 or 3 and set it as the src value, this could also be a Math.floor(Math.random()*3)+1 to really be random
          src:    (dots.length % 3) + 1,
          r:      0,
          vr:     0
        };
        dots.push(this_dot);
      }
      
      $canvas.mousedown(function (event) {
        createDot(event.pageX - this.offsetLeft-25, event.pageY - this.offsetTop-25);
      });
      
     
      $canvas.mouseup(function (event) {
        drag = false;
        drag_i = -1;
      });
      
      function update(){
        var this_dot;
        
        for (var i=0; i < dots.length; i++){
          if (drag_i != i){
            this_dot = dots[i];
            if (float){
              this_dot.vx += Math.random() - .5;
              this_dot.vy += Math.random() - .5;
              this_dot.vr += Math.random()*.01 - .005;
            }
            this_dot.vx *= friction;
            this_dot.vy = this_dot.vy * friction + gravity;
            this_dot.x += this_dot.vx;
            this_dot.y += this_dot.vy;
            this_dot.r += this_dot.vr;
            
              if (this_dot.x > canvas.width + this_dot.radius){
                  this_dot.x -= canvas.width + this_dot.radius*2;
                  this_dot.vr = 0;
              }
              else if(this_dot.x < 0 - this_dot.radius){
                  this_dot.x += canvas.width + this_dot.radius*2;
                  this_dot.vr = 0;
              }
              if (this_dot.y > canvas.height + this_dot.radius){
                  this_dot.y -= canvas.height + this_dot.radius*2;
                  this_dot.vr = 0;
              }
            
          }
        }
      }
      function draw() {
        var i, src;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (i=0; i < dots.length; i++){
          src = img1;
          
          
          if (dots[i].src == 1) {
            src = img2;
          } else if (dots[i].src == 2) {
            src = img3;
          }
          
          context.save();
          context.translate(dots[i].x+dots[i].scale/2, dots[i].y+dots[i].scale/2);
          context.rotate(dots[i].r);
          context.translate(-dots[i].x-dots[i].scale/2, -dots[i].y-dots[i].scale/2);
          context.drawImage(src, dots[i].x, dots[i].y, dots[i].scale, dots[i].scale);
          context.restore();
        }
      }
      
      $('body').append(canvas);
      
      setInterval(function() {
        update();
        draw();
      }, 1000/fps);
      
      draw();
      
    }
    
  });
  
  if (window.APP.fontActive) $(document).trigger('APP.fontActive');
});