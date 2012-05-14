(function( $ ) {

  var methods = {
    init : function( options ) {
      var settings = {
        'loading'            : false,
        'pagination'         : false,
        'perPage'            : 20,
        'start'              : 0,
        'paginationOptions'  : {},
        'photoSize'          : 400,
        'videoSize'          : false,
        'timeago'            : true,
        'shortLength'        : 50,
        'mediumLength'       : 100,
        'fancybox'           : true,
        'photoThumbSize'     : 75,
        'photoLightboxSize'  : 500,
        'timeout'            : 10000
        };
      var that = this;
      
      return this.each(function() {        
        // If options exist, lets merge them with our default settings
        var $this = $(this),
          data = $this.data('tumblr'),
          posts = $('<div/>');

        // If the plugin hasn't been initialized yet
        if ( ! data ) {
          if ( options ) { 
            $.extend( settings, options );
          }
          if( settings.pagination ) {
            settings.pagination = $(settings.pagination);
            if( settings.pagination.length < 1 ) {
              settings.pagination = false;
            }
          }
          if( settings.loading ) {
            settings.loading = $(settings.loading);
            if( settings.loading.length < 1 ) {
              settings.loading = false;
            }
          }
          $(this).data('tumblr', {
            target           : $this,
            start            : settings.start,
            options          : settings,
            posts            : posts,
            pagination_setup : false 
          });
        }
        $this.tumblr('load');
      });
    },
    
    /**
     * Load the tumblr feed.
     * 
     * @param Int page    The page number to load (starts at 0).
     */
    load: function(page) {

      // Show all the loaders and slide up the content.
      this.each(function() {
        var $this = $(this),
          data = $this.data('tumblr');
        if(data.options.loading) {
          data.options.loading.show();
        }
        $this.slideUp();
      });

      var $this = this, 
        data = this.data('tumblr'),
        params = {
          start: page == undefined ? data.start * data.options.perPage : page * data.options.perPage,
          num: data.options.perPage
        },
        url = data.options.url + '/api/read/json?' + $.param(params);        

      $.ajax({
        url: url,
        dataType: 'script',
        timeout: data.options.timeout,
        success: function() {
          $this.tumblr('handleAjaxSuccess', tumblr_api_read);
        },
        error: function (xhr, statusTxt, errorTxt) {
          // Unlikely that this will be supported because in probably 99.9% of cases it will be cross domain. Will only work if they have setup a tunnel...
          $this.append(
            '<h2>Ooops...</h2>' +
            '<p>It looks like tumblr is having issues - it happens to the best of us. Don\'t worry it should be fixed soon!</p>' +
            '<p style="display: none;">' + errorTxt + ': ' + xhr.responseText + '</p>'
          );
        }
      });
      return this;
    },
    
    handleAjaxSuccess: function(tumblr_api_read) {
      return this.each(function() {
        var $this = $(this),
          data = $this.data('tumblr'),
          posts = data.posts,
          postIterator = 0;

        data.posts.empty();
        $this.empty();
        if ((tumblr_api_read == undefined) || (tumblr_api_read == null)) {
          $this.append('<div class="tumblr-error">Unable to load tumblr - its probably down...</div>');
          return;
        }
        
        $.each(tumblr_api_read.posts, function(i, post) {
          $this.tumblr('addPost', post, postIterator);
          postIterator++;
        });
        
        if(data.options.timeago && $("abbr.timeago", data.posts).length > 0) {
          $("abbr.timeago", data.posts).timeago();
        }
        if(data.options.fancybox && $("a.lightbox", data.posts).length > 0) {
          $("a.lightbox", data.posts).fancybox();
        }
        $this.html(data.posts);
        if(data.options.loading) {
          data.options.loading.hide();
        }
        $this.slideDown();
        
        if(data.options.pagination && !data.pagination_setup) {
          data.pagination_setup = true;
          $.extend(
            data.options.paginationOptions, 
            {
                  items_per_page : data.options.perPage,
                  callback       : function(new_page_index, pagination_container) {
                    $this.tumblr('load', new_page_index);  
                  }
            }
          );
          data.options.pagination.pagination(tumblr_api_read['posts-total'], data.options.paginationOptions);
        }
      });
    },

    addPost: function(post, i) {
      var $this = $(this),
        data = $this.data('tumblr'),
        oddeven = i%2 ? 'even' : 'odd',
        body = '',
        li = '';
        
      // Add the li to the posts stack.
      li = 
        '<li><article><header><h3><a href="' + post['url-with-slug'] + 
        '" title="' + post['regular-title'] + '"></a>' + 
        post['regular-title'] + '</h3>' +
        '<p class="meta">' + post['date'] + '</p></header>' +
        (post['regular-body'] || "")
          .replace(/<p>/, '<p class="dropcap">') +
        '</article></li>';

      if(post.type==="regular") {
        data.posts.append(li);
      }
    },

    getCssTextLength: function(text) {
      var $this = $(this),
        data = $this.data('tumblr'),
        shortLength = data.options.shortLength,
        mediumLength = data.options.mediumLength;

      var extraClass = 'long';
      if(text != null && text.length < shortLength) {
        extraClass = 'short';
      }
      else if(text != null && text.length < mediumLength) {
        extraClass = 'medium';
      }
      return extraClass;
    },

    destroy: function() {
      return this.each(function(){
        var $this = $(this),
          data = $this.data('tumblr');
        // Namespacing FTW
        $(window).unbind('.tumblr');
        data.posts.remove();
        $this.removeData('tumblr');
      });
    },
  };

  $.fn.tumblr = function( method ) {
      // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };
})( jQuery );