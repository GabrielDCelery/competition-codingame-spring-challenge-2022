import { Vector2D } from './common';

export enum EntityType {
    MONSTER = 0,
    MY_HERO = 1,
    OPPONENT_HERO = 2,
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

export type MovingEntity = {
    position: Vector2D;
    velocity: Vector2D;
    maxSpeed: number;
};

export type Entity = {
    id: number;
    type: number;
    shieldLife: number;
    isControlled: number;
    health: number;
    nearBase: number;
    threatFor: number;
} & MovingEntity;
