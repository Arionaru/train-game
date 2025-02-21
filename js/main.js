import {GameMap} from "./map/GameMap.js";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const startMap = [
    // Верхние ряды деревьев
    ...Array(8).fill(Array(32).fill(1)),

    // Ряды с рельсами
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    // Нижние ряды деревьев
    ...Array(8).fill(Array(32).fill(1))
];

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};


let gameMap;
let isMoving = false;

function preload() {
    this.load.spritesheet('rails', 'assets/rails.png', { frameWidth: 54, frameHeight: 54 });
    this.load.image('train', 'assets/train.png');
    this.load.image('tree', 'assets/tree.png');
}

function create() {

    gameMap = new GameMap(this, startMap);

    // Запускаем поезд
    this.time.addEvent({
        delay: 20, // Обновление позиции каждые 50 мс
        loop: true,
        callback: () => gameMap.moveTrain(isMoving),
        callbackScope: this
    });

    // Обработчик нажатия пробела (начало движения)
    this.input.keyboard.on('keydown-SPACE', function () {
        isMoving = true; // Поезд начинает двигаться
    });

    // Обработчик отпускания пробела (остановка)
    this.input.keyboard.on('keyup-SPACE', function () {
        isMoving = false; // Поезд останавливается
    });
}

function update() {
}

new Phaser.Game(config);