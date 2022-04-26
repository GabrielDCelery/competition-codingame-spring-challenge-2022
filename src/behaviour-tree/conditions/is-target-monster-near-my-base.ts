import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { NEAR_BASE_THRESHOLD } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class IsTargetMonsterNearMyBase extends LeafNode {
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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_MONSTER_ID });
        const monsterDistanceFromBasePow = vector2DDistancePow({
            v1: gameState.players[PlayerID.ME].baseCoordinates,
            v2: gameState.entityMap[targetMonsterID].position,
        });
        return monsterDistanceFromBasePow <= Math.pow(NEAR_BASE_THRESHOLD, 2);
    }
}
