import { MovingObject } from './common';

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

export class Entity {
    id: number;
    type: number;
    shieldLife: number;
    isControlled: number;
    health: number;
    nearBase: number;
    threatFor: number;
    movingObject: MovingObject;

    constructor({
        id,
        type,
        x,
        y,
        shieldLife,
        isControlled,
        health,
        vx,
        vy,
        nearBase,
        threatFor,
    }: {
        id: number;
        type: number;
        x: number;
        y: number;
        shieldLife: number;
        isControlled: number;
        health: number;
        vx: number;
        vy: number;
        nearBase: number;
        threatFor: number;
    }) {
        this.id = id;
        this.type = type;
        this.shieldLife = shieldLife;
        this.isControlled = isControlled;
        this.health = health;
        this.nearBase = nearBase;
        this.threatFor = threatFor;
        this.movingObject = MovingObject.Instance({
            position: { x, y },
            velocity: { x: vx, y: vy },
            maxSpeed: (() => {
                switch (type) {
                    case EntityType.MY_HERO: {
                        return 800;
                    }
                    case EntityType.OPPONENT_HERO: {
                        return 800;
                    }
                    case EntityType.MONSTER: {
                        return 400;
                    }
                    default: {
                        throw new Error(`Unhandled entity type: ${type}`);
                    }
                }
            })(),
        });
    }
}
