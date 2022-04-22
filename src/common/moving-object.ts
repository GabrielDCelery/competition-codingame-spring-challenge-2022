import { HERO_MAX_SPEED, MONSTER_MAX_SPEED } from '../config';
import { EntityType, Entity } from '../entity';
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

export const getEntityMaxSpeed = ({ entity }: { entity: Entity }) => {
    const { type } = entity;
    switch (type) {
        case EntityType.MY_HERO: {
            return HERO_MAX_SPEED;
        }
        case EntityType.MONSTER: {
            return MONSTER_MAX_SPEED;
        }
        case EntityType.OPPONENT_HERO: {
            return HERO_MAX_SPEED;
        }
        default: {
            throw new Error(`Unhandled entity type: ${type}`);
        }
    }
};

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
    sourceEntity: Entity;
    targetEntity: Entity;
}): Vector2D => {
    const toTarget = vector2DSubtract({ v1: targetEntity.position, v2: sourceEntity.position });

    const targetHeading = vector2DNormalize({ v: targetEntity.velocity });
    const myHeading = vector2DNormalize({ v: sourceEntity.velocity });

    const sourceMaxSpeed = getEntityMaxSpeed({ entity: sourceEntity });

    if (
        vector2DDot({ v1: toTarget, v2: myHeading }) > 0 &&
        vector2DDot({ v1: myHeading, v2: targetHeading }) < -0.95 // relative heading
    ) {
        return moveToTargetPositionVelocity({
            sourcePos: sourceEntity.position,
            sourceMaxSpeed,
            targetPos: targetEntity.position,
        });
    }

    const targetMaxSpeed = getEntityMaxSpeed({ entity: targetEntity });

    const lookAheadTime = vector2DLength({ v: toTarget }) / (sourceMaxSpeed + targetMaxSpeed);

    const expectedTargetPosition = vector2DAdd({
        v1: targetEntity.position,
        v2: vector2DMultiply({ v: targetEntity.velocity, ratio: lookAheadTime }),
    });

    return moveToTargetPositionVelocity({
        sourcePos: sourceEntity.position,
        sourceMaxSpeed,
        targetPos: expectedTargetPosition,
    });
};

export const pursuitTargetEntityNextPosition = ({
    sourceEntity,
    targetEntity,
}: {
    sourceEntity: Entity;
    targetEntity: Entity;
}): Vector2D => {
    const truncatedDesireVelocity = pursuitTargetEntityVelocity({ sourceEntity, targetEntity });
    return vector2DAdd({ v1: sourceEntity.position, v2: truncatedDesireVelocity });
};
