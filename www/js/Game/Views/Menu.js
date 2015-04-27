(function (ns) {
    ns.Menu = skui.extend(function () {
        $(window).on('resize.menu', this.setMenuDimensions.bind(this));
        $(window).on('loadMenu', this.loadMenu.bind(this));

        InitializeView('app.ui.DimensionsHandler');
        InitializeView('app.ui.UsersHandler');
    }, {
        loadMenu: function (e, data) {
            $('body').prop('class', 'menu');
            this.levelIndex = data.levelIndex;
            $('body .menuContainer').load('Levels/Easy/level1.html', this.menuLoaded.bind(this));
            $(window).trigger('setLevelDimensions', { width: $(window).width(), height: $(window).height() });
            this.setMenuDimensions();
        },
        setMenuDimensions: function () {
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();
            var menuZoomFactor = 23;
            var wideMarginFactor = 13;
            $('body .menuContainer').css('fontSize', windowHeight / menuZoomFactor);

            var wideWindowTopMargin = 0;
            if (windowWidth > windowHeight) {
                wideWindowTopMargin = (windowWidth / windowHeight) * wideMarginFactor;
            }

            var marginTop = (windowHeight - $('body .menuContainer').height()) / 2;
            $('body .menuContainer').css('marginTop', marginTop + wideWindowTopMargin);
        },
        menuLoaded: function () {
            if (this.levelIndex>1)
            {
                $('body .menuContainer .continue').removeClass('disabled');
            }
            var me = this;
            $('body .menuContainer .newGame').click(function () {
                InitializeView('app.ui.Game');
                me.unloadMenu();
                $(window).trigger('setGameIndex', [1]);
            });
            $('body .menuContainer .continue').click(function () {
                if (!$(this).hasClass('disabled')) {
                    InitializeView('app.ui.Game');
                    me.unloadMenu();
                    $(window).trigger('setGameIndex', [me.levelIndex]);
                }
            });
        },
        unloadMenu: function () {
            $('body').prop('class', '');
            $('body .menuContainer').remove();
            $(window).off('resize.menu');
        }
    });
})(skui.resolve('app.ui'));