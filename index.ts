import chalk from "chalk";
import readline from "readline";
import { stdout } from "process";


let width = Math.floor(stdout.columns / 2) - 6,
	height = stdout.rows - 8;
const snake = [{ x: Math.floor(width / 2), y: Math.floor(height / 2) }];
let direction = { x: 1, y: 0 };
let running = true;
let paused = false;
let score = 0;
let blinkState = true;

function getRandomFoodPosition() {
	return {
		x: Math.floor(Math.random() * (width - 4)) + 2,
		y: Math.floor(Math.random() * (height - 4)) + 2,
	};
}

let food = getRandomFoodPosition();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (_, key) => {
	if ((key.name === "left" || key.name === "a") && direction.x === 0)
		direction = { x: -1, y: 0 };
	if ((key.name === "right" || key.name === "d") && direction.x === 0)
		direction = { x: 1, y: 0 };
	if ((key.name === "up" || key.name === "w") && direction.y === 0)
		direction = { x: 0, y: -1 };
	if ((key.name === "down" || key.name === "s") && direction.y === 0)
		direction = { x: 0, y: 1 };
	if (key.name === "p" || key.name === "space") paused = !paused;
	if (key.name === "q") process.exit();
});

function draw() {
	let output = "\n";
	output += "  ┌" + "─".repeat(width * 2 + 2) + "┐\n";
	output += "  │" + " ".repeat(width * 2 + 2) + "│\n";

	for (let y = 0; y < height; y++) {
		output += "  │ ";
		for (let x = 0; x < width; x++) {
			if (x === food.x && y === food.y) output += chalk.red("■ ");
			else if (snake[0].x === x && snake[0].y === y)
				output += blinkState ? chalk.green("■ ") : "  ";
			else if (snake.some((segment) => segment.x === x && segment.y === y))
				output += chalk.green("■ ");
			else output += "  ";
		}
		output += " │\n";
	}

	output += "  │" + " ".repeat(width *2 + 2) + "│\n";
	output += "  └" + "─".repeat(width * 2 + 2) + "┘\n";
	output += `  Score: ${score}  [WASD / Arrows: Move] [Space/P: Pause] [Q: Quit]\n`;

	console.clear();
	console.log(output);
}

function update() {
	if (paused) return;
	const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
	if (
		head.x < 0 ||
		head.x >= width ||
		head.y < 0 ||
		head.y >= height ||
		snake.some((seg) => seg.x === head.x && seg.y === head.y)
	) {
        console.clear()
		console.log(chalk.red("Game Over! Final Score: " + score));
		process.exit();
	}
	snake.unshift(head);
	if (head.x === food.x && head.y === food.y) {
		food = getRandomFoodPosition();
		score++;
	} else {
		snake.pop();
	}
}

function gameLoop() {
	if (!running) return;
	width = Math.floor(stdout.columns / 2) - 6;
	height = stdout.rows - 8;
	if (paused) blinkState = !blinkState;
	else blinkState = true;
	update();
	draw();
	setTimeout(gameLoop, 300);
}

gameLoop();
