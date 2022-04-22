import { Vector2D } from './common';
import { Entity, EntityType } from './entity';

export enum PlayerID {
    ME = 0,
    OPPONENT = 1,
}

export class GameState {
    players: {
        [PlayerID.ME]: {
            baseHealth: number;
            mana: number;
            heroes: number[];
            baseCoordinates: Vector2D;
        };
        [PlayerID.OPPONENT]: {
            baseHealth: number;
            mana: number;
            heroes: number[];
            baseCoordinates: Vector2D;
        };
    };

    entitiesMap: { [index: number]: Entity };

    monsters: number[];

    constructor() {
        this.players = {
            [PlayerID.ME]: {
                baseHealth: 0,
                mana: 0,
                heroes: [],
                baseCoordinates: { x: 0, y: 0 },
            },
            [PlayerID.OPPONENT]: {
                baseHealth: 0,
                mana: 0,
                heroes: [],
                baseCoordinates: { x: 0, y: 0 },
            },
        };
        this.entitiesMap = {};
        this.monsters = [];
    }

    setBaseForPlayer({
        playerID,
        baseHealth,
        baseCoordinates,
    }: {
        playerID: PlayerID;
        baseHealth: number;
        baseCoordinates: Vector2D;
    }) {
        this.players[playerID] = {
            ...this.players[playerID],
            baseHealth,
            baseCoordinates,
        };
    }

    setManaForPlayer({ playerID, mana }: { playerID: PlayerID; mana: number }) {
        this.players[playerID] = {
            ...this.players[playerID],
            mana,
        };
    }

    addEntity({ entity }: { entity: Entity }) {
        this.entitiesMap[entity.id] = entity;
        switch (entity.type) {
            case EntityType.MY_HERO: {
                return this.players[PlayerID.ME].heroes.push(entity.id);
            }
            case EntityType.OPPONENT_HERO: {
                return this.players[PlayerID.OPPONENT].heroes.push(entity.id);
            }
            case EntityType.MONSTER: {
                return this.monsters.push(entity.id);
            }
            default: {
                throw new Error(`Unhandled entity type -> ${entity.type}`);
            }
        }
    }
}
