import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import { vector2DAdd, vector2DMultiply, vector2DNormalize, vector2DSubtract } from '../../common';
import { WIND_SPELL_POWER_RANGE } from '../../config';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class PushMonstersOutsideOfMyBase extends LeafNode {
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
        try {
            const pushTowardsLocation = vector2DAdd({
                v1: gameState.entityMap[heroID].position,
                v2: vector2DMultiply({
                    v: vector2DNormalize({
                        v: vector2DSubtract({
                            v1: gameState.entityMap[heroID].position,
                            v2: gameState.players[PlayerID.ME].baseCoordinates,
                        }),
                    }),
                    ratio: WIND_SPELL_POWER_RANGE,
                }),
            });

            chosenHeroCommands[heroID] = {
                role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.ROLE }) || HeroRole.GRUNT,
                type: CommandType.SPELL_WIND,
                source: gameState.entityMap[heroID],
                target: {
                    id: -1,
                    type: EntityType.POINT_ON_MAP,
                    maxSpeed: 0,
                    position: pushTowardsLocation,
                    velocity: { x: 0, y: 0 },
                },
            };
            return true;
        } catch (error_) {
            console.error(`PushMonstersOutsideOfMyBase`);
            throw new Error(`PushMonstersOutsideOfMyBase`);
        }
    }
}
