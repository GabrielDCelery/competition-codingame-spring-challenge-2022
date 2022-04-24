import { EntityThreatFor, EntityType } from './entity';
import { GameState, PlayerID } from './game-state';
import { Vector2D, vector2DAdd, vector2DDistance, vector2DMultiply, vector2DNormalize } from './common';
import { MONSTER_BASE_DETECTION_THRESHOLD, MONSTER_MAX_SPEED } from './config';

export enum PositionType {
    MY_BASE = 'MY_BASE',
    MY_BASE_EDGE = 'MY_BASE_EDGE',
    CENTER = 'CENTER',
    OUTER_RIM = 'OUTER_RIM',
}

const mapAreaCenterCoordinatesForTopLeft: { [key in PositionType]: Vector2D[] } = {
    [PositionType.MY_BASE]: [{ x: 1763, y: 1500 }],
    [PositionType.MY_BASE_EDGE]: [
        { x: 5289, y: 1500 },
        { x: 5289, y: 4500 },
        { x: 1763, y: 4500 },
    ],
    [PositionType.CENTER]: [{ x: 8815, y: 4500 }],
    [PositionType.OUTER_RIM]: [
        { x: 8815, y: 1500 },
        { x: 1763, y: 7500 },
    ],
};

const mapAreaCenterCoordinatesForBottomRight: { [key in PositionType]: Vector2D[] } = {
    [PositionType.MY_BASE]: [{ x: 17630 - 1763, y: 9000 - 1500 }],
    [PositionType.MY_BASE_EDGE]: [
        { x: 17630 - 5289, y: 9000 - 1500 },
        { x: 17630 - 5289, y: 9000 - 4500 },
        { x: 17630 - 1763, y: 9000 - 4500 },
    ],
    [PositionType.CENTER]: [{ x: 8815, y: 4500 }],
    [PositionType.OUTER_RIM]: [
        { x: 8815, y: 7500 },
        { x: 17630 - 1763, y: 1500 },
    ],
};

export type EntityAnalyis = { turnsItTakesToDamageBase: number };

export type GameStateAnalysis = {
    players: {
        [PlayerID.ME]: {
            heroIDs: number[];
            monsterWanderingIDs: number[];
            monsterThreateningMyBaseByDistanceIDs: number[];
            mapAreaCenterCoordinatesGroupedByType: { [key in PositionType]: Vector2D[] };
        };
        [PlayerID.OPPONENT]: {
            heroIDs: number[];
            // monsterWanderingIDs: number[];
            // monsterThreateningMyBaseByDistanceIDs: number[];
            // mapAreaCenterCoordinatesGroupedByType: { [key in PositionType]: Vector2D[] };
        };
    };
    monsterIDs: number[];
    entityAnalysisMap: { [index: number]: EntityAnalyis };
};

const getNumOfTurnsItTakesForEntityToDamageBase = ({
    gameState,
    entityID,
}: {
    gameState: GameState;
    entityID: number;
}): number => {
    const entity = gameState.entityMap[entityID];
    const { type, threatFor } = entity;
    if (type !== EntityType.MONSTER || threatFor === EntityThreatFor.NEITHER) {
        return Infinity;
    }
    const targetedPlayerID = threatFor === EntityThreatFor.MY_BASE ? PlayerID.ME : PlayerID.OPPONENT;
    const baseCoordinates = gameState.players[targetedPlayerID].baseCoordinates;
    const monsterTickSpeed = 100;
    const velocity = vector2DMultiply({ v: vector2DNormalize({ v: entity.velocity }), ratio: monsterTickSpeed });
    let numOfTicks = 0;
    let expectedPosition = { x: entity.position.x, y: entity.position.y };
    const currentDistanceFromBase = vector2DDistance({ v1: baseCoordinates, v2: expectedPosition });
    let hasReachedBordersOfBase = currentDistanceFromBase <= MONSTER_BASE_DETECTION_THRESHOLD;
    if (hasReachedBordersOfBase) {
        return Math.floor(currentDistanceFromBase / MONSTER_MAX_SPEED);
    }
    while (!hasReachedBordersOfBase) {
        expectedPosition = vector2DAdd({ v1: expectedPosition, v2: velocity });
        numOfTicks++;
        if (vector2DDistance({ v1: baseCoordinates, v2: expectedPosition }) <= MONSTER_BASE_DETECTION_THRESHOLD) {
            hasReachedBordersOfBase = true;
        }
    }
    return Math.floor(
        MONSTER_BASE_DETECTION_THRESHOLD / MONSTER_MAX_SPEED + (monsterTickSpeed * numOfTicks) / MONSTER_MAX_SPEED
    );
};

export const createGameStateAnalysis = ({ gameState }: { gameState: GameState }): GameStateAnalysis => {
    const { x: baseX, y: baseY } = gameState.players[PlayerID.ME].baseCoordinates;
    const amIInTopLeft = baseX === 0 && baseY === 0;
    const gameStateAnalysis: GameStateAnalysis = {
        players: {
            [PlayerID.ME]: {
                heroIDs: [],
                monsterWanderingIDs: [],
                monsterThreateningMyBaseByDistanceIDs: [],
                mapAreaCenterCoordinatesGroupedByType: amIInTopLeft
                    ? mapAreaCenterCoordinatesForTopLeft
                    : mapAreaCenterCoordinatesForBottomRight,
            },
            [PlayerID.OPPONENT]: {
                heroIDs: [],
                /*
               monsterWanderingIDs: [],
                monsterThreateningMyBaseByDistanceIDs: [],
                mapAreaCenterCoordinatesGroupedByType: amIInTopLeft
                    ? mapAreaCenterCoordinatesForBottomRight
                    : mapAreaCenterCoordinatesForTopLeft,
                    */
            },
        },
        monsterIDs: [],
        entityAnalysisMap: {},
    };

    const entityIDs = Object.keys(gameState.entityMap).map((v) => Number.parseInt(v, 10));

    entityIDs.forEach((entityID) => {
        gameStateAnalysis.entityAnalysisMap[entityID] = {
            turnsItTakesToDamageBase: getNumOfTurnsItTakesForEntityToDamageBase({ gameState, entityID }),
        };
    });

    entityIDs.forEach((entityID) => {
        const entity = gameState.entityMap[entityID];
        const { type } = entity;
        switch (type) {
            case EntityType.MY_HERO: {
                return gameStateAnalysis.players[PlayerID.ME].heroIDs.push(entityID);
            }
            case EntityType.OPPONENT_HERO: {
                return gameStateAnalysis.players[PlayerID.OPPONENT].heroIDs.push(entityID);
            }
            case EntityType.MONSTER: {
                return gameStateAnalysis.monsterIDs.push(entityID);
            }
            default: {
                throw new Error('oops');
            }
        }
    });

    gameStateAnalysis.players[PlayerID.ME].monsterWanderingIDs = entityIDs.filter((entityID) => {
        const { type, threatFor } = gameState.entityMap[entityID];
        return type === EntityType.MONSTER && threatFor === EntityThreatFor.NEITHER;
    });

    gameStateAnalysis.players[PlayerID.ME].monsterThreateningMyBaseByDistanceIDs = entityIDs
        .filter((entityID) => {
            const { type, threatFor } = gameState.entityMap[entityID];
            return type === EntityType.MONSTER && threatFor === EntityThreatFor.MY_BASE;
        })
        .sort((a, b) => {
            const monsterA = gameStateAnalysis.entityAnalysisMap[a];
            const monsterB = gameStateAnalysis.entityAnalysisMap[b];
            if (monsterA.turnsItTakesToDamageBase < monsterB.turnsItTakesToDamageBase) {
                return -1;
            }
            if (monsterA.turnsItTakesToDamageBase > monsterB.turnsItTakesToDamageBase) {
                return 1;
            }
            return 0;
        });
    /*
    gameStateAnalysis.players[PlayerID.OPPONENT].monsterWanderingIDs = entityIDs.filter((entityID) => {
        const { type, threatFor } = gameState.entityMap[entityID];
        return type === EntityType.MONSTER && threatFor === EntityThreatFor.NEITHER;
    });

    gameStateAnalysis.players[PlayerID.OPPONENT].monsterThreateningMyBaseByDistanceIDs = entityIDs
        .filter((entityID) => {
            const { type, threatFor } = gameState.entityMap[entityID];
            return type === EntityType.MONSTER && threatFor === EntityThreatFor.OPPONENT_BASE;
        })
        .sort((a, b) => {
            const monsterA = gameStateAnalysis.entityAnalysisMap[a];
            const monsterB = gameStateAnalysis.entityAnalysisMap[b];
            if (monsterA.turnsItTakesToDamageBase < monsterB.turnsItTakesToDamageBase) {
                return -1;
            }
            if (monsterA.turnsItTakesToDamageBase > monsterB.turnsItTakesToDamageBase) {
                return 1;
            }
            return 0;
        });
    */
    return gameStateAnalysis;
};
