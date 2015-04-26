(function (ns) {
    ns.ModalsHandler = skui.extend(function () {
        $(window).on('levelSolved', this.showLevelSolvedDialog.bind(this));
    }, {
        showLevelSolvedDialog: function (e, data) {
            $('.dialog').prop('title', 'Level Solved');
            $('.dialog').html('Congratulations! Level Solved in ' + data.movesCount + ' moves and ' + data.pushesCount + ' pushes');
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
                ]
            });
        }
    });
})(skui.resolve('app.ui'));