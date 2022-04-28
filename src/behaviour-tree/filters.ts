import { ChosenHeroCommands, CommandType } from '../commands';
import { Vector2D, vector2DDistancePow, vector2DDot, vector2DSubtract, vectorToKey } from '../common';
import { isPositionNearMapMarker } from '../conditions';
import { EntityBase, MovingEntity } from '../entity';
import { GameState, PlayerID } from '../game-state';
import { GameStateAnalysis } from '../game-state-analysis';

export const filterDownToNonPatrolledPositions = ({
    heroID,
    positionsToFilter,
    gameState,
    gameStateAnalysis,
    chosenHeroCommands,
}: {
    heroID: number;
    positionsToFilter: Vector2D[];
    gameState: GameState;
    gameStateAnalysis: GameStateAnalysis;
    chosenHeroCommands: ChosenHeroCommands;
}): Vector2D[] => {
    const positionsAlreadyCoveredMap: { [index: string]: Vector2D } = {};

    gameStateAnalysis.players[PlayerID.ME].heroIDs.forEach((heroID) => {
        const heroPositon = gameState.entityMap[heroID].position;
        const closestToHeroFilterPosition = getClosestPosition({
            sourceEntity: gameState.entityMap[heroID],
            positions: positionsToFilter,
        });
        const isHeroFacingClosestPosition =
            vector2DDot({
                v1: gameState.entityMap[heroID].velocity,
                v2: vector2DSubtract({
                    v1: closestToHeroFilterPosition,
                    v2: gameState.entityMap[heroID].position,
                }),
            }) >= 0;

        if (!isHeroFacingClosestPosition) {
            positionsAlreadyCoveredMap[vectorToKey({ v: closestToHeroFilterPosition })] = closestToHeroFilterPosition;
        }
        positionsAlreadyCoveredMap[vectorToKey({ v: heroPositon })] = heroPositon;
    });

    Object.values(chosenHeroCommands).forEach((chosenHeroCommand) => {
        if (
            [CommandType.FARM, CommandType.INTERCEPT, CommandType.MOVE_TO_AREA, CommandType.WAIT].includes(
                chosenHeroCommand.type
            )
        ) {
            positionsAlreadyCoveredMap[vectorToKey({ v: chosenHeroCommand.target.position })] =
                chosenHeroCommand.target.position;
        }
    });

    const positionsAlreadyCovered = Object.values(positionsAlreadyCoveredMap);

    const filteredUncoveredAreas = positionsToFilter.filter((areaToFilter) => {
        for (let i = 0, iMax = positionsAlreadyCovered.length; i < iMax; i++) {
            const positionAlreadyCovered = positionsAlreadyCovered[i];
            const isAreaCovered = isPositionNearMapMarker({
                position: positionAlreadyCovered,
                mapMarker: areaToFilter,
            });
            if (isAreaCovered) {
                return false;
            }
        }
        return true;
    });

    return filteredUncoveredAreas;
};

export const getMyOtherAvailableHeroIDs = ({
    heroID,
    gameStateAnalysis,
    chosenHeroCommands,
}: {
    heroID: number;
    gameStateAnalysis: GameStateAnalysis;
    chosenHeroCommands: ChosenHeroCommands;
}): number[] => {
    const otherAvailableHeroIDs = gameStateAnalysis.players[PlayerID.ME].heroIDs.filter((otherHeroID) => {
        return otherHeroID !== heroID && chosenHeroCommands[otherHeroID] === undefined;
    });

    return otherAvailableHeroIDs;
};

export const getClosestEntityID = ({
    sourceEntity,
    targetEntities,
}: {
    sourceEntity: MovingEntity & EntityBase;
    targetEntities: (MovingEntity & EntityBase)[];
}): number => {
    let [closestEntity] = targetEntities;
    let distancePow = vector2DDistancePow({ v1: sourceEntity.position, v2: closestEntity.position });
    targetEntities.forEach((targetEntity) => {
        const newDistancePow = vector2DDistancePow({ v1: sourceEntity.position, v2: targetEntity.position });
        if (newDistancePow < distancePow) {
            closestEntity = targetEntity;
            distancePow = newDistancePow;
        }
    });
    return closestEntity.id;
};

export const getClosestPosition = ({
    sourceEntity,
    positions,
}: {
    sourceEntity: MovingEntity & EntityBase;
    positions: Vector2D[];
}): Vector2D => {
    let [closestMapMarker] = positions;
    let distancePow = vector2DDistancePow({ v1: sourceEntity.position, v2: closestMapMarker });
    positions.forEach((mapMarker) => {
        const newDistancePow = vector2DDistancePow({ v1: sourceEntity.position, v2: mapMarker });
        if (newDistancePow < distancePow) {
            closestMapMarker = mapMarker;
            distancePow = newDistancePow;
        }
    });
    return closestMapMarker;
};
