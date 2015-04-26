(function (ns) {
    ns.PathFinder = skui.extend(app.ui.StateManager, function () {
        $(window).on('findPath', this.findPath.bind(this));
        $(window).on('reloadLevel', this.clearBlocks.bind(this));
        this.init();
    }, {
        findPath: function (e, targetBlock) {
            var selectedBox = this.getSelectedBox();
            if (selectedBox != null) {
                if (targetBlock.type == ObjectType.player) {
                    targetBlock = this.getBlockByPosition(targetBlock.left, targetBlock.top);
                }
                var solution = null;
                var lstRecursiveSolutions = this.getRecursiveSolutions(selectedBox);
                var lstRepeatedSolutions = [];
                var originalBoxPoistion = { left: selectedBox.left, top: selectedBox.top };
                var originalPlayerPoistion = { left: this.player.left, top: this.player.top };
                while (lstRecursiveSolutions.length > 0) {
                    var targetSolution = lstRecursiveSolutions.filter(function (solution) { return solution.boxPosition.left == targetBlock.left && solution.boxPosition.top == targetBlock.top });
                    if (targetSolution.length > 0) {
                        break;
                    }

                    lstRepeatedSolutions = lstRepeatedSolutions.concat(lstRecursiveSolutions);

                    var lstNewSolutions = [];
                    for (solutionIndex in lstRecursiveSolutions) {
                        var possibleSolution = lstRecursiveSolutions[solutionIndex];
                        selectedBox.left = possibleSolution.boxPosition.left;
                        selectedBox.top = possibleSolution.boxPosition.top;
                        this.player.left = possibleSolution.playerPosition.left;
                        this.player.top = possibleSolution.playerPosition.top;

                        var lstAddedSolutions = this.getRecursiveSolutions(selectedBox);
                        lstNewSolutions = lstNewSolutions.concat(lstAddedSolutions);

                        //Add the possible solution player path as the root path for the recursive solution
                        for (newSolutionIndex in lstAddedSolutions) {
                            lstAddedSolutions[newSolutionIndex].playerPath =possibleSolution.playerPath.concat(lstAddedSolutions[newSolutionIndex].playerPath);
                        }
                    }

                    //remove repeated solutions
                    var lstNewSolutions = lstNewSolutions.filter(function (solution) {
                        return lstRepeatedSolutions.filter(function (repeatedSolution) {
                            return (
                                solution.boxPosition.left == repeatedSolution.boxPosition.left &&
                                solution.boxPosition.top == repeatedSolution.boxPosition.top &&
                                solution.playerPath[solution.playerPath.length - 1] == repeatedSolution.playerPath[repeatedSolution.playerPath.length - 1]);
                        }).length == 0;
                    });

                    lstRecursiveSolutions.length = 0;
                    lstRecursiveSolutions = lstRecursiveSolutions.concat(lstNewSolutions);
                }

                selectedBox.left = originalBoxPoistion.left;
                selectedBox.top = originalBoxPoistion.top;
                this.player.left = originalPlayerPoistion.left;
                this.player.top = originalPlayerPoistion.top;
                selectedBox.setSelection(false);

                if (targetSolution!=null && targetSolution.length > 0) {
                    //Solution Found
                    $(window).trigger('boxToTargetPathFound', [targetSolution[0].playerPath]);
                } else {
                    //Wrong Path
                    $(window).trigger('highlightError', [targetBlock]);
                }
            }
        },
        getRecursiveSolutions: function (selectedBox) {
            var lstRecursiveSolutions = [];
            var lstAdjacentBlocks = this.getAdjacentBlocksWithRelativeDirections(selectedBox);
            for (blockIndex in lstAdjacentBlocks) {
                var blockPath = lstAdjacentBlocks[blockIndex];
                if (blockPath.block.type == ObjectType.floor || blockPath.block.type == ObjectType.target) {
                    var path = this.getDirectPath(this.player, blockPath.block);
                    if (path != null) {
                        var oppositePosition = this.getOppositeBlockPosition(blockPath.block, selectedBox);

                        var block = this.getBlockByPosition(oppositePosition.left, oppositePosition.top);
                        if (block.type == ObjectType.floor || block.type == ObjectType.target) {
                            var solution = {
                                boxPosition: oppositePosition,
                                playerPath: path,
                                playerPosition: { left: selectedBox.left, top: selectedBox.top },
                            };
                            var moveDirection = this.getMoveDirection({ left: selectedBox.left, top: selectedBox.top }, oppositePosition);
                            solution.playerPath[solution.playerPath.length] = moveDirection;

                            lstRecursiveSolutions[lstRecursiveSolutions.length] = solution;
                        }
                    }
                }
            }
            return lstRecursiveSolutions;
        },
        getAdjacentBlocksWithRelativeDirections: function (selectedBox) {
            var lstBlockPaths = [];
            var adjacentBlock = null;
            //Left Block
            adjacentBlock = this.getBlockByPosition(selectedBox.left - 1, selectedBox.top);
            lstBlockPaths[0] = { block: adjacentBlock, directions: [Direction.left] };
            //Right Block
            adjacentBlock = this.getBlockByPosition(selectedBox.left + 1, selectedBox.top);
            lstBlockPaths[1] = { block: adjacentBlock, directions: [Direction.right] };
            //Up Block
            adjacentBlock = this.getBlockByPosition(selectedBox.left, selectedBox.top - 1);
            lstBlockPaths[2] = { block: adjacentBlock, directions: [Direction.top] };
            //Down Block
            adjacentBlock = this.getBlockByPosition(selectedBox.left, selectedBox.top + 1);
            lstBlockPaths[3] = { block: adjacentBlock, directions: [Direction.down] };

            return lstBlockPaths;
        },
        getDirectPath: function (startBlock, targetBlock) {
            var lstRecursiveBlocks = this.getAdjacentBlocksWithRelativeDirections(startBlock);
            var lstRepeatedBlocks = [];
            var directPath = null;

            //check if the startblock is the same as the target block
            if (startBlock.left == targetBlock.left && startBlock.top == targetBlock.top) {
                return [];
            }

            while (lstRecursiveBlocks.length > 0) {
                //Remove walls and boxes
                lstRecursiveBlocks = lstRecursiveBlocks.filter(function (blockPath) {
                    return blockPath.block.type != ObjectType.wall && blockPath.block.type != ObjectType.box;
                });

                //Remove any blocks that have been checked already
                var lstRecursiveBlocks = lstRecursiveBlocks.filter(function (blockPath) {
                    return lstRepeatedBlocks.filter(function (repeatedBlock) { return repeatedBlock.block === blockPath.block }).length == 0;
                });
                lstRepeatedBlocks = lstRepeatedBlocks.concat(lstRecursiveBlocks);

                //if there are no more blocks to search then break
                if (lstRecursiveBlocks.length == 0) break;

                //check if any of the recursive blocks is the target
                var lstNewBlocks = [];
                for (blockIndex in lstRecursiveBlocks) {
                    var blockPath = lstRecursiveBlocks[blockIndex];
                    if (blockPath.block == targetBlock) {
                        //Target found
                        directPath = blockPath.directions;
                        break;
                    }

                    var lstAdjacentBlocks = this.getAdjacentBlocksWithRelativeDirections(blockPath.block);
                    //Add current path to the adjacent block as their root path 
                    for (adjacentBlockIndex in lstAdjacentBlocks) {
                        var adjacentBlock = lstAdjacentBlocks[adjacentBlockIndex];
                        var existingBlocks = lstNewBlocks.filter(function (blockPath) { return blockPath.block.left == adjacentBlock.block.left && blockPath.block.top == adjacentBlock.block.top; });
                        if (existingBlocks.length == 0) {
                            adjacentBlock.directions = blockPath.directions.concat(adjacentBlock.directions);
                            lstNewBlocks[lstNewBlocks.length] = adjacentBlock;
                        }
                    }
                }

                if (directPath != null) {
                    break;
                }
                lstRecursiveBlocks.length = 0;
                lstRecursiveBlocks = lstRecursiveBlocks.concat(lstNewBlocks);
            }

            return directPath;
        },
        getMoveDirection: function (referencePosition, targetPosition) {
            var pathDirection = null;
            if (targetPosition.left != referencePosition.left) {
                if (targetPosition.left < referencePosition.left) {
                    pathDirection = Direction.left;
                }
                else if (targetPosition.left > referencePosition.left) {
                    pathDirection = Direction.right;
                }
            }
            else if (targetPosition.top != referencePosition.top) {
                if (targetPosition.top < referencePosition.top) {
                    pathDirection = Direction.top;
                }
                else if (targetPosition.top > referencePosition.top) {
                    pathDirection = Direction.down;
                }
            }
            return pathDirection;
        },
        clearBlocks: function () {
            this.allBlocks.length = 0;
            this.player = null;
        }
    });
})(skui.resolve('app.ui'));