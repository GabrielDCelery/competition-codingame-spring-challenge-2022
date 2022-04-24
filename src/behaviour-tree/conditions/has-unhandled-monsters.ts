import { ChosenHeroCommands } from '../../commands';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { filterDownToUnhandledMonsterIDs } from '../filters';

export class HasUnhandledMonsters extends LeafNode {
    protected _execute({
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
        const monsterIDsToFilter = gameStateAnalysis.monsterIDs;
        const unhandledMonsterIDs = filterDownToUnhandledMonsterIDs({
            monsterIDsToFilter,
            gameState,
            gameStateAnalysis,
            chosenHeroCommands,
        });
        localCache.set<number[]>({ key: LocalCacheKey.UNHANDLED_MONSTER_IDS, value: unhandledMonsterIDs });
        return unhandledMonsterIDs.length > 0;
    }
}
