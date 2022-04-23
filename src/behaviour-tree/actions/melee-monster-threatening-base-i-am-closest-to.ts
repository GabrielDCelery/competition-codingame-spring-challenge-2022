import { ChosenHeroCommands, CommandType } from '../../commands';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';
import { filterDownToUnhandledMonsterIDs } from '../filters';

export class MeleeMonsterThreateningBaseIAmClosestTo extends LeafNode {
    protected _execute({
        heroID,
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
        const evaluatedMonsterID =
            localCache.get<number>({ key: LocalCacheKey.EVALUATED_MONSTER_ID }) ||
            (() => {
                const monsterIDsToFilter = gameStateAnalysis.players[PlayerID.ME].monsterThreateningBaseByDistanceIDs;
                const unhandledMonsterIDs =
                    localCache.get<number[]>({ key: LocalCacheKey.UNHANDLED_MONSTER_IDS }) ||
                    filterDownToUnhandledMonsterIDs({ monsterIDsToFilter, chosenHeroCommands });
                const [targetMonsterID] = unhandledMonsterIDs;
                return targetMonsterID;
            })();
        chosenHeroCommands[heroID] = {
            type: CommandType.MELEE,
            source: gameState.entityMap[heroID],
            target: gameState.entityMap[evaluatedMonsterID],
        };
        return true;
    }
}
