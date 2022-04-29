import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class PickFirstPositionOfAvailablePositions extends LeafNode {
    protected _execute({
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const [targetPosition] = localCache.get<number[]>({ key: LocalCacheKey.TARGET_POSITIONS });
        localCache.set<number>({ key: LocalCacheKey.TARGET_POSITION, value: targetPosition });
        return true;
    }
}
