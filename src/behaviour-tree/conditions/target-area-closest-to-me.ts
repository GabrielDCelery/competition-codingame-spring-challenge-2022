import { ChosenHeroCommands } from '../../commands';
import { Vector2D } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestPosition } from '../filters';

export class TargetAreaClosestToMe extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetAreas = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_AREAS });
        if (targetAreas.length === 0) {
            return false;
        }
        const closestArea = getClosestPosition({
            sourceEntity: gameState.entityMap[heroID],
            positions: targetAreas,
        });
        localCache.set<Vector2D>({ key: LocalCacheKey.TARGET_AREA, value: closestArea });
        return true;
    }
}