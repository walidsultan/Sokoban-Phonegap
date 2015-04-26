(function (ns) {
    ns.Floor = skui.extend(app.ui.Block,function (obj) {
        this.setType('floor');
        this.initBlock();
        $(window).on('floor.' + this.guid + '.created', this.addFloorEvents.bind(this));
    }, {
        addFloorEvents: function () {
            this.domElement.click(this.handleClick.bind(this));
        },
        handleClick: function () {
            $(window).trigger('findPath', [this]);
        }
    });
})(skui.resolve('app.ui'));