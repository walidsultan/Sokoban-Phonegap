(function (ns) {
    ns.ModalsHandler = skui.extend(function () {
        $(window).on('showLevelSolvedDialog', this.showLevelSolvedDialog.bind(this));
    }, {
        showLevelSolvedDialog: function (e, data) {
            $('.dialog').prop('title', 'Level Solved');
            $('.dialog').html('Congratulations! You solved the level. <br/><br/>Moves: ' + data.movesCount + '<br/>Pushes: ' + data.pushesCount + '<br/>Time: ' + data.time);
            $('.dialog').dialog({
                minWidth: 420,
                modal: true,
                close: function () {
                    $(window).trigger('loadNextLevel');
                },
                buttons: [
                   {
                       text: "Continue",
                       icons: {
                           primary: "ui-icon-check"
                       },
                       click: function () {
                           $(this).dialog("close");
                       }

                   }
                ],
                create: function () {
                    //Set next button size
                    $(' .ui-dialog-buttonpane button').css('width', skui.zoomFactor)
                                                 .css('height', skui.zoomFactor)
                                                 .css('backgroundSize', skui.zoomFactor);
                }
            });
        }
    });
})(skui.resolve('app.ui'));

