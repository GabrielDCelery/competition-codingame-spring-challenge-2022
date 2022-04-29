import { ChosenHeroCommands } from '../../commands';
import { Vector2D, vector2DDot, vector2DSubtract } from '../../common';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestPosition } from '../filters';

export class FilterAreaThatIJustVisited extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        let targetAreas = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS });
        const closestToHeroFilterPosition = getClosestPosition({
            sourceEntity: gameState.entityMap[heroID],
            positions: targetAreas,
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
            targetAreas = targetAreas.filter((targetArea) => {
                const matching =
                    targetArea.x === closestToHeroFilterPosition.x && targetArea.y === closestToHeroFilterPosition.y;
                return !matching;
            });
        }
        localCache.set<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS, value: targetAreas });
        return true;
    }
}
