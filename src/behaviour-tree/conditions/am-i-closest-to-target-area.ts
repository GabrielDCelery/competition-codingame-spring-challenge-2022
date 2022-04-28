import { ChosenHeroCommands } from '../../commands';
import { Vector2D } from '../../common';
import { isClosestPosition } from '../../conditions';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getMyOtherAvailableHeroIDs } from '../filters';

export class AmIClosestToTargetArea extends LeafNode {
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
        const targetArea = localCache.get<Vector2D>({ key: LocalCacheKey.TARGET_POSITION });
        const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
        const amIClosest = isClosestPosition({
            sourcePosition: gameState.entityMap[heroID].position,
            targetPosition: targetArea,
            otherPositions: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID].position),
        });
        return amIClosest;
    }
}
