import { ChosenHeroCommands, CommandRole, CommandType } from '../../commands';
import { vector2DAdd, vector2DClockwise, vector2DMultiply, vector2DNormalize, vector2DSubtract } from '../../common';
import { MONSTER_MAX_SPEED, WIND_SPELL_POWER_RANGE } from '../../config';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class RedirectMonsterFromMyBase extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_MONSTER_ID });
        const vectorPointingToMonster = vector2DNormalize({
            v: vector2DSubtract({
                v1: gameState.entityMap[targetMonsterID].position,
                v2: gameState.players[PlayerID.ME].baseCoordinates,
            }),
        });

        console.error(targetMonsterID);

        console.error(vectorPointingToMonster);

        const redirectVelocity = vector2DClockwise({ v: vectorPointingToMonster });
        console.error(redirectVelocity);
        const scaledRedirectVelocity = vector2DMultiply({ v: redirectVelocity, ratio: MONSTER_MAX_SPEED });
        console.error(scaledRedirectVelocity);
        const redirectMonsterTo = vector2DAdd({
            v1: gameState.entityMap[targetMonsterID].position,
            v2: scaledRedirectVelocity,
        });
        console.error(gameState.entityMap[targetMonsterID].position);
        console.error(redirectMonsterTo);

        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<CommandRole>({ key: LocalCacheKey.ROLE }) || CommandRole.NO_ROLE,
            type: CommandType.SPELL_CONTROL,
            source: gameState.entityMap[heroID],
            target: {
                id: targetMonsterID,
                type: EntityType.MONSTER,
                maxSpeed: MONSTER_MAX_SPEED,
                position: redirectMonsterTo,
                velocity: scaledRedirectVelocity,
            },
        };
        return true;
    }
}
