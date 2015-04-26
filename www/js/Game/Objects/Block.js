(function (ns) {
    ns.Block = skui.extend(function () {
    }, {
        initBlock: function () {
            //todo: refactor to position object
            this.left = -1;
            this.top = -1;
            this.domElement = null;
            this.guid = guid();
        },
        setType: function (value) {
            this.type = value;
        },
        getType: function () {
            return this.type;
        }, getLeft: function () {
            return this.left;
        }, getTop: function () {
            return this.top;
        },
        draw: function (left, top) {
            this.left = left;
            this.top = top;
            this.domElement = $('<div class="block ' + this.type + '"></div>');
            this.domElement.css('left', skui.zoomFactor * left)
                                               .css('top', skui.zoomFactor * top)
                                               .css('background-size', skui.zoomFactor)
                                               .css('height', skui.zoomFactor)
                                               .css('width', skui.zoomFactor)
                                               .prop('data-left', left)
                                               .prop('data-top', top);
            $('body .gameContainer').append(this.domElement);

            switch (this.type) {
                case ObjectType.box:
                    $(window).trigger('box.' + this.guid + '.created');
                    break;
                case ObjectType.floor:
                    $(window).trigger('floor.' + this.guid + '.created');
                    break;
                case ObjectType.target:
                    $(window).trigger('target.' + this.guid + '.created');
                    break;
                case ObjectType.player:
                    $(window).trigger('player.' + this.guid + '.created');
                    break;
            }
            $(window).trigger('block.created', [this]);
        },
        setPosition: function (left, top, skipHistory) {
            if (!skipHistory) {
                $(window).trigger('addMovementIncident', { block: this, left: this.left, top: this.top, isOnTarget: this.isOnTarget });
            }
            this.left = left;
            this.top = top;
            var me = this;
            $(window).trigger('animationStarted');
            this.domElement.prop({ 'data-left': left, 'data-top': top });
            this.domElement.animate({ 'left': skui.zoomFactor * left, 'top': skui.zoomFactor * top }, 100, 'linear', function () {
                if (me.type == ObjectType.player) {
                    $(window).trigger('animationEnded');
                    $(window).trigger('checkInputQueue');
                }
            });
        }
    });
})(skui.resolve('app.ui'));