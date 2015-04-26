(function (ns) {
    ns.Player = skui.extend(app.ui.Block,function (obj) {
        this.setType('player');
        this.initBlock();
        $(window).on('player.' + this.guid + '.created', this.addPlayerEvents.bind(this));
    }, {
        addPlayerEvents: function () {
            this.domElement.click(this.handleClick.bind(this));
        },
        handleClick: function () {
            $(window).trigger('findPath', [this]);
        }
    });
})(skui.resolve('app.ui'));