(function (ns) {
    ns.StateManager = skui.extend(function () {
       
    }, {
        init: function () {
            this.allBlocks = [];
            this.player = null;
            $(window).on('block.created', this.addBlockToArray.bind(this));
        },
        addBlockToArray: function (e, data) {
            if (data.type == ObjectType.player) {
                this.player = data;
            } else {
                this.allBlocks[this.allBlocks.length] = data;
            }
        },
        getBlockByPosition: function (left, top) {
            var block = null;
            for (blockIndex in this.allBlocks) {
                if (this.allBlocks[blockIndex].left == left && this.allBlocks[blockIndex].top == top) {
                    if (this.allBlocks[blockIndex].type != ObjectType.floor && this.allBlocks[blockIndex].type != ObjectType.target) {
                        return this.allBlocks[blockIndex];
                    } else {
                        block = this.allBlocks[blockIndex];
                    }
                }
            }
            return block;
        },
        getOppositeBlockPosition: function (referenceBlock, targetBlock) {
            var oppositeLeft = 2 * targetBlock.left - referenceBlock.left;
            var oppositeTop = 2 * targetBlock.top - referenceBlock.top;

            return { left: oppositeLeft, top: oppositeTop };
        },
        getSelectedBox: function () {
            for (blockIndex in this.allBlocks) {
                if (this.allBlocks[blockIndex].isSelected) {
                    return this.allBlocks[blockIndex];
                }
            }
            return null;
        }
    });
})(skui.resolve('app.ui'));