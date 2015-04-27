(function (ns) {
    ns.LevelLoader = skui.extend(function () {
        $(window).on('drawLevel', this.drawLevel.bind(this));
        $(window).on('initLevel', this.loadLevel.bind(this));
        $(window).on('loadNextLevel', this.loadNextLevel.bind(this))
        $(window).on('setLevelIndex', this.setLevelIndex.bind(this))
        $(window).on('loadPreviousLevel', this.loadPreviousLevel.bind(this));
    }, {
        init: function () {
            $('body').prop('class', 'sokoban');
            var levelPath = this.getLevelPath();
            var levelDoc = loadXMLDoc(levelPath);
            this.levelRows = levelDoc.getElementsByTagName("L");
            this.levelRendered = false;

            var levelIdentifier = levelDoc.getElementsByTagName("Level");
            var levelWidth = levelIdentifier[0].getAttribute('Width');
            var levelHeight = levelIdentifier[0].getAttribute('Height');
            var levelId = levelIdentifier[0].getAttribute('Id');
            $(window).trigger('updateLevelName', levelId);
            $(window).trigger('setLevelDimensions', { width: levelWidth, height: levelHeight });
           
        },
        loadXMLDoc: function (levelPath) {
            var me = this;
			$.get(levelPath, function (data) {
				alert(data);
			    var xmlDoc = $(data);
                                alert(xmlDoc);
				me.levelRows = xmlDoc.find("L");
                me.levelRendered = false;
                var levelIdentifier = xmlDoc.find("Level");
                var levelWidth = levelIdentifier[0].getAttribute('Width');
				                alert(levelWidth);
                var levelHeight = levelIdentifier[0].getAttribute('Height');
                var levelId = levelIdentifier[0].getAttribute('Id');
                $(window).trigger('updateLevelName', levelId);
                $(window).trigger('setLevelDimensions', { width: levelWidth, height: levelHeight });
            });
        },
        getLevelPath: function () {
            if (this.levelIndex <= 3) {
                return 'Levels/Easy/Level' + this.levelIndex + '.xml';
            }
            else if (this.levelIndex <= 11) {
                return 'Levels/SokobanJunior/Level' + (this.levelIndex - 3) + '.xml';
            } else {
                return 'Levels/MicroCosmos/level' + (this.levelIndex - 11) + '.xml';
            }
        },
        drawLevel: function (e) {
            if (!this.levelRendered && this.levelRows != null) {
                this.levelRendered = true;
                for (i = 0; i < this.levelRows.length; i++) {
                    var row = this.levelRows[i].childNodes[0].nodeValue;
                    var isWallDrawn = false;
                    for (var j = 0; j < row.length; j++) {
                        var block = null;
                        switch (row[j]) {
                            case '#':
                                block = InitializeView('app.ui.Wall');
                                isWallDrawn = true;
                                break;
                            case ' ':
                                if (isWallDrawn) {
                                    block = InitializeView('app.ui.Floor');
                                }
                                break;
                            case '$':
                                block = InitializeView('app.ui.Floor');
                                var box = InitializeView('app.ui.Box');
                                box.draw(j, i);
                                break;
                            case '.':
                                block = InitializeView('app.ui.Target');
                                break;
                            case '+':
                                block = InitializeView('app.ui.Target');
                                var player = InitializeView('app.ui.Player');
                                player.draw(j, i);
                                break;
                            case '@':
                                block = InitializeView('app.ui.Floor');
                                var player = InitializeView('app.ui.Player');
                                player.draw(j, i);
                                break;
                            case '*':
                                block = InitializeView('app.ui.Target');
                                var box = InitializeView('app.ui.Box');
                                box.draw(j, i);
                                box.setTarget(true);
                                break;
                        }
                        if (block) {
                            block.draw(j, i);
                        }
                    }
                }
            }
        },
        loadLevel: function () {
            $('body .gameContainer').html('');
            this.init();
        },
        loadNextLevel: function () {
            this.levelIndex++;
            $(window).trigger('reloadLevel');
        },
        setLevelIndex: function (e, data) {
            this.levelIndex = data;
            this.init();
        },
        loadPreviousLevel: function () {
            this.levelIndex--;
            $(window).trigger('reloadLevel');
        }
    });
})(skui.resolve('app.ui'));