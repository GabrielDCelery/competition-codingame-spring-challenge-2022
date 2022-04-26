import { ChosenHeroCommands, CommandRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class SetInterceptorRole extends LeafNode {
    protected _execute({
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        localCache.set<CommandRole>({ key: LocalCacheKey.ROLE, value: CommandRole.INTERCEPTOR });
        return true;
    }
}
