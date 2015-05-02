(function (ns) {
    ns.ModalsHandler = skui.extend(function () {
        $(window).on('showLevelSolvedDialog', this.showLevelSolvedDialog.bind(this));
    }, {
        showLevelSolvedDialog: function (e, data) {
            $('.dialog').prop('title', 'Level Solved');
            $('.dialog').html('Congratulations! You have solved ' + data.levelId + '. <br/><br/>Moves: ' + data.movesCount + '<br/>Pushes: ' + data.pushesCount + '<br/>Time: ' + data.time);
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
                open: function () {
                    $('.ui-dialog :button').blur();
                }
            });
        }
    });
})(skui.resolve('app.ui'));

