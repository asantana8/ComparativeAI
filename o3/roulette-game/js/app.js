const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const wheelRadius = 250;
const ballRadius = 10;

// Definição dos pockets conforme roleta real, com o 0 em amarelo
const pockets = [
    { number: 0, color: "yellow" },
    { number: 1, color: "red" },
    { number: 2, color: "black" },
    { number: 3, color: "red" },
    { number: 4, color: "black" },
    { number: 4, color: "red" },
    { number: 6, color: "black" },
    { number: 7, color: "red" },
    { number: 8, color: "black" },
    { number: 9, color: "red" },
    { number: 10, color: "black" },
    { number: 11, color: "red" },
    { number: 12, color: "black" },
    { number: 13, color: "red" },
    { number: 14, color: "black" },
    { number: 15, color: "red" },
    { number: 16, color: "black" },
    { number: 17, color: "red" },
    { number: 18, color: "black" },
    { number: 18, color: "red" },
    { number: 20, color: "black" },
    { number: 21, color: "red" },
    { number: 22, color: "black" },
    { number: 23, color: "red" },
    { number: 24, color: "black" },
    { number: 25, color: "red" },
    { number: 26, color: "black" },
    { number: 27, color: "red" },
    { number: 28, color: "black" },
    { number: 29, color: "red" },
    { number: 30, color: "black" },
    { number: 31, color: "red" },
    { number: 32, color: "black" },
    { number: 33, color: "red" },
    { number: 34, color: "black" },
    { number: 35, color: "red" },
    { number: 36, color: "black" }
];

const segmentAngle = 2 * Math.PI / pockets.length;

let wheelAngle = 0;
const wheelSpeed = 0.09; // rotação constante da roleta

let ballAngle = 0;
let ballAngularVelocity = 0;
let spinning = false;
let ballStopped = false;

// Variáveis para simular a queda da bolinha:
// A bolinha começa na borda externa da roleta (igual a wheelRadius)
// e desce gradualmente até atingir o target (um pouco para dentro, por exemplo, wheelRadius - 20)
let ballOrbitRadius = wheelRadius;
const targetBallOrbitRadius = wheelRadius - 20;
const dropSpeed = 1; // quantidade de pixels que a bolinha desce por frame

// Inicia o giro quando o botão é clicado
document.getElementById('spinButton').addEventListener('click', () => {
    if (!spinning) {
        spinning = true;
        ballStopped = false;
        ballAngularVelocity = 0.19; // velocidade inicial da bolinha
        wheelAngularVelocity = 0.09; // reinicia velocidade da roleta
         // Reinicia a posição da bolinha na órbita externa
        ballOrbitRadius = wheelRadius;
        animate();
    }
});

function drawWheel() {
    // Desenha cada segmento da roleta
    for (let i = 0; i < pockets.length; i++) {
        const startAngle = wheelAngle + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = pockets[i].color;
        ctx.fill();
        ctx.stroke();

        // Desenha o número no centro do segmento
        const midAngle = startAngle + segmentAngle / 2;
        const textX = centerX + (wheelRadius - 40) * Math.cos(midAngle);
        const textY = centerY + (wheelRadius - 40) * Math.sin(midAngle);
        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";        
        ctx.fillText(pockets[i].number, textX, textY);        
    }
}

function drawBall() {
    // Utiliza a variável ballOrbitRadius para posicionar a bolinha
    const x = centerX + ballOrbitRadius * Math.cos(ballAngle);
    const y = centerY + ballOrbitRadius * Math.sin(ballAngle);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";      // cor da bolinha
    ctx.strokeStyle = "black";   // borda da bolinha
    ctx.fill();
    ctx.stroke();
}

function updatePhysics() {
    // Atualiza a rotação da roleta com desaceleração gradual
    if (wheelAngularVelocity > 0.002) {
        wheelAngle += wheelAngularVelocity;
        wheelAngularVelocity *= 0.995; // aplica atrito à roleta
    } else {
        wheelAngularVelocity = 0;
    }
    
    // Atualiza a posição angular da bolinha, aplicando atrito (física simplificada)
    if (!ballStopped) {
        ballAngle += ballAngularVelocity;
        ballAngularVelocity *= 0.995; // desaceleração gradual da bolinha

        // Simula a queda da bolinha: enquanto ela não estiver no target, a órbita diminui gradativamente
        if (ballOrbitRadius > targetBallOrbitRadius) {
            ballOrbitRadius -= dropSpeed;
            if (ballOrbitRadius < targetBallOrbitRadius) {
                ballOrbitRadius = targetBallOrbitRadius;
            }
        }
        
        // Se a bolinha desacelerar o suficiente, alinhá-la com o segmento mais próximo
        if (ballAngularVelocity < 0.002) {
            ballStopped = true;
            spinning = false;

            // Calcula o ângulo relativo entre a bolinha e a roleta
            const relativeAngle = (ballAngle - wheelAngle) % (2 * Math.PI);
            let adjustedAngle = relativeAngle < 0 ? relativeAngle + 2 * Math.PI : relativeAngle;
            // Determina em qual segmento a bolinha parou
            const pocketIndex = Math.floor((adjustedAngle + segmentAngle / 2) / segmentAngle) % pockets.length;
            // Reposiciona a bolinha exatamente no centro do segmento
            const targetRelativeAngle = pocketIndex * segmentAngle;
            ballAngle = wheelAngle + targetRelativeAngle;
            console.log("Resultado: " + pockets[pocketIndex].number);
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel();
    drawBall();
    updatePhysics();
    if (spinning || !ballStopped) {
        requestAnimationFrame(animate);
    }
}

// Renderização inicial
drawWheel();
drawBall();