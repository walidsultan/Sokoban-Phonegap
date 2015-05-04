(function (ns) {
    ns.SwipeHandler = skui.extend(function () {
        $(window).on('touchstart', this.setTouchStartVariables.bind(this));
        $(window).on('touchmove', this.handleTouchGestures.bind(this));
        $(window).on('animationStarted', this.setAnimationStatus.bind(this));
        $(window).on('animationEnded', this.setAnimationStatus.bind(this));
        this.isAnimating = false;
    }, {
        setTouchStartVariables: function (e) {
            this.startTouchX = e.originalEvent.touches[0].clientX;
            this.startTouchY = e.originalEvent.touches[0].clientY;
        },
        handleTouchGestures: function (e) {
            e.preventDefault();
            var direction = null;
            var deltaX = e.originalEvent.touches[0].clientX - this.startTouchX;
            var deltaY = e.originalEvent.touches[0].clientY - this.startTouchY;
            var minSwipeDistance = 30;
            if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    direction = deltaX > 0 ? Direction.right : Direction.left;
                } else {
                    direction = deltaY > 0 ? Direction.down : Direction.top;
                }
            }
            switch (e.keyCode) {
                case 37: //left
                    direction = Direction.left;
                    break;
                case 38: //top
                    direction = Direction.top;
                    break;
                case 39: //right
                    direction = Direction.right;
                    break;
                case 40: //down
                    direction = Direction.down;
                    break;
            }
            if (direction != null && !this.isAnimating) {
                $(window).trigger('handleInput', { direction: direction });
            }
        },
        setAnimationStatus: function (e) {
            if (e.type == 'animationStarted') {
                this.isAnimating = true;
            } else {
                this.isAnimating = false;
            }
        }
    });
})(skui.resolve('app.ui'));