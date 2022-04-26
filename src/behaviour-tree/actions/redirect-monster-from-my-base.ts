import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import {
    vector2DAdd,
    vector2DClockwise,
    vector2DCounterClockwise,
    vector2DDot,
    vector2DMultiply,
    vector2DNormalize,
    vector2DSubtract,
} from '../../common';
import { MONSTER_MAX_SPEED } from '../../config';
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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });

        const expectedPosition = vector2DAdd({
            v1: gameState.entityMap[targetMonsterID].position,
            v2: gameState.entityMap[targetMonsterID].velocity,
        });

        const vectorPointingToMonster = vector2DSubtract({
            v1: expectedPosition,
            v2: gameState.players[PlayerID.ME].baseCoordinates,
        });

        const vectorPointingToMonsterNorm = vector2DNormalize({ v: vectorPointingToMonster });

        const vectorPointingToMonsterNormScaled = vector2DMultiply({
            v: vectorPointingToMonsterNorm,
            ratio: MONSTER_MAX_SPEED,
        });

        const redirectVelocity = (() => {
            if (
                gameState.players[PlayerID.ME].baseCoordinates.x === 0 &&
                gameState.players[PlayerID.ME].baseCoordinates.y === 0
            ) {
                return vector2DDot({ v1: { x: 1, y: 0 }, v2: vectorPointingToMonsterNormScaled }) >=
                    vector2DDot({ v1: { x: 1, y: 0 }, v2: { x: 1, y: 1 } })
                    ? vector2DClockwise({ v: vectorPointingToMonsterNormScaled })
                    : vector2DCounterClockwise({ v: vectorPointingToMonsterNormScaled });
            }

            return vector2DDot({ v1: { x: -1, y: 0 }, v2: vectorPointingToMonsterNormScaled }) >=
                vector2DDot({ v1: { x: -1, y: 0 }, v2: { x: -1, y: -1 } })
                ? vector2DClockwise({ v: vectorPointingToMonsterNormScaled })
                : vector2DCounterClockwise({ v: vectorPointingToMonsterNormScaled });
        })();

        const redirectMonsterTo = vector2DAdd({
            v1: expectedPosition,
            v2: redirectVelocity,
        });

        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.ROLE }) || HeroRole.GRUNT,
            type: CommandType.SPELL_CONTROL,
            source: gameState.entityMap[heroID],
            target: {
                id: targetMonsterID,
                type: EntityType.MONSTER,
                maxSpeed: MONSTER_MAX_SPEED,
                position: redirectMonsterTo,
                velocity: redirectVelocity,
            },
        };
        return true;
    }
}
