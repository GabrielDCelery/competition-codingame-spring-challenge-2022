import { ChosenHeroCommands } from '../../commands';
import { Vector2D } from '../../common';
import { isEntityClosestToTarget } from '../../conditions';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestPosition, getMyOtherAvailableHeroIDs } from '../filters';

export class MarkClosestNonPatrolledAreaIfIAmTheClosest extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const nonPatrolledPositions = localCache.get<Vector2D[]>({ key: LocalCacheKey.NON_PATROLLED_POSITIONS });
        const baseEntity = {
            id: -1,
            type: EntityType.POINT_ON_MAP,
            maxSpeed: 0,
            position: gameState.players[PlayerID.ME].baseCoordinates,
            velocity: { x: 0, y: 0 },
        };
        const closestToMyBaseNonPatrolledPosition = getClosestPosition({
            sourceEntity: baseEntity,
            positions: nonPatrolledPositions,
        });
        const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
        const amIClosest = isEntityClosestToTarget({
            sourceEntity: gameState.entityMap[heroID],
            targetEntity: {
                maxSpeed: 0,
                position: closestToMyBaseNonPatrolledPosition,
                velocity: { x: 0, y: 0 },
            },
            otherEntities: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID]),
        });
        if (!amIClosest) {
            return false;
        }
        localCache.set<Vector2D>({ key: LocalCacheKey.TARGET_POSITION, value: closestToMyBaseNonPatrolledPosition });
        return true;
    }
}
