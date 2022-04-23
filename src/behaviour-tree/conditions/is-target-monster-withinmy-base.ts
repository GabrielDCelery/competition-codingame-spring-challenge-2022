import { ChosenHeroCommands } from '../../commands';
import { vector2DDistance } from '../../common';
import { MONSTER_BASE_DETECTION_THRESHOLD } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';

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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_MONSTER_ID });
        const monsterDistanceFromBase = vector2DDistance({
            v1: gameState.players[PlayerID.ME].baseCoordinates,
            v2: gameState.entityMap[targetMonsterID].position,
        });
        return monsterDistanceFromBase <= MONSTER_BASE_DETECTION_THRESHOLD;
    }
}
