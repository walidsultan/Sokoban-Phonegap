(function (ns) {
    ns.Game = skui.extend(function () {
        $(window).on('updateLevelName', this.updateLevelName.bind(this));
        $(window).on('setGameIndex', this.setGameIndex.bind(this));
        $(window).on('setFF', this.setFF.bind(this));
        $(window).on('levelSolved', this.onLevelSolved.bind(this));
        $(window).on('addMovementIncident', this.updateMovementStatus.bind(this));
        $(window).on('loadNextLevel', this.resetGameCounters.bind(this))
        $(window).on('reloadLevel', this.resetGameCounters.bind(this))
        $(window).on('movesDecremented', this.decrementMovesCount.bind(this));
        $(window).on('pushesDecremented', this.decrementPushesCount.bind(this));
        $(window).on('highlightError', this.highlightError.bind(this));

        this.gameTime = 0;
        this.movesCount = 0;
        this.pushesCount = 0;

        this.loadGame();
    }, {
        updateLevelName: function (e, levelId) {
            $('body .gameStatusContainer .levelId').text(levelId);
        },
        loadGame: function () {
            $('body .gameStatusContainer').load('Views/Game.html', this.gameViewLoaded.bind(this));
        },
        gameViewLoaded: function () {
            InitializeView('app.ui.KeyboardHandler');
            InitializeView('app.ui.ModalsHandler');
            InitializeView('app.ui.StateManager');
            InitializeView('app.ui.PathFinder');
            InitializeView('app.ui.CollisionDetector');
            InitializeView('app.ui.LevelLoader');

            $(window).trigger('setLevelIndex', this.levelIndex);
            $('.sffNavigator .back').on('touchstart mousedown',this.onBackMouseDown.bind(this));
            $('.sffNavigator .back').on('touchend mouseup', this.onBackMouseUp.bind(this));
            $('.sffNavigator .reload').click(this.reloadLevel.bind(this));
        },
        setGameIndex: function (e, levelIndex) {
            this.levelIndex = levelIndex;
        },
        setFF: function (e, isSFF) {
            this.isSFF = isSFF;

            if (this.intervalId == null) {
                this.intervalId = setInterval(this.setTimer.bind(this), 1000);
            }
        },
        setTimer: function () {
            $('body .gameStatusContainer .time').text(this.gameTime);

            this.gameTime++;
        },
        onLevelSolved: function () {
            clearInterval(this.intervalId);
            this.intervalId = null;
            $(window).trigger('showLevelSolvedDialog', { movesCount: this.movesCount, pushesCount: this.pushesCount, time: this.gameTime });
        },
        updateMovementStatus: function (e, data) {
            if (data.block.type == ObjectType.box) {
                this.pushesCount++;
                $('body .gameStatusContainer .pushesCount').text(this.pushesCount);
            } else {
                this.movesCount++;
                $('body .gameStatusContainer .movesCount').text(this.movesCount);
            }
        },
        resetGameCounters: function () {
            this.gameTime = 0;
            this.pushesCount = 0;
            this.movesCount = 0;
            $('body .gameStatusContainer .time').text(this.gameTime);
            $('body .gameStatusContainer .pushesCount').text(this.pushesCount);
            $('body .gameStatusContainer .movesCount').text(this.movesCount);
        },
        decrementMovesCount: function () {
            this.movesCount--;
            $('body .gameStatusContainer .movesCount').text(this.movesCount);
        },
        decrementPushesCount: function () {
            this.pushesCount--;
            $('body .gameStatusContainer .pushesCount').text(this.pushesCount);
        },
        onBackMouseDown: function () {
            this.mouseDown = true;
            this.undoLastMovement();
        },
        undoLastMovement: function () {
            if(!this.mouseDown) return;

            $(window).trigger('undoLastMovement');

            setTimeout(this.undoLastMovement.bind(this),200);
        },
        onBackMouseUp: function () {
            this.mouseDown = false;
        },
        reloadLevel: function () {
            $(window).trigger('reloadLevel');
        },
        highlightError: function (e, targetBlock) {
            var borderWidth = parseInt($('.errorBlock').css('border-left-width'));
            $('.errorBlock').clone().appendTo('.gameContainer').css({
                'left': targetBlock.domElement.position().left,
                'top': targetBlock.domElement.position().top,
                'width': targetBlock.domElement[0].getBoundingClientRect().width - borderWidth*2,
                'height': targetBlock.domElement[0].getBoundingClientRect().height - borderWidth * 2,
                'display': 'block'
            });

            var me = this;
            setTimeout(function () {
                $('.gameContainer .errorBlock').remove();
            }, 500);
        }
    });
})(skui.resolve('app.ui'));