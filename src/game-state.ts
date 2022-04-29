import { getEntityExpectedPosition, Vector2D, vector2DDistancePow, vector2DSubtract } from './common';
import { isEntityWithinMapBoundaries, isEntitySeenByBase } from './conditions';
import { BASE_VISION_RADIUS, HERO_VISION_RANGE } from './config';
import { cloneEntity, Entity, EntityType } from './entity';

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

export const createCompositeGameState = ({
    oldGameState,
    newGameState,
}: {
    oldGameState: GameState;
    newGameState: GameState;
}): GameState => {
    const compositeGameState: GameState = newGameState;
    const newEntityIDs = Object.keys(newGameState.entityMap).map((v) => Number.parseInt(v));

    // sort out incomplete velocity data
    newEntityIDs.forEach((newEntityID) => {
        const matchingOldEntity = oldGameState.entityMap[newEntityID];
        if (!matchingOldEntity) {
            return;
        }
        if (![EntityType.MY_HERO, EntityType.OPPONENT_HERO].includes(matchingOldEntity.type)) {
            return;
        }
        compositeGameState.entityMap[newEntityID].velocity = vector2DSubtract({
            v1: compositeGameState.entityMap[newEntityID].position,
            v2: matchingOldEntity.position,
        });
    });

    const myHeroIDs = Object.values(compositeGameState.entityMap)
        .filter((entity) => entity.type === EntityType.MY_HERO)
        .map((v) => v.id);

    const oldEntityIDs = Object.keys(oldGameState.entityMap).map((v) => Number.parseInt(v));
    oldEntityIDs.forEach((oldEntityID) => {
        const entityLastKnowState = oldGameState.entityMap[oldEntityID];
        if (entityLastKnowState.type !== EntityType.MONSTER) {
            return;
        }
        const entityWasSeenThisTurn = !!compositeGameState.entityMap[oldEntityID];
        if (entityWasSeenThisTurn) {
            return;
        }
        const expectedPosition = getEntityExpectedPosition({ entity: entityLastKnowState });

        const wasEntitySeenByMyBase =
            vector2DDistancePow({
                v1: compositeGameState.players[PlayerID.ME].baseCoordinates,
                v2: expectedPosition,
            }) <= Math.pow(BASE_VISION_RADIUS, 2);

        if (wasEntitySeenByMyBase) {
            return;
        }

        const myHeroThatSawEntity = myHeroIDs.find((heroID) => {
            return (
                vector2DDistancePow({ v1: compositeGameState.entityMap[heroID].position, v2: expectedPosition }) <=
                Math.pow(HERO_VISION_RANGE, 2)
            );
        });

        if (myHeroThatSawEntity !== undefined) {
            return;
        }

        const newEntity = { ...cloneEntity({ entity: entityLastKnowState }), position: expectedPosition };
        if (!isEntityWithinMapBoundaries({ entity: newEntity })) {
            return;
        }
        compositeGameState.entityMap[oldEntityID] = newEntity;
    });

    return compositeGameState;
};
