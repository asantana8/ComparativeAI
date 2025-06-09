class RouletteGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.radius = Math.min(canvas.width, canvas.height) / 3;
        this.rotation = 0;
        this.spinning = false;
        this.ballAngle = 0;
        this.ballRadius = this.radius - 20;
        this.ballSpeed = 0;
        this.numbers = Array.from({length: 37}, (_, i) => i); // 0-36
    }

    init() {
        this.draw();
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('spinButton').addEventListener('click', () => {
            if (!this.spinning) {
                this.spin();
            }
        });
    }

    spin() {
        this.spinning = true;
        this.ballSpeed = Math.random() * 0.3 + 0.2;
        this.rotationSpeed = Math.random() * 0.2 + 0.1;
        this.animate();
    }

    animate() {
        if (!this.spinning) return;

        // Atualiza a rotação da roleta
        this.rotation += this.rotationSpeed;
        
        // Física da bola
        this.ballAngle += this.ballSpeed;
        this.ballSpeed *= 0.995; // Atrito
        this.rotationSpeed *= 0.995; // Desaceleração da roleta

        // Para a animação quando a velocidade for muito baixa
        if (this.ballSpeed < 0.001) {
            this.spinning = false;
            this.determineWinningNumber();
        }

        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenha a roleta
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.rotation);

        // Desenha os números e setores
    for (let i = 0; i < 37; i++) {
        const angle = (i * 2 * Math.PI) / 37;
        const color = i === 0 ? '#0f0' : (i % 2 ? '#000' : '#f00');
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, this.radius, angle, angle + (2 * Math.PI) / 37);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Adiciona os números
        this.ctx.save();
        this.ctx.rotate(angle + Math.PI / 37); // Centraliza o texto no setor
        this.ctx.translate(this.radius - 30, 0); // Posiciona o texto próximo à borda
        this.ctx.rotate(Math.PI / 2); // Rotaciona o texto para ficar na orientação correta
        this.ctx.fillStyle = '#fff'; // Cor do texto
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(i.toString(), 0, 0);
        this.ctx.restore();
    }


        this.ctx.restore();

        // Desenha a bola
        const ballX = this.centerX + Math.cos(this.ballAngle) * this.ballRadius;
        const ballY = this.centerY + Math.sin(this.ballAngle) * this.ballRadius;
        
        this.ctx.beginPath();
        this.ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
    }

    determineWinningNumber() {
        const normalizedAngle = (this.ballAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor((normalizedAngle / (2 * Math.PI)) * 37);
        console.log(`Winning number: ${this.numbers[winningIndex]}`);
    }
}

// Modificar a inicialização no final do arquivo
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('rouletteCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const game = new RouletteGame(canvas);
    game.init();
});