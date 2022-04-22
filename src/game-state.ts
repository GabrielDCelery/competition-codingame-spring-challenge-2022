import { Vector2D } from './common';
import { Entity, EntityType } from './entity';

export enum PlayerID {
    ME = 0,
    OPPONENT = 1,
}

export type GameState = {
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
    entityHistoryMap: { [index: number]: Entity };
};

export const createEmptyGameState = (): GameState => {
    return {
        players: {
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
        },
        entityHistoryMap: {},
    };
};

export const setBaseForPlayer = ({
    gameState,
    playerID,
    baseHealth,
    baseCoordinates,
}: {
    gameState: GameState;
    playerID: PlayerID;
    baseHealth: number;
    baseCoordinates: Vector2D;
}): GameState => {
    const gameStateCopy = gameState;
    gameStateCopy.players[playerID].baseHealth = baseHealth;
    gameStateCopy.players[playerID].baseCoordinates = baseCoordinates;
    return gameStateCopy;
};

export const setManaForPlayer = ({
    gameState,
    playerID,
    mana,
}: {
    gameState: GameState;
    playerID: PlayerID;
    mana: number;
}) => {
    const gameStateCopy = gameState;
    gameStateCopy.players[playerID].mana = mana;
    return gameStateCopy;
};

export const addEntity = ({ gameState, entity }: { gameState: GameState; entity: Entity }) => {
    const gameStateCopy = gameState;
    gameStateCopy.entityHistoryMap[entity.id] = entity;

    (() => {
        switch (entity.type) {
            case EntityType.MY_HERO: {
                return gameState.players[PlayerID.ME].heroes.push(entity.id);
            }
            case EntityType.OPPONENT_HERO: {
                return gameState.players[PlayerID.OPPONENT].heroes.push(entity.id);
            }
            case EntityType.MONSTER: {
                return;
            }
            default: {
                throw new Error(`Unhandled entity type -> ${entity.type}`);
            }
        }
    })();

    return gameStateCopy;
};

export const getMonstersIDs = ({ gameState }: { gameState: GameState }): number[] => {
    const monsterIDs: number[] = [];
    Object.values(gameState.entityHistoryMap).forEach((entity) => {
        if (entity.type !== EntityType.MONSTER) {
            return;
        }
        monsterIDs.push(entity.id);
    });
    return monsterIDs;
};

/*
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

    entityHistoryMap: { [index: number]: Entity };

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
        this.entityHistoryMap = {};
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
        this.entityHistoryMap[entity.id] = entity;
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

*/
