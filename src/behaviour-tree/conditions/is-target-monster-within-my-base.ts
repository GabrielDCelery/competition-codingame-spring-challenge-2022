import { ChosenHeroCommands } from '../../commands';
import { vector2DAdd, vector2DDistancePow } from '../../common';
import { MONSTER_BASE_DETECTION_THRESHOLD } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class IsTargetMonsterWithinMyBase extends LeafNode {
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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        const expectedPosition = vector2DAdd({
            v1: gameState.entityMap[targetMonsterID].position,
            v2: gameState.entityMap[targetMonsterID].velocity,
        });
        const monsterDistanceFromBasePow = vector2DDistancePow({
            v1: gameState.players[PlayerID.ME].baseCoordinates,
            //   v2: gameState.entityMap[targetMonsterID].position,
            v2: expectedPosition,
        });
        return monsterDistanceFromBasePow <= Math.pow(MONSTER_BASE_DETECTION_THRESHOLD, 2);
    }
}
