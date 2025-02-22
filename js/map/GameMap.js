import {Tree} from "../game-objects/Tree.js";
import {Train} from "../game-objects/Train.js";

export const CELL_SIZE = 25;

export class GameMap {
    constructor(scene, map) {
        this.currentMap = map.map(row => [...row]);
        this.scene = scene;
        this.trees = [];
        this.rails = new Map();
        this.generateMap(true);
        this.train = new Train(scene, this.currentMap);
        this.path = this.findRailsPath();
        this.positionIndex = 0; // Текущая позиция в пути
        this.speed = 200; // Скорость поезда в пикселях в секунду
        this.moveTween = null; // Переменная для хранения текущего движения
    }

    generateMap(drawTrees = false) {

        for (let y = 0; y < this.currentMap.length; y++) {
            for (let x = 0; x < this.currentMap[y].length; x++) {
                let posX = x * CELL_SIZE + CELL_SIZE / 2;
                let posY = y * CELL_SIZE + CELL_SIZE / 2;

                if (this.currentMap[y][x] === 1 && drawTrees) {
                    this.trees.push(new Tree(this.scene, x, y, CELL_SIZE)); // Дерево
                } else if (this.currentMap[y][x] === -1 || this.currentMap[y][x] === 0) {
                    const existRails = this.rails.get(posX + '' + posY);
                    if (existRails === undefined) {
                        this.addRails(x, y, posX, posY);
                    }
                } else if (this.currentMap[y][x] === -2) {
                    const existRails = this.rails.get(posX + '' + posY);
                    if (existRails !== undefined) {
                        existRails.setAlpha(0);
                        this.rails.delete(posX + '' + posY)
                    }
                }
            }
        }
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
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(180));
        } else if (isTop && isLeft) {
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(90));
        } else if (isBottom && isRight) {
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(270));
        } else if (isBottom && isLeft) {
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(2).setScale(0.5).setAngle(0));
        } else if (isHorizontal) {
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(1).setScale(0.5)); // Горизонтальные рельсы
        } else if (isVertical) {
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(0).setScale(0.5)); // Вертикальные рельсы
        } else {
            this.rails.set(posX + '' + posY, this.scene.add.sprite(posX, posY, 'rails').setFrame(0).setScale(0.5)); // Вертикальные рельсы
        }
    }

    removeTreeAndExpandRails(tree) {
        // Убираем дерево, превращаем в пустую клетку (0)

        this.currentMap[tree.cellY][tree.cellX] = 0;
        let newPath = this.findRailsPath();
        if (newPath !== null) {
            this.path = newPath;
            this.generateMap();
            this.positionIndex = this.path.findIndex((el) => el.x === this.train.lastPosition.x
                && el.y === this.train.lastPosition.y);
        }
    }

    findRailsPath() {
        let path = [];
        let directions = [
            {dx:  0, dy: -1, direction: 'u'}, // Вверх
            {dx:  1, dy:  0, direction: 'r'},  // Вправо
            {dx:  0, dy:  1, direction: 'd'},  // Вниз
            {dx: -1, dy:  0, direction: 'l'}  // Влево
        ];

        // Найти начальную точку (верхний левый угол рельсов)
        let start = null;
        let firstFound = false;
        for (let row = 0; row < this.currentMap.length; row++) {
            for (let col = 0; col < this.currentMap[row].length; col++) {
                if (this.currentMap[row][col] === -1 || this.currentMap[row][col] === 0) {
                    if (!firstFound) {
                        firstFound = true;
                    } else {
                        start = {row, col};
                        break;
                    }

                }
            }
            if (start) break;
        }

        let current = start;
        let visited = new Set();

        let priorityDirection = [...directions];

        while (current) {
            let {row, col} = current;
            let key = `${row},${col}`;

            if (visited.has(key)) break; // Если вернулись в начало — выход
            visited.add(key);

            // Добавляем в путь
            path.push({col, row, x: col * 25 + 12.5, y: row * 25 + 12.5, });

            // Ищем следующую клетку
            let next = null;
            for (let {dx, dy, direction} of priorityDirection) {
                let newRow = row + dy;
                let newCol = col + dx;
                let newKey = `${newRow},${newCol}`;

                if (
                    newRow >= 0 && newRow < this.currentMap.length &&
                    newCol >= 0 && newCol < this.currentMap[0].length &&
                    !visited.has(newKey) &&
                    (this.currentMap[newRow][newCol] === -1 || this.currentMap[newRow][newCol] === 0 )
                ) {
                    next = {row: newRow, col: newCol};
                    if (direction === 'r') {
                        priorityDirection = [...directions];
                    } else if (direction === 'd') {
                        priorityDirection = [directions[1], directions[2], directions[3], directions[0]]
                    } else if (direction === 'l') {
                        priorityDirection = [directions[2], directions[3], directions[0], directions[1]]
                    } else {
                        priorityDirection = [directions[3], directions[0], directions[1], directions[2]]
                    }
                    break;
                }
            }

            current = next;
        }

        //проверка на то, что путь замыкается
        if (path[0].x === path[path.length-1].x ||
            path[0].y === path[path.length-1].y) {
            this.checkRailsForDelete(path);
            return path;
        }

        return null;
    }

    checkRailsForDelete(path) {
        let pathKeys = new Set(path.map(el => el.x + '' + el.y));
        this.rails.forEach((el, key) => {
            if (!pathKeys.has(key)) {
                el.setAlpha(0);
                this.rails.delete(key);
                let x = Math.floor(el.x / CELL_SIZE);
                let y = Math.floor(el.y / CELL_SIZE);
                this.currentMap[y][x] = -2;
            }
        })
    }

    moveTrain(isMoving) {
        if (!isMoving || this.moveTween) return; // Если уже есть анимация — не создаём новую

        if (this.positionIndex >= this.path.length) {
            this.positionIndex = 0; // Циклическое движение
            this.trees.forEach(tree => tree.resetDamage());
        }

        let currentPos = this.path[this.positionIndex];

        // Вычисляем расстояние до следующей точки
        let distance = Phaser.Math.Distance.Between(this.train.trainImage.x, this.train.trainImage.y, currentPos.x, currentPos.y);
        let duration = (distance / this.speed) * 1000; // Время в миллисекундах

        // Поворачиваем поезд в нужную сторону
        if (currentPos.x !== this.train.lastPosition.x) {
            if (currentPos.x > this.train.lastPosition.x) {
                this.train.trainImage.angle = 180;
                this.train.direction = 'r';
            } else {
                this.train.trainImage.angle = 0;
                this.train.direction = 'l';
            }
        } else if (currentPos.y !== this.train.lastPosition.y) {
            if (currentPos.y > this.train.lastPosition.y) {
                this.train.trainImage.angle = -90;
                this.train.direction = 'd';
            } else {
                this.train.trainImage.angle = 90;
                this.train.direction = 'u';
            }
        }

        // Создаём плавное движение с анимацией
        this.moveTween = this.train.scene.tweens.add({
            targets: this.train.trainImage,
            x: currentPos.x,
            y: currentPos.y,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.moveTween = null; // Очищаем переменную после завершения анимации
                this.train.lastPosition = currentPos;
                this.positionIndex++; // Переход к следующей позиции
                this.checkTreeCollision(); // Проверяем столкновение с деревьями
            }
        });
    }

    checkTreeCollision() {
        let trainCellX = Math.floor(this.train.trainImage.x / CELL_SIZE);
        let trainCellY = Math.floor(this.train.trainImage.y / CELL_SIZE);

        this.trees.forEach((tree, index) => {
            // Проверяем, является ли дерево соседним (по горизонтали или вертикали)
            let isAdjacent =
                (tree.cellX === trainCellX && Math.abs(tree.cellY - trainCellY) === 1) || // Вверх/вниз
                (tree.cellY === trainCellY && Math.abs(tree.cellX - trainCellX) === 1);   // Влево/вправо

            if (isAdjacent) {
                tree.takeDamage(); // Дерево рядом — наносим урон
                if (tree.hp <= 0) {
                    this.removeTreeAndExpandRails(tree);
                    this.trees.splice(index, 1);
                }
            }
        });
    }

}