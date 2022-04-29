import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class PickFirstEntityOfAvailableEntities extends LeafNode {
    protected _execute({
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const [targetEntityID] = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });
        localCache.set<number>({ key: LocalCacheKey.TARGET_ENTITY_ID, value: targetEntityID });
        return true;
    }
}
