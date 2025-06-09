const GRAVITY = 9.81; // Acceleration due to gravity in m/s²
const FRICTION_COEFFICIENT = 0.05; // Coefficient of friction for the ball on the wheel

/**
 * Calculates the rotation speed of the wheel based on the input speed.
 * @param {number} inputSpeed - The initial speed given by the user.
 * @returns {number} - The adjusted rotation speed of the wheel.
 */
function calculateRotationSpeed(inputSpeed) {
    return inputSpeed * (1 - FRICTION_COEFFICIENT);
}

/**
 * Calculates the position of the ball on the wheel after a given time.
 * @param {number} initialPosition - The initial position of the ball on the wheel.
 * @param {number} rotationSpeed - The current rotation speed of the wheel.
 * @param {number} time - The time in seconds for which the ball has been moving.
 * @returns {number} - The new position of the ball on the wheel.
 */
function calculateBallPosition(initialPosition, rotationSpeed, time) {
    const distanceTravelled = rotationSpeed * time;
    return (initialPosition + distanceTravelled) % 360; // Assuming the wheel is 360 degrees
}

/**
 * Simulates the movement of the ball under the influence of gravity.
 * @param {number} initialVelocity - The initial velocity of the ball.
 * @param {number} time - The time in seconds for which the ball has been falling.
 * @returns {number} - The final position of the ball after falling.
 */
function simulateBallFall(initialVelocity, time) {
    const distanceFallen = initialVelocity * time + 0.5 * GRAVITY * time * time;
    return distanceFallen; // Returns the distance fallen in meters
}

export { calculateRotationSpeed, calculateBallPosition, simulateBallFall };