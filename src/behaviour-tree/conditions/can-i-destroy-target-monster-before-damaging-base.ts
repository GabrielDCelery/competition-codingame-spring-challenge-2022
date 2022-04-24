import { ChosenHeroCommands } from '../../commands';
import { HERO_MELEE_DAMAGE } from '../../config';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class CanIDestroyTargetMonsterBeforeItDamagesMyBase extends LeafNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_MONSTER_ID });
        const targetMonster = gameState.entityMap[targetMonsterID];
        const targetMonsterAnalysis = gameStateAnalysis.entityAnalysisMap[targetMonsterID];
        const turnsItTakesToDestroyMonster = Math.ceil(targetMonster.health / HERO_MELEE_DAMAGE);
        return targetMonsterAnalysis.turnsItTakesToDamageBase > turnsItTakesToDestroyMonster;
    }
}
