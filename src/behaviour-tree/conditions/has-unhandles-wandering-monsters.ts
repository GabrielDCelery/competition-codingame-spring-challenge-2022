import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { filterDownToUnhandledMonsterIDs } from '../filters';

export class HasUnhandledWanderingMonsters extends LeafNode {
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
        const monsterIDsToFilter = gameStateAnalysis.players[PlayerID.ME].monsterWanderingIDs;
        const unhandledMonsterIDs = filterDownToUnhandledMonsterIDs({
            monsterIDsToFilter,
            gameState,
            gameStateAnalysis,
            chosenHeroCommands,
        });
        const withinRange = unhandledMonsterIDs.filter((targetMonsterID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.players[PlayerID.ME].baseCoordinates,
                    v2: gameState.entityMap[targetMonsterID].position,
                }) <=
                7500 * 7500
            );
        });
        localCache.set<number[]>({ key: LocalCacheKey.UNHANDLED_FARMABLE_MONSTER_IDS, value: withinRange });
        return withinRange.length > 0;
    }
}
