import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { INTERCEPT_RANGE } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterMonstersWithinInterceptRange extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const monsterIDsToFilter = localCache.get<number[]>({ key: LocalCacheKey.TARGET_MONSTER_IDS });
        const monsterIDsWithinRange = monsterIDsToFilter.filter((targetMonsterID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.players[PlayerID.ME].baseCoordinates,
                    v2: gameState.entityMap[targetMonsterID].position,
                }) <= Math.pow(INTERCEPT_RANGE, 2)
            );
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_MONSTER_IDS, value: monsterIDsWithinRange });
        return true;
    }
}
