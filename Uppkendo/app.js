'use strict';

(function() {
    var app = {
        data: {}
    };

    var bootstrap = function() {
		
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                //platform:'ios7',
                transition: 'slide',
				layout:"mobile-tabstrip",
                initial: 'components/homeView/view.html',
            });
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            
            var element = document.getElementById('appDrawer');
            if (typeof(element) != 'undefined' && element !== null) {
                if (window.navigator.msPointerEnabled) {
                    $('#navigation-container').on('MSPointerDown', 'a', function(event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $('#navigation-container').on('touchstart', 'a', function(event) {
                        app.keepActiveState($(this));
                    });
                }
            }

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }
    if (kendo.support.mobileOS.android) {
        $(document).on({
            ajaxStart: function() {
                //alert('Inicio');
                var $div = $('<div id = "cargando" class="modall"></div>');
                $("body").append($div);
                $("#cargando").show().css('display', 'block');
            },
            ajaxStop: function() {
                $("#cargando").show().css('display', 'none');
                $('#cargando').remove();
                //alert('Fin');
            }
        });
    }
	
    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li a.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

// START_CUSTOM_CODE_uppkendo


// END_CUSTOM_CODE_uppkendo