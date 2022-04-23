import { ChosenHeroCommands } from '../../commands';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';
import { filterDownToUnhandledMonsterIDs } from '../filters';

export class HasUnhandledMonstersThreateningMyBase extends LeafNode {
    protected _execute({
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
        const monsterIDsToFilter = gameStateAnalysis.players[PlayerID.ME].monsterThreateningBaseByDistanceIDs;
        const unhandledMonsterIDs = filterDownToUnhandledMonsterIDs({ monsterIDsToFilter, chosenHeroCommands });
        localCache.set<number[]>({ key: LocalCacheKey.UNHANDLED_MONSTER_IDS, value: unhandledMonsterIDs });
        return unhandledMonsterIDs.length > 0;
    }
}
