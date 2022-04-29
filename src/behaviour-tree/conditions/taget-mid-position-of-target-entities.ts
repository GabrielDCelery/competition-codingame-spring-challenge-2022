import { ChosenHeroCommands } from '../../commands';
import { Vector2D, vector2DAdd, vector2DAverage } from '../../common';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class TargetMidPositionOfTargetEntities extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetEntityIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });
        const position = vector2DAverage({
            vList: targetEntityIDs.map((targetEntityID) => {
                return vector2DAdd({
                    v1: gameState.entityMap[targetEntityID].position,
                    v2: gameState.entityMap[targetEntityID].velocity,
                });
            }),
        });
        localCache.set<Vector2D>({ key: LocalCacheKey.TARGET_POSITION, value: position });
        return true;
    }
}
