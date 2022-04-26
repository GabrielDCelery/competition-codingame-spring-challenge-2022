import { ChosenHeroCommands, HeroRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class SetDefenderRole extends LeafNode {
    protected _execute({
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        localCache.set<HeroRole>({ key: LocalCacheKey.ROLE, value: HeroRole.DEFENDER });
        return true;
    }
}
