(function (ns) {
    ns.DatabaseHandler = skui.extend(function () {
        $(window).on('addUserToDB', this.addUser.bind(this));
        $(window).on('showLevelSolvedDialog', this.addSolution.bind(this));
    }, {
        addUser: function (e, user) {
            try {
                $.ajax({
                    type: "POST",
                    url: 'http://walidaly.net/SokobanJSWebAPI/api/Users',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: user.userId }),
                    success: function () {
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    },
                    dataType: "json"
                });
            }
            catch (ex) {
                debugger;
                //ignore exception
            }
        },
        addSolution: function (e, solution) {
            var sokobanUser = JSON.parse(localStorage.getItem('sokobanUser'));
            try {
                $.ajax({
                    type: "POST",
                    url: 'http://walidaly.net/SokobanJSWebAPI/api/Solutions',
                    contentType: 'application/json',
                    data: JSON.stringify({ userId: sokobanUser.userId, levelIndex: sokobanUser.levelIndex, moves: solution.movesCount, pushes: solution.pushesCount, time: solution.time }),
                    success: function () {
                    },
                    dataType: "json"
                });
            }
            catch (ex) {
                //ignore exception
                debugger;
            }
        }
    });
})(skui.resolve('app.ui'));