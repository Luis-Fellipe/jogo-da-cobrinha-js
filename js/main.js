const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector('.score-value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu');
const buttonPlay = document.querySelector('.btn-play');

const audio = new Audio('./assets/assets_audio.mp3')

const size = 25;

const initialPosition = { x: 200, y: 200 };

let isGameOver = false;

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = + score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 25) * 25
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction = null; // DIREÇÃO INICIALMENTE NULA
let nextDirection = null; // NEXTDIRECTION INICIALMENTE NULA
let loopId;

const drawFood = () => {
    ctx.shadowColor = food.color
    ctx.shadowBlur = 10
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0

}

const drawSnake = () => {
    ctx.fillStyle = "darkgreen";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "green";
        }

        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction || isGameOver) return; // SE DIREÇÃO FOR NULA, NÃO MOVE

    const head = snake[snake.length - 1];

    if (nextDirection) {
        direction = nextDirection;
        nextDirection = null;
    }

    let newHead;
    if (direction == "right") {
        newHead = { x: head.x + size, y: head.y };
    }

    if (direction == "left") {
        newHead = { x: head.x - size, y: head.y };
    }

    if (direction == "down") {
        newHead = { x: head.x, y: head.y + size };
    }

    if (direction == "up") {
        newHead = { x: head.x, y: head.y - size };
    }

    snake.push(newHead);
    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 25; i < canvas.width; i += 25) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()


        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex =  snake.length - 2

    const wallCollision = 
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    isGameOver = true;

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px"
}

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 180);
};

gameLoop();

document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowRight" && direction != "left") {
        nextDirection = "right";
    }
    if (event.key == "ArrowLeft" && direction != "right") {
        nextDirection = "left";
    }
    if (event.key == "ArrowDown" && direction != "up") {
        nextDirection = "down";
    }
    if (event.key == "ArrowUp" && direction != "down") {
        nextDirection = "up";
    }

    if (!direction && nextDirection) {
        direction = nextDirection; // INICIAR O MOVIMENTO
        nextDirection = null;
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    
    snake = [initialPosition]
    isGameOver = false;
})
