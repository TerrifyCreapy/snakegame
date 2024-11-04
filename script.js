const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

class Apple {
    constructor(x, y, ctx, size = 10, color = "red") {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.size = size;
        this.color = color;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
        this.ctx.fillStyle = "black";
    }
}



class Node {
    constructor(x, y, ctx, size = 10, speed = 20, color = "green") {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.ctx = ctx;
        this.size = size;
        this.speed = speed;
        this.direction = "x";

        this.color = color;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
        this.ctx.fillStyle = "black";
    }

    changeCoords() {
        console.log(this.direction);
        switch (this.direction) {
            case "x": {
                this.x += this.speed;
                if (this.x + this.size > canvas.width) {
                    this.x = this.size;
                }
                break;
            }
            case "-x": {
                this.x -= this.speed;
                if (this.x + this.size < 0) {
                    this.x = canvas.width - this.size;
                }
                break;
            }
            case "y": {
                this.y -= this.speed;
                if (this.y - this.size < 0) {
                    this.y = canvas.height - this.size;
                }
                break;
            }
            case "-y": {
                this.y += this.speed;
                if (this.y + this.size > canvas.height) {
                    this.y = this.size;
                }
                break;
            }

        }
    }

    changeDir(dir) {
        if (dir.replace(/[^a-zA-Z]/gi, "") === this.direction.replace(/[^a-zA-Z]/gi, "")) return;
        this.direction = dir;
    }

}


class Snake {
    constructor(ctx) {
        this.body = [
            new Node(30, 10, ctx, 10, 20, "orange"),
            new Node(10, 10, ctx),
        ];
        this.ctx = ctx;
    };

    draw() {
        this.body.forEach((el) => el.draw());

        let lastIndex = this.body.length - 1;

        this.body[lastIndex].prevX = this.body[lastIndex].x;
        this.body[lastIndex].prevY = this.body[lastIndex].y;
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }



        this.body[0].changeCoords();


    }

    isLose() {
        let head = this.getHead();
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    changeDirection(dir) {
        this.body[0].changeDir(dir);
    }

    increaseSize() {
        this.body.push(new Node(this.getTail().x, this.getTail.y, this.ctx));
    }

    getHead() {
        return this.body[0];
    }

    getTail() {
        return this.body[this.body.length - 1];
    }
}

class Game {
    timer = null;
    score = 0;
    constructor(ctx) {
        this.snake = new Snake(ctx);
        const row = Math.trunc(Math.random() * 40);
        const col = Math.trunc(Math.random() * 40);
        this.apple = new Apple(row * 20 + 10, col * 20 + 10, ctx, 10);
        this.ctx = ctx;

    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.apple.draw();
        this.snake.draw();
        if (this.snake.isLose()) {
            this.resetGame();
        }

        if (this.apple.x === this.snake.getHead().x && this.apple.y === this.snake.getHead().y) {
            const row = Math.trunc(Math.random() * 40);
            const col = Math.trunc(Math.random() * 40);
            console.log(row, col);
            this.snake.increaseSize();
            this.apple = new Apple(row * 20 + 10, col * 20 + 10, this.ctx, 10);
            this.score++;
        }
        ctx.font = "bold 30px serif";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${this.score}`, 30, canvas.height - 30);
        ctx.fillStyle = "black";
    }

    changeDirection(dir) {
        this.snake.changeDirection(dir);
    }

    startGame() {

        this.timer = setInterval(this.draw, 100);
    }

    resetGame() {
        this.snake = new Snake(this.ctx);
        this.score = 0;
    }
}


const gameInstance = new Game(ctx);

document.addEventListener("keyup", function (event) {
    console.log(event.key);
    if (event.key === "ArrowRight") {
        gameInstance.changeDirection("x");
    }
    else if (event.key === "ArrowLeft") {
        gameInstance.changeDirection("-x");
    }
    else if (event.key === "ArrowDown") {
        gameInstance.changeDirection("-y");
    }
    else if (event.key === "ArrowUp") {
        gameInstance.changeDirection("y");
    }
});

setInterval(() => {
    gameInstance.draw();
}, 100)
