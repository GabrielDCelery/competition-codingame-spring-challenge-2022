import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class HasTargetEntitiesMoreOrEqualThan extends LeafNode {
    readonly count: number;

    constructor({ count }: { count: number }) {
        super();
        this.count = count;
    }

    protected _execute({
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS }).length >= this.count;
    }
}
