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
			$twitterFeed = $('#twitter_feed');
		
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
		$('.carousel').carousel();
		
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
				username: "lxjs",
				count: 3,
				loading_text: "Loading Tweets..."
			});
			
		}
		
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
			var $this = $(this),
				$parent = $this.parents('.section'),
				panel = $this.attr('href').replace('#', ''),
				$panel = $parent.find('.panel[data-panel="' + panel + '"]')
			
			if ($this.hasClass('active')) return false;
			
			$parent.find('.panel:visible .map').hide();
				
			$parent.find('.panel:visible').fadeOut('fast', function() {
				$parent.find('.tabs a').removeClass('active');
				$this.addClass('active');
			
				$panel.fadeIn('fast', function() {
					loadMaps($panel);
					$panel.find('.carousel').carousel();
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
	
	});
	
	if (window.APP.fontActive) $(document).trigger('APP.fontActive');
});