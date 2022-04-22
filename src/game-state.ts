import { getEntityExpectedPosition, Vector2D } from './common';
import { isMonsterWithinBase } from './conditions';
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
            baseCoordinates: Vector2D;
        };
        [PlayerID.OPPONENT]: {
            baseHealth: number;
            mana: number;
            baseCoordinates: Vector2D;
        };
    };
    entityMap: { [index: number]: Entity };
};

export const createEmptyGameState = (): GameState => {
    return {
        players: {
            [PlayerID.ME]: {
                baseHealth: 0,
                mana: 0,
                baseCoordinates: { x: 0, y: 0 },
            },
            [PlayerID.OPPONENT]: {
                baseHealth: 0,
                mana: 0,
                baseCoordinates: { x: 0, y: 0 },
            },
        },
        entityMap: {},
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
    gameStateCopy.entityMap[entity.id] = entity;
    return gameStateCopy;
};

export const getMonstersIDs = ({ gameState }: { gameState: GameState }): number[] => {
    const monsterIDs: number[] = [];
    Object.values(gameState.entityMap).forEach((entity) => {
        if (entity.type !== EntityType.MONSTER) {
            return;
        }
        monsterIDs.push(entity.id);
    });
    return monsterIDs;
};

export const createCompositeGameState = ({
    oldGameState,
    newGameState,
}: {
    oldGameState: GameState;
    newGameState: GameState;
}): GameState => {
    const compositeGameState: GameState = newGameState;
    const oldEntityIDs = Object.keys(oldGameState.entityMap).map((v) => Number.parseInt(v));
    oldEntityIDs.forEach((oldEntityID) => {
        if (compositeGameState.entityMap[oldEntityID]) {
            return;
        }
        const entityNotSeenThisTurn = oldGameState.entityMap[oldEntityID];
        if (isMonsterWithinBase({ gameState: oldGameState, entity: entityNotSeenThisTurn })) {
            return;
        }
        const expectedPosition = getEntityExpectedPosition({ entity: entityNotSeenThisTurn });
        compositeGameState.entityMap[oldEntityID] = { ...entityNotSeenThisTurn, position: expectedPosition };
    });
    return compositeGameState;
};
