import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { HERO_MELEE_DAMAGE, MONSTER_DAMAGING_BASE_DISTANCE } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class CanTargetEntityBeKilledBeforeReachingMyBase extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetEntityID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        const entityDistanceFromMyBasePow = Math.max(
            vector2DDistancePow({
                v1: gameState.entityMap[targetEntityID].position,
                v2: gameState.players[PlayerID.ME].baseCoordinates,
            }) - Math.pow(MONSTER_DAMAGING_BASE_DISTANCE, 2),
            0
        );
        console.error(Math.sqrt(entityDistanceFromMyBasePow));
        if (entityDistanceFromMyBasePow === 0) {
            return false;
        }
        const entitySpeedPow = Math.pow(gameState.entityMap[targetEntityID].maxSpeed, 2);
        const turnsItTakesToDamageMyBase = Math.floor(entityDistanceFromMyBasePow / entitySpeedPow);
        const turnsItTakesToKillEntity = Math.ceil(gameState.entityMap[targetEntityID].health / HERO_MELEE_DAMAGE);
        console.error(`${turnsItTakesToDamageMyBase} - ${turnsItTakesToKillEntity}`);
        return turnsItTakesToDamageMyBase > turnsItTakesToKillEntity;
    }
}
