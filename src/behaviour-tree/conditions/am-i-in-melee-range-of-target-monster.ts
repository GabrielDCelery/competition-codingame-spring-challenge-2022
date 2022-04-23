import { ChosenHeroCommands } from '../../commands';
import { vector2DDistance } from '../../common';
import { HERO_MELEE_RANGE } from '../../config';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';

export class AmIInMeleeRangeOfTargetMonster extends LeafNode {
    protected _execute({
        heroID,
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
        const distance = vector2DDistance({
            v1: gameState.entityMap[heroID].position,
            v2: gameState.entityMap[targetMonsterID].position,
        });
        return distance <= HERO_MELEE_RANGE;
    }
}
