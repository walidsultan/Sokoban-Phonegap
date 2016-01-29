(function (ns) {
    ns.LevelSelector = skui.extend(function (data) {
        this.loadLevelSelector();
        this.levelIndex = data.levelIndex;
        $(window).on('returnBack', this.returnToMenu.bind(this));
        this.isGroupSelected = false;
    }, {
        unlockSolvedGroups: function () {
            var me = this;
            $('.levelGroup').each(function () {
                if ($(this).attr('minIndex') < me.levelIndex) {
                    $(this).find('.title').addClass('unlocked');

                    //Unlock individual levels
                    var maxLevel = me.levelIndex - $(this).attr('minIndex');
                    $(this).find('.level:lt(' + maxLevel + ')').addClass('unlocked');
                }
            });
        },
        loadLevelSelector: function (e, data) {
            $('body').prop('class', 'levelSelector');
            $('body .levelSelectorContainer').load('Views/LevelSelector.html', this.levelSelectorLoaded.bind(this));
        },
        levelSelectorLoaded: function () {
            this.unlockSolvedGroups();
            var me = this;
            $('body .levelSelectorContainer .title').click(function () {
                if ($(this).hasClass('unlocked')) {
                    var groupIndex = $(this).parents('.levelGroup').attr('minIndex');
                    $(this).parents('.levelGroup').find('.content').appendTo('body .levelSelectorContainer').attr('groupIndex', groupIndex);
                    $('body .levelSelectorContainer .levelGroup').remove();
                    me.isGroupSelected = true;
                }
            });

            $('.levelSelectorContainer .level').click(function () {
                if ($(this).hasClass('unlocked')) {
                    var groupIndex = $(this).parents('.content').attr('groupIndex');
                    var levelIndex = parseInt(groupIndex )+ $(this).index()+1;
                    InitializeView('app.ui.Game');
                    me.unloadLevelSelector();
                    $(window).trigger('setGameIndex', [levelIndex]);
                }
            });
        },
        unloadLevelSelector: function () {
            this.isGroupSelected = false;
            $('body .levelSelectorContainer').html('').attr('style', '');
            $(window).off('resize.menu');
        },
        returnToMenu: function () {
            if (this.isGroupSelected) {
                $('body .levelSelectorContainer').load('Views/LevelSelector.html', this.levelSelectorLoaded.bind(this));
            } else {
                $(window).off();
                this.unloadLevelSelector();
                InitializeView('app.ui.Menu');
            }
        }
    });
})(skui.resolve('app.ui'));