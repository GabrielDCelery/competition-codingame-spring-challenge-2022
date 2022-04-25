import { ChosenHeroCommands } from '../../commands';
import { vector2DDistance } from '../../common';
import { HERO_MELEE_DAMAGE, MONSTER_MAX_SPEED } from '../../config';
import { GameState, PlayerID } from '../../game-state';
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
        const turnsItTakesToDestroyMonster = Math.ceil(targetMonster.health / HERO_MELEE_DAMAGE);
        const turnsItTakesToDamageBase = Math.floor(
            vector2DDistance({
                v1: gameState.entityMap[targetMonsterID].position,
                v2: gameState.players[PlayerID.ME].baseCoordinates,
            }) / MONSTER_MAX_SPEED
        );
        return turnsItTakesToDamageBase > turnsItTakesToDestroyMonster;
    }
}
