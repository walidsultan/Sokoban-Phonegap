(function (ns) {
    ns.Wall = skui.extend(app.ui.Block,function (obj) {
        this.setType('wall');
        this.initBlock();
    }, {
        
    });
})(skui.resolve('app.ui'));