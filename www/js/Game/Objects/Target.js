(function (ns) {
    ns.Target = skui.extend(app.ui.Block,function (obj) {
        this.setType('target');
        this.initBlock();
        $(window).on('target.' + this.guid + '.created', this.addTargetEvents.bind(this));
    }, {
        addTargetEvents: function () {
            this.domElement.click(this.handleClick.bind(this));
        },
        handleClick: function () {
            $(window).trigger('findPath', [this]);
        }
    });
})(skui.resolve('app.ui'));