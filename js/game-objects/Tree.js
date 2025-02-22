export class Tree {
    constructor(scene, cellX, cellY, cellSize) {
        this.scene = scene;
        this.cellX = cellX; // Координаты в массиве карты
        this.cellY = cellY;
        this.cellSize = cellSize;

        // Вычисляем координаты спрайта на экране
        this.x = cellX * cellSize + cellSize / 2;
        this.y = cellY * cellSize + cellSize / 2;

        this.sprite = scene.physics.add.sprite(this.x, this.y, 'tree').setScale(0.05);
        this.hp = 2;
        this.isDamaged = false;
    }

    takeDamage() {
        if (!this.isDamaged && this.hp > 0) {
            this.hp -= 1;
            this.isDamaged = true;
            this.applyDamageEffect();
        }
    }

    applyDamageEffect() {
        let originalX = this.sprite.x;
        let originalY = this.sprite.y;

        this.scene.tweens.add({
            targets: this.sprite,
            x: originalX + 5,
            y: originalY - 5,
            duration: 50,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.sprite,
                    x: originalX,
                    y: originalY,
                    duration: 50,
                    ease: 'Cubic.easeIn'
                });
            }
        });

        if (this.hp <= 0) {
            this.sprite.setAlpha(0);
        }
    }

    resetDamage() {
        this.isDamaged = false;
    }

    // Метод для получения координат в пикселях
    getPixelCoordinates() {
        return {
            x: this.cellX * this.cellSize + this.cellSize / 2,
            y: this.cellY * this.cellSize + this.cellSize / 2
        };
    }
}