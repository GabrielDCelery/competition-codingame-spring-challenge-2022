import { Vector2D } from './common';
import { HERO_MAX_SPEED, MONSTER_MAX_SPEED } from './config';

export enum EntityType {
    MONSTER = 0,
    MY_HERO = 1,
    OPPONENT_HERO = 2,
    POINT_ON_MAP = 3,
}

export enum EntityThreatFor {
    NEITHER = 0,
    MY_BASE = 1,
    OPPONENT_BASE = 2,
}

export enum EntityControlled {
    IS_CONTROLLED = 1,
}

export enum EntityNearBase {
    NOT_TARGETING_BASE = 0,
    TARGETING_BASE = 1,
}

export type EntityBase = {
    id: number;
    type: number;
};

export type MovingEntity = {
    position: Vector2D;
    velocity: Vector2D;
    maxSpeed: number;
};

export type Entity = {
    shieldLife: number;
    isControlled: number;
    health: number;
    nearBase: number;
    threatFor: number;
} & MovingEntity &
    EntityBase;

export const cloneEntity = ({ entity }: { entity: Entity }): Entity => {
    return {
        id: entity.id,
        type: entity.type,
        shieldLife: entity.shieldLife,
        isControlled: entity.isControlled,
        health: entity.health,
        nearBase: entity.nearBase,
        threatFor: entity.threatFor,
        position: { x: entity.position.x, y: entity.position.y },
        velocity: { x: entity.velocity.x, y: entity.velocity.y },
        maxSpeed: entity.maxSpeed,
    };
};

export const getMaxSpeedOfEntity = ({ entityType }: { entityType: number }): number => {
    switch (entityType) {
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
            throw new Error(`Unhandled entity type: ${entityType}`);
        }
    }
};
