const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const wheelRadius = 180;
const ballRadius = 8;
const center = { x: canvas.width / 2, y: canvas.height / 2 };

// Sequência de números da roleta (roleta europeia)
const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Cores: 0 rosa, alternando vermelho/preto
const colors = numbers.map((n, i) => {
    if (n === 0) return 'pink'; // Rosa
    return (i % 2 === 0) ? '#000000' : '#FF0000'; // Alterna preto e vermelho
});

let wheelAngle = 0;
let wheelSpeed = 0;
let isSpinning = false;

// Física da bolinha
let ballAngle = 0;
let ballSpeed = 0;
let ballRadiusFromCenter = wheelRadius + 20;
let ballFalling = false;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(wheelAngle);

    const sectorAngle = (2 * Math.PI) / numbers.length;

    for (let i = 0; i < numbers.length; i++) {
        const angleStart = -Math.PI / 2 + i * sectorAngle;
        const angleEnd = angleStart + sectorAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, wheelRadius, angleStart, angleEnd);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Números centralizados em cada casa
        ctx.save();
        ctx.rotate(angleStart + sectorAngle / 2);
        ctx.translate(0, -wheelRadius + 10);
        ctx.font = '19px Arial';
        ctx.fillStyle = numbers[i] === 0 ? '#000' : '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numbers[i], 6, 2);        
        console.log(0);
        ctx.restore();
    }
    ctx.restore();
}

function drawBall() {
    // Calcula posição da bolinha
    const x = center.x + ballRadiusFromCenter * Math.cos(ballAngle);
    const y = center.y + ballRadiusFromCenter * Math.sin(ballAngle);

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue'; // Azul
    ctx.strokeStyle = 'black'; // Borda preta
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
}

function update() {
    if (isSpinning) {
        wheelAngle += wheelSpeed;
        wheelSpeed *= 0.992; // Fricção

        ballAngle -= ballSpeed;
        ballSpeed *= 0.985; // Fricção maior para a bolinha

        if (!ballFalling && ballSpeed < 0.02) {
            ballFalling = true;
        }
        if (ballFalling && ballRadiusFromCenter > wheelRadius - 25) {
            ballRadiusFromCenter -= 2;
        }

        if (wheelSpeed < 0.005 && ballRadiusFromCenter <= wheelRadius - 20) {
            isSpinning = false;
            wheelSpeed = 0;
            ballSpeed = 0;
            ballFalling = false;
        }
    }

    drawWheel();
    drawBall();
    requestAnimationFrame(update);
}

function spinWheel() {
    if (!isSpinning) {
        wheelSpeed = Math.random() * 0.08 + 0.08;
        ballSpeed = Math.random() * 0.18 + 0.18;
        isSpinning = true;
        ballFalling = false;
        ballRadiusFromCenter = wheelRadius + 20;
        ballAngle = Math.random() * Math.PI * 2;
    }
}

// Botão de girar
const spinButton = document.getElementById('spinButton');
spinButton.addEventListener('click', spinWheel);

update();