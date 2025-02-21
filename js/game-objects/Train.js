export class Train {
    constructor(scene, currentMap) {
        this.scene = scene;
        this.currentMap = currentMap;
        this.trainPosition = this.findTrainStartPosition();
        this.trainImage = this.scene.physics.add.sprite(this.trainPosition.x, this.trainPosition.y, 'train').setScale(0.05);
        this.trainImage.angle = 180;
        this.lastPosition =  { x: this.trainImage.x, y: this.trainImage.y };
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