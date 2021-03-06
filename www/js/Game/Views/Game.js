﻿(function (ns) {
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
        $(window).on('returnBack', this.returnToMenu.bind(this));

        this.gameTime = 0;
        this.movesCount = 0;
        this.pushesCount = 0;
        this.lastMouseDownTime = 0;

        this.loadGame();
    }, {
        updateLevelName: function (e, levelId) {
            this.levelId = levelId;
            $('body .gameStatusContainer .levelId').text(levelId);
        },
        loadGame: function () {
            $('body .gameStatusContainer').load('Views/Game.html', this.gameViewLoaded.bind(this));
        },
        gameViewLoaded: function () {
            InitializeView('app.ui.SwipeHandler');
            InitializeView('app.ui.ModalsHandler');
            InitializeView('app.ui.StateManager');
            InitializeView('app.ui.PathFinder');
            InitializeView('app.ui.CollisionDetector');
            InitializeView('app.ui.LevelLoader');
            InitializeView('app.ui.LevelSolver');

            $(window).trigger('setLevelIndex', this.levelIndex);
            $('.sffNavigator .back').on('touchstart mousedown', this.onBackMouseDown.bind(this));
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
            $('body .sffNavigator .timer').text(this.toHHMMSS(this.gameTime));

            this.gameTime++;
        },
        onLevelSolved: function () {
            clearInterval(this.intervalId);
            this.intervalId = null;
            $(window).trigger('showLevelSolvedDialog', { movesCount: this.movesCount, pushesCount: this.pushesCount, time: this.gameTime, levelId: this.levelId });
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
        onBackMouseDown: function (e) {
            var currentTime = (new Date()).getTime();
            if (!this.mouseDown && (currentTime - this.lastMouseDownTime) > 200) {
                this.mouseDown = true;
                this.lastMouseDownTime = currentTime;
                this.undoLastMovement();
            }
        },
        undoLastMovement: function () {
            if (!this.mouseDown) return;

            $(window).trigger('undoLastMovement');

            setTimeout(this.undoLastMovement.bind(this), 200);
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
                'width': targetBlock.domElement[0].getBoundingClientRect().width - borderWidth * 2,
                'height': targetBlock.domElement[0].getBoundingClientRect().height - borderWidth * 2,
                'display': 'block'
            });

            var me = this;
            setTimeout(function () {
                $('.gameContainer .errorBlock').remove();
            }, 500);
        },
        toHHMMSS : function (timeInt) {
            var sec_num = parseInt(timeInt, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            var time    = hours+':'+minutes+':'+seconds;
            return time;
        },
        returnToMenu: function () {
            this.unloadGame();
            InitializeView('app.ui.Menu');
        },
        unloadGame: function () {
            $(window).off();
            clearInterval(this.intervalId);
            $('body .gameContainer').html('');
            $('body .gameStatusContainer').html('');
        }
    });
})(skui.resolve('app.ui'));