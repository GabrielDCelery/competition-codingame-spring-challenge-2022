import { MovingEntity } from '../entity';
import {
    Vector2D,
    vector2DSubtract,
    vector2DTruncate,
    vector2DNormalize,
    vector2DDot,
    vector2DLength,
    vector2DAdd,
    vector2DMultiply,
} from './vector';

export const moveToTargetPositionVelocity = ({
    sourcePos,
    sourceMaxSpeed,
    targetPos,
}: {
    sourcePos: Vector2D;
    sourceMaxSpeed: number;
    targetPos: Vector2D;
}): Vector2D => {
    const desiredVelocity = vector2DSubtract({ v1: targetPos, v2: sourcePos });
    const truncatedDesireVelocity = vector2DTruncate({ v: desiredVelocity, max: sourceMaxSpeed });
    return truncatedDesireVelocity;
};

export const moveToTargetPositionNextPosition = ({
    sourcePos,
    sourceMaxSpeed,
    targetPos,
}: {
    sourcePos: Vector2D;
    sourceMaxSpeed: number;
    targetPos: Vector2D;
}): Vector2D => {
    const truncatedDesireVelocity = moveToTargetPositionVelocity({ sourcePos, sourceMaxSpeed, targetPos });
    return vector2DAdd({ v1: sourcePos, v2: truncatedDesireVelocity });
};

export const pursuitTargetEntityVelocity = ({
    sourceEntity,
    targetEntity,
}: {
    sourceEntity: MovingEntity;
    targetEntity: MovingEntity;
}): Vector2D => {
    const toTarget = vector2DSubtract({ v1: targetEntity.position, v2: sourceEntity.position });

    const targetHeading = vector2DNormalize({ v: targetEntity.velocity });
    const myHeading = vector2DNormalize({ v: sourceEntity.velocity });

    if (
        vector2DDot({ v1: toTarget, v2: myHeading }) > 0 &&
        vector2DDot({ v1: myHeading, v2: targetHeading }) < -0.95 // relative heading
    ) {
        return moveToTargetPositionVelocity({
            sourcePos: sourceEntity.position,
            sourceMaxSpeed: sourceEntity.maxSpeed,
            targetPos: targetEntity.position,
        });
    }

    const lookAheadTime = vector2DLength({ v: toTarget }) / (sourceEntity.maxSpeed + targetEntity.maxSpeed);

    const expectedTargetPosition = vector2DAdd({
        v1: targetEntity.position,
        v2: vector2DMultiply({ v: targetEntity.velocity, ratio: lookAheadTime }),
    });

    return moveToTargetPositionVelocity({
        sourcePos: sourceEntity.position,
        sourceMaxSpeed: sourceEntity.maxSpeed,
        targetPos: expectedTargetPosition,
    });
};

export const pursuitTargetEntityNextPosition = ({
    sourceEntity,
    targetEntity,
}: {
    sourceEntity: MovingEntity;
    targetEntity: MovingEntity;
}): Vector2D => {
    const truncatedDesireVelocity = pursuitTargetEntityVelocity({ sourceEntity, targetEntity });
    return vector2DAdd({ v1: sourceEntity.position, v2: truncatedDesireVelocity });
};
