class RouletteWheel {
    constructor(radius) {
        this.radius = radius;
        this.angle = 0;
        this.rotationSpeed = 0;
        this.isSpinning = false;
    }

    startSpin(speed) {
        this.rotationSpeed = speed;
        this.isSpinning = true;
    }

    stopSpin() {
        this.rotationSpeed = 0;
        this.isSpinning = false;
    }

    update() {
        if (this.isSpinning) {
            this.angle += this.rotationSpeed;
            this.rotationSpeed *= 0.99; // Simulate friction
            if (this.rotationSpeed < 0.1) {
                this.stopSpin();
            }
        }
    }

    getCurrentAngle() {
        return this.angle % 360; // Keep angle within 0-360 degrees
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((Math.PI / 180) * this.getCurrentAngle());
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.restore();
    }
}