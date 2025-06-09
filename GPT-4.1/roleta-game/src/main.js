const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const wheelRadius = 180;
const ballRadius = 8;
const center = { x: canvas.width / 2, y: canvas.height / 2 };

// Sequência crescente de 0 a 36
const numbers = Array.from({ length: 37 }, (_, i) => i);

// Cores: 0 verde, depois alternando vermelho/preto
const colors = numbers.map((n, i) => {
    if (n === 0) return '#008000'; // Verde
    // Vermelho se ímpar, preto se par
    return n % 2 === 1 ? '#FF0000' : '#000000';
});

let wheelAngle = 0;
let wheelSpeed = 0;
let isSpinning = false;

// Física da bolinha
let ballAngle = 0;
let ballSpeed = 0;
let ballRadiusFromCenter = wheelRadius + 10;
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

        // Números centralizados em cada casa, sempre "em pé"
        ctx.save();
        ctx.rotate(angleStart + sectorAngle / 2);
        ctx.translate(0, -wheelRadius + 10);
        ctx.font = '16px Arial';
        ctx.fillStyle = numbers[i] === 0 ? '#000' : '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numbers[i], 0, 0);
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
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.stroke();
}

function update() {
    if (isSpinning) {
        wheelAngle += wheelSpeed;
        wheelSpeed *= 0.992; // Fricção

        ballAngle -= ballSpeed;
        ballSpeed *= 0.985; // Fricção maior para a bolinha

        if (!ballFalling && ballSpeed < 0.03) {
            ballFalling = true;
        }
        if (ballFalling && ballRadiusFromCenter > wheelRadius - 20) {
            ballRadiusFromCenter -= 2;
        }

        // Não reseta mais a posição da bola ao parar
        if (wheelSpeed < 0.005 && ballRadiusFromCenter <= wheelRadius - 20) {
            isSpinning = false;
            wheelSpeed = 0;
            ballSpeed = 0;
            ballFalling = false;
            // Não altere ballRadiusFromCenter nem ballAngle aqui!
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

document.addEventListener('click', spinWheel);
update();