import {
    Vector2D,
    Vector2DSubtract,
    Vector2DTruncate,
    Vector2DNormalize,
    Vector2DDot,
    Vector2DLength,
    Vector2DAdd,
    Vector2DMultiply,
} from './vector';

export class MovingObject {
    position: Vector2D;
    velocity: Vector2D;
    maxSpeed: number;

    constructor({ position, velocity, maxSpeed }: { position: Vector2D; velocity: Vector2D; maxSpeed: number }) {
        this.position = position;
        this.velocity = velocity;
        this.maxSpeed = maxSpeed;
    }

    static Instance({
        position,
        velocity,
        maxSpeed,
    }: {
        position: Vector2D;
        velocity: Vector2D;
        maxSpeed: number;
    }): MovingObject {
        return new MovingObject({ position, velocity, maxSpeed });
    }

    /**
     * Returns the max available velocity that moves the object to target location
     */
    MoveToTargetPositionVelocity({ targetPos }: { targetPos: Vector2D }): Vector2D {
        const desiredVelocity = Vector2DSubtract({ v1: targetPos, v2: this.position });
        const truncatedDesireVelocity = Vector2DTruncate({ v: desiredVelocity, max: this.maxSpeed });
        return Vector2DAdd({ v1: this.position, v2: truncatedDesireVelocity });
        // return truncatedDesireVelocity;
    }

    /**
     * Returns the max available velocity that moves the object to chase other object
     */
    PursuitTargetObjectVelocity({ target }: { target: MovingObject }): Vector2D {
        const toTarget = Vector2DSubtract({ v1: target.position, v2: this.position });

        const targetHeading = Vector2DNormalize({ v: target.velocity });
        const myHeading = Vector2DNormalize({ v: this.velocity });

        if (
            Vector2DDot({ v1: toTarget, v2: myHeading }) > 0 &&
            Vector2DDot({ v1: myHeading, v2: targetHeading }) < -0.95 // relative heading
        ) {
            return this.MoveToTargetPositionVelocity({ targetPos: target.position });
        }

        const lookAheadTime = Vector2DLength({ v: toTarget }) / (this.maxSpeed + target.maxSpeed);

        const expectedTargetPosition = Vector2DAdd({
            v1: target.position,
            v2: Vector2DMultiply({ v: target.velocity, ratio: lookAheadTime }),
        });

        return this.MoveToTargetPositionVelocity({ targetPos: expectedTargetPosition });
    }
}
