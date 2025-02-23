export class Train {
    constructor(scene, currentMap) {
        this.scene = scene;
        this.currentMap = currentMap;
        this.lastPosition = this.findTrainStartPosition();
        this.trainImage = this.scene.physics.add.sprite(this.lastPosition.x, this.lastPosition.y, 'train').setScale(0.05).setDepth(10);
        this.trainImage.angle = 180;
        this.direction = 'r';
    }

    findTrainStartPosition() {
        for (let row = 0; row < this.currentMap.length; row++) {
            for (let col = 0; col < this.currentMap[row].length; col++) {
                if (this.currentMap[row][col] === -1) {
                    return { x: col * 25 + 12.5 + 25, y: row * 25 + 12.5 };
                }
            }
        }
    }
}