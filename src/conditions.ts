import { ChosenHeroCommands, CommandType } from './commands';
import { Vector2D, vector2DDistance, vector2DDistancePow } from './common';
import { BASE_VISION_RANGE, MAP_HEIGHT, MAP_WIDTH, MONSTER_BASE_DETECTION_THRESHOLD } from './config';
import { Entity, EntityThreatFor, EntityType, MovingEntity } from './entity';
import { GameState, PlayerID } from './game-state';

export const isMonster = ({ entity }: { entity: Entity }): boolean => {
    return entity.type === EntityType.MONSTER;
};

export const isMonsterThreateningMyBase = ({ entity }: { entity: Entity }): boolean => {
    return entity.threatFor === EntityThreatFor.MY_BASE;
};

export const isEntitySeenByBase = ({ gameState, entity }: { gameState: GameState; entity: Entity }): boolean => {
    return (
        vector2DDistance({ v1: entity.position, v2: gameState.players[PlayerID.ME].baseCoordinates }) <=
            BASE_VISION_RANGE ||
        vector2DDistance({ v1: entity.position, v2: gameState.players[PlayerID.OPPONENT].baseCoordinates }) <=
            BASE_VISION_RANGE
    );
};

export const isEntityWithinMapBoundaries = ({ entity }: { entity: Entity }): boolean => {
    return (
        entity.position.x >= 0 &&
        entity.position.x <= MAP_WIDTH &&
        entity.position.y >= 0 &&
        entity.position.y <= MAP_HEIGHT
    );
};

export const isEntityClosestToTarget = ({
    sourceEntity,
    targetEntity,
    otherEntities,
}: {
    sourceEntity: MovingEntity;
    targetEntity: MovingEntity;
    otherEntities: MovingEntity[];
}): boolean => {
    const distancePow = vector2DDistancePow({ v1: sourceEntity.position, v2: targetEntity.position });
    for (let i = 0, iMax = otherEntities.length; i < iMax; i++) {
        const otherEntity = otherEntities[i];
        const otherDistancePow = vector2DDistancePow({ v1: otherEntity.position, v2: targetEntity.position });
        if (otherDistancePow < distancePow) {
            return false;
        }
    }
    return true;
};

export const areEntitiesWithinDistance = ({
    sourceEntity,
    targetEntity,
    distance,
}: {
    sourceEntity: MovingEntity;
    targetEntity: MovingEntity;
    distance: number;
}): boolean => {
    const distancePow = Math.pow(distance, 2);
    return vector2DDistancePow({ v1: sourceEntity.position, v2: targetEntity.position }) <= distancePow;
};

export const haveAllMyHeroesBeenAsignedCommands = ({
    chosenHeroCommands,
}: {
    chosenHeroCommands: ChosenHeroCommands;
}) => {
    const validCommands = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
        return chosenHeroCommand.type !== CommandType.PAUSE;
    });
    return validCommands.length === 3;
};

export const isPositionNearMapMarker = ({ position, mapMarker }: { position: Vector2D; mapMarker: Vector2D }) => {
    return vector2DDistancePow({ v1: position, v2: mapMarker }) <= 300 * 300;
};
