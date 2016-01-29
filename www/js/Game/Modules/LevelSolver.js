(function (ns) {
    ns.LevelSolver = skui.extend(function () {
        $(window).on('solve', this.solveLevel.bind(this));
    }, {
        solveLevel: function () {
            $.blockUI({ message: '<img src="images/processing.gif" class="solverProcessing"/>' }); 
            document.title += " - Processing";

            var levelObjects = this.getLevelObjects();
            var levelObjectsJson = JSON.stringify(levelObjects);
            var me = this;
            var xhr = $.ajax({
                url:"http://localhost:54873/solve",
                //url: "http://Walidaly.net/SokobanSolver/Solve",
                data: levelObjectsJson,
                type: 'POST',
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    //Level solved
                    $.unblockUI();
                    document.title = "Sokoban";
                    if (data.valid) {
                        me.animateSolution(data.Directions);
                    } else {
                        $(window).trigger('showUnsolvableLevelDialog');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.unblockUI();
                    document.title = "Sokoban";
                }
            });

            $('.blockUI.blockOverlay').click(function () { xhr.abort(); $.unblockUI(); document.title = "Sokoban"; });
        },
        getLevelObjects: function () {
            var levelObjects = [];
            var me = this;
            $('.gameContainer .block').each(function () {
                var blockType = $(this).prop('data-type');
                var blockLeft = $(this).prop('data-left');
                var blockTop = $(this).prop('data-top');
                if (blockType == "wall" || blockType == "target" || blockType == "floor") {
                    levelObjects.push({ Type: me.getObjectType(blockType, blockLeft, blockTop), Position: { xIndex: blockLeft, yIndex: blockTop } });
                }
            });
            return levelObjects;
        },
        getObjectType: function (type, left, top) {
            //Wall,Target,Box,BoxOnTarget,Carrier,CarrierOnTarget,Floor,NotSupported
            switch (type) {
                case 'wall':
                    return 0;
                case 'floor':
                    var topObject = this.getTopObject(left, top, type);
                    if (topObject.length == 1) {
                        switch (topObject.prop('data-type')) {
                            case 'box':
                                return 2;
                            case 'player':
                                return 4;
                        }
                    }
                    return 6;
                case 'target':
                    var topObject = this.getTopObject(left, top, type);
                    if (topObject.length == 1) {
                        switch (topObject.prop('data-type')) {
                            case 'box':
                                return 3;
                            case 'player':
                                return 5;
                        }
                    }
                    return 1;
            }
        },
        getTopObject: function (left, top, excludeType) {
            return $('.gameContainer .block').filter(function () { return $(this).prop('data-left') == left && $(this).prop('data-top') == top && $(this).prop('data-type') != excludeType; });
        },
        animateSolution: function (solution) {
            for (directionIndex in solution) {
                var directionInt = solution[directionIndex];
                var directionString = this.convertIntToDirection(directionInt);
                $(window).trigger('addInputToQueue', { direction: directionString });
            }
            $(window).trigger('checkInputQueue');
        },
        convertIntToDirection: function (direction) {
            //Up, Down, Right, Left, NotMovable
            switch (direction) {
                case 0:
                    return 'top';
                case 1:
                    return 'down';
                case 2:
                    return 'right';
                case 3:
                    return 'left';
            }
        }
    });
})(skui.resolve('app.ui'));