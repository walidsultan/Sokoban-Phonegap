(function (ns) {
    ns.Box = skui.extend(app.ui.Block,function (obj) {
        this.setType('box');
        this.initBlock();
        this.isSelected = false;
        this.isOnTarget = false;
        $(window).on('box.' + this.guid + '.created', this.addBoxEvents.bind(this));
        $(window).on('box.unSelectAll', this.unSelectAll.bind(this));
    }, {
        addBoxEvents: function () {
            this.domElement.click(this.handleClick.bind(this));
        },
        handleClick: function () {
            $(window).trigger('box.unSelectAll', [{selectedBoxId:this.guid}]);
            this.setSelection(!this.isSelected);
        },
        setTarget: function (isOnTarget) {
            this.isOnTarget = isOnTarget;
            if (isOnTarget) {
                this.domElement.addClass('onTarget');
            } else {
                this.domElement.removeClass('onTarget');
            }
        },
        setSelection: function (isSelected) {
            this.isSelected = isSelected;
            if (isSelected) {
                this.domElement.addClass('selected');
            } else {
                this.domElement.removeClass('selected');
            }
        },
        unSelectAll: function (e, data) {
            if (this.guid != data.selectedBoxId) {
                this.domElement.removeClass('selected');
                this.isSelected = false;
            }
        }
    });
})(skui.resolve('app.ui'));