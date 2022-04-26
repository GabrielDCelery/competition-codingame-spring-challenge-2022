import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { HERO_VISION_RANGE } from '../../config';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class AmIInControlSpellRangeOfTargetMonster extends LeafNode {
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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        const distancePow = vector2DDistancePow({
            v1: gameState.entityMap[heroID].position,
            v2: gameState.entityMap[targetMonsterID].position,
        });
        return distancePow <= Math.pow(HERO_VISION_RANGE, 2);
    }
}
