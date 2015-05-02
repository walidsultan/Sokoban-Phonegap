(function (ns) {
    ns.UsersHandler = skui.extend(function () {
        this.levelIndex = 1;
        var sokobanUser = localStorage.getItem('sokobanUser');
        if (sokobanUser != null) {
            sokobanUser = JSON.parse(sokobanUser);
            this.levelIndex = sokobanUser.levelIndex;
        } else {
            var sokobanUser = {
                userId: guid(),
                levelIndex: 1
            };
            localStorage.setItem('sokobanUser', JSON.stringify(sokobanUser));
			 $(window).trigger('addUserToDB', sokobanUser);
        }
        $(window).on('levelSolved', this.saveUserLevelIndex.bind(this));
        $(window).on('setLevelIndex', this.setCurrentLevelIndex.bind(this));

        $(window).trigger('loadMenu', { levelIndex: this.levelIndex });
    }, {
        saveUserLevelIndex: function () {
            this.currentLevelIndex++;
            if (this.currentLevelIndex > this.levelIndex) {
                var sokobanUser = JSON.parse(localStorage.getItem('sokobanUser'));
                this.levelIndex = this.currentLevelIndex;
                if (sokobanUser != null) {
                    sokobanUser.levelIndex = this.levelIndex;
                    localStorage.setItem('sokobanUser', JSON.stringify(sokobanUser));
                }
            }
        },
        setCurrentLevelIndex: function (e,data) {
            this.currentLevelIndex = data;
        }
    });
})(skui.resolve('app.ui'));