function preload() {
    var images = new Array()
    for (i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image()
        images[i].src = preload.arguments[i]
    }
}
preload(
    "Images/Wall.png",
    "Images/Box.png",
    "Images/BoxOnTarget.png",
    "Images/greenBox.png",
    "Images/Floor.png",
    "Images/Target.png",
    "Images/Ghost.png",
    "Images/backArrow.png",
    "Images/reload.png"
)