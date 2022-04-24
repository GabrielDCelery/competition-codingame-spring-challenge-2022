import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class TargetMonsterClosestToBase extends LeafNode {
    protected _execute({
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const [targetMonsterID] = localCache.get<number[]>({ key: LocalCacheKey.TARGET_MONSTER_IDS });
        if (!targetMonsterID) {
            return false;
        }
        localCache.set<number>({ key: LocalCacheKey.TARGET_MONSTER_ID, value: targetMonsterID });
        return true;
    }
}
