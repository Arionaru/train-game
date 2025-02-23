export class Rails {

    constructor(scene, currentMap) {
        this.currentMap = currentMap;
        this.railsMap = new Map();
        this.scene = scene;
    }

    addRails(x, y, posX, posY) {
        // Проверка соседей для рельс
        let isHorizontal = false;
        let isVertical = false;
        let isTop = false;
        let isBottom = false;
        let isLeft = false;
        let isRight = false;

        // Проверяем соседей
        if (x + 1 < this.currentMap[y].length && this.currentMap[y][x + 1] === -1) isRight = true;
        if (x - 1 >= 0 && this.currentMap[y][x - 1] === -1) isLeft = true;
        if (y + 1 < this.currentMap.length && this.currentMap[y + 1][x] === -1) isBottom = true;
        if (y - 1 >= 0 && this.currentMap[y - 1][x] === -1) isTop = true;

        // Определяем тип рельс: горизонтальные, вертикальные, угловые
        if (isRight || isLeft) {
            isHorizontal = true;
        }

        if (isBottom || isTop) {
            isVertical = true;
        }

        if (isTop && isRight) {
            this.railsMap.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(180));
        } else if (isTop && isLeft) {
            this.railsMap.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(90));
        } else if (isBottom && isRight) {
            this.railsMap.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(270));
        } else if (isBottom && isLeft) {
            this.railsMap.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(0));
        } else if (isHorizontal) {
            this.railsMap.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(1).setScale(0.5)); // Горизонтальные рельсы
        } else if (isVertical) {
            this.railsMap.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(0).setScale(0.5)); // Вертикальные рельсы
        }
        this.checkNeighbours();
    }

    checkNeighbours(x, y, posX, posY) {

    }

}