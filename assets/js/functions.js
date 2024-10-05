/*
 * Template functions file.
 *
 */
jQuery( function() { "use strict";

	var screen_has_mouse = false,
		$window = jQuery( window ),
		$body = jQuery( "body" ),
		$top = jQuery( "#top-header" ),
		$featured = jQuery( "#featured" );

	// Simple way of determining if user is using a mouse device.
	function themeMouseMove() {
		screen_has_mouse = true;
	}
	function themeTouchStart() {
		$window.off( "mousemove.balena" );
		screen_has_mouse = false;
		setTimeout(function() {
			$window.on( "mousemove.balena", themeMouseMove );
		}, 250);
	}
	if ( ! navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
		$window.on( "touchstart.balena", themeTouchStart ).on( "mousemove.balena", themeMouseMove );
		if ( window.navigator.msPointerEnabled ) {
			document.addEventListener( "MSPointerDown", themeTouchStart, false );
		}
	}

	if ( window.matchMedia( "(prefers-reduced-motion)" ) ) {
		document.documentElement.className += " reduced-motion";
	}

	// Handle both mouse hover and touch events for traditional menu + mobile hamburger.
	jQuery( "#menu-toggle" ).on( "click.balena", function( e ) {
		$body.toggleClass( "mobile-menu-opened" );
		e.stopPropagation();
		e.preventDefault();
	});

	jQuery( "#menu-main .current-menu-parent" ).addClass( "collapse" );

	jQuery( document ).on({
		mouseenter: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).addClass( "hover" );
			}
		},
		mouseleave: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).removeClass( "hover" );
			}
		}
	}, ".site-navigation .menu li" );

	if ( jQuery( "html" ).hasClass( "touchevents" ) ) {
		jQuery( ".site-navigation .menu .menu-item-has-children > a" ).on( "click.balena", function (e) {
			if ( ! screen_has_mouse && ! window.navigator.msPointerEnabled && ! jQuery( "#menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( ".site-navigation .menu .menu-item-has-children" ).not( $parent ).removeClass( "hover" );
				}
				$parent.toggleClass( "hover" );
				e.preventDefault();
			}
		});
	} else {
		// Toggle visibility of dropdowns on keyboard focus events.
		jQuery( ".site-navigation .menu li > a, .site-identity a, .site-general-information a, .featured-text a" ).on( "focus.balena blur.balena", function(e) {
			if ( screen_has_mouse && ! jQuery( "#menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( ".site-navigation .menu .menu-item-has-children.hover" ).not( $parent ).removeClass( "hover" );
				}
				if ( $parent.hasClass( "menu-item-has-children" ) ) {
					$parent.addClass( "hover" );
				}
				e.preventDefault();
			}
		});
	}

	jQuery( ".site-navigation .menu .menu-item-has-children > a" ).on( "click.balena", function (e) {
		if ( jQuery( "#menu-toggle" ).is( ":visible" ) ) {
			jQuery( this ).parent().toggleClass( "collapse" );
			e.preventDefault();
		}
	});

	// Toggle visibility of dropdowns if touched outside the menu area.
	jQuery( document ).on( "click.balena", function(e) {
		if ( jQuery( e.target ).parents( ".site-navigation .menu" ).length > 0 ) {
			return;
		}
		jQuery( ".site-navigation .menu .menu-item-has-children" ).removeClass( "hover" );
	});

	// Handle navigation stickiness.
	if ( $body.hasClass( "navbar-sticky" ) ) {
		var top_nav_height, featured_height;

		var update_sticky_nav_variables = function() {
			top_nav_height  = $top.outerHeight();
			featured_height = $featured.outerHeight() + top_nav_height;
		};

		update_sticky_nav_variables();

		jQuery( window ).on( "resize.balena", function() {
			if ( window.innerWidth >= 992 ) {
				var isFixed = $body.hasClass( "navbar-is-sticky" );
				$body.removeClass( "navbar-is-sticky" );
				update_sticky_nav_variables();
				if ( isFixed ) {
					$body.addClass( "navbar-is-sticky" );
				}

				// On scroll, we want to stick/unstick the navigation.
				if ( ! $top.hasClass( "navbar-sticky-watching" ) ) {
					$top.addClass( "navbar-sticky-watching" );
					jQuery( window ).on( "scroll.balena", function() {
						var isFixed = $body.hasClass( "navbar-is-sticky" );
						if ( 1 > ( featured_height - window.pageYOffset ) ) {
							if ( ! isFixed ) {
								$body.addClass( "navbar-is-sticky" );
								if ( parseInt( $featured.css( "margin-top" ), 10 ) != top_nav_height ) {
									$featured.css( "margin-top", top_nav_height );
								}
							}
						} else {
							if ( isFixed ) {
								$body.removeClass( "navbar-is-sticky" );
								$featured.css( "margin-top", "" );
							}
						}
					} ).scroll();
				}
			} else {
				if ( $top.hasClass( "navbar-sticky-watching" ) ) {
					$top.removeClass( "navbar-sticky-watching" );
					jQuery( window ).unbind( "scroll.balena" );
					$body.removeClass( "navbar-is-sticky" );
					$featured.css( "margin-top", "" );
				}
			}
		}).resize();
	}

	if ( jQuery.fancybox ) {
		jQuery.fancybox.defaults.hideScrollbar = false;
		jQuery.fancybox.defaults.backFocus     = false;
	}

	if ( jQuery.fn.Zebra_DatePicker ) {
		jQuery.fn.Zebra_DatePicker.defaults = {
			format: "F j, Y",
			first_day_of_week: parseInt( balena_l10n.first_day_of_week, 10 ),
			weekend_days: [ parseInt( balena_l10n.weekend1, 10 ), parseInt( balena_l10n.weekend2, 10 ) ],
			disabled_dates: balena_l10n.disabled_dates,
			custom_classes: {
				"not-available":  balena_l10n.disabled_dates
			},
			enabled_dates: balena_l10n.enabled_dates,
			days: balena_l10n.days,
			months: balena_l10n.months,
			header_captions: {
				days: "F Y",
				months: "Y",
				years: "Y1 - Y2"
			},
			navigation: [ balena_l10n.arrowLeft, balena_l10n.arrowRight, "", "" ],
			disable_time_picker: false,
			show_icon: false,
			readonly_element: false,
			show_clear_date: false,
			show_select_today: false
		};
		jQuery( ".booking-form #checkin" ).Zebra_DatePicker({
			container: jQuery( ".booking-form .checkin" ),
			direction: true,
			pair: jQuery( ".booking-form #checkout" ),
			open_on_focus: true,
			onSelect: function() {
				jQuery( ".booking-form #checkout" ).focus();
			}
		});

		jQuery( ".booking-form #checkout" ).Zebra_DatePicker({
			container: jQuery( ".booking-form .checkout" ),
			direction: 1,
			open_on_focus: true
		});
	}

	// Handle tab navigation with hash links.
	jQuery( ".tabs a" ).on( "click.balena", function (e) {
		if ( jQuery( this ).hasClass( "tab-link-active" ) ) {
			e.preventDefault();
			return;
		}
		var $target = jQuery( jQuery( this ).attr( "href" ) );
		$target.attr( "data-id", $target.attr( "id" ) ).attr( "id", "" );
	});

	jQuery( window ).on( "hashchange", function() {
		if ( ! window.location.hash ) {
			return;
		}
		var $active_tab_content = jQuery( '.tab-content[data-id="' + window.location.hash.substring( 1 ) + '"]' );
		if ( $active_tab_content.length == 0 ) {
			return;
		}
		$active_tab_content.attr( "id", $active_tab_content.data( "id" ) );
		var $tab_container = $active_tab_content.parent();
		$tab_container.find( ".tab-content:not(#" + $active_tab_content.data( "id" ) + ")" ).removeClass( "tab-active" );
		$active_tab_content.addClass( "tab-active" );
		$tab_container.find( ".tabs a" ).removeClass( "tab-link-active" ).filter( '[href="' + window.location.hash + '"]' ).addClass( "tab-link-active" );
	});

	if ( window.location.hash ) {
		var $active_tab = jQuery( '.tabs a[href="' + window.location.hash + '"]' ), offset_correction;
		if ( $active_tab.length > 0 ) {
			$active_tab.trigger( "click" );
			jQuery( window ).trigger( "hashchange" );
		}
	}
	jQuery( ".tab-container" ).addClass( "tabs-loaded" );

	// Scroll top top functionality.
	var $goToTopLink = jQuery( ".to-the-top" ).on( "click.balena", function( e ) {
		if ( $body.hasClass( "reduced-motion" ) ) {
			window.scrollTo(0, 0);
		} else {
			jQuery( "html, body" ).animate( {
				scrollTop: 0
			}, {
				duration: 300,
				easing: "swing"
			} );
		}
		e.stopPropagation();
		e.preventDefault();
	});

});
