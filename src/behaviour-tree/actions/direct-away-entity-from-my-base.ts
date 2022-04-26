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

export class DirectEntityAwayFromMyBase extends LeafNode {
    entitySpeed: number;
    entityType: EntityType;

    constructor({ entityType, entitySpeed }: { entityType: EntityType; entitySpeed: number }) {
        super();
        this.entitySpeed = entitySpeed;
        this.entityType = entityType;
    }

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
        const targetEntityID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });

        const expectedPosition = vector2DAdd({
            v1: gameState.entityMap[targetEntityID].position,
            v2: gameState.entityMap[targetEntityID].velocity,
        });

        const vectorPointingToEntity = vector2DSubtract({
            v1: expectedPosition,
            v2: gameState.players[PlayerID.ME].baseCoordinates,
        });

        const vectorPointingToEntityNorm = vector2DNormalize({ v: vectorPointingToEntity });

        const vectorPointingToMonsterNormScaled = vector2DMultiply({
            v: vectorPointingToEntityNorm,
            ratio: this.entitySpeed,
        });

        const redirectVelocity = vectorPointingToMonsterNormScaled;

        const redirectEntityTo = vector2DAdd({
            v1: expectedPosition,
            v2: redirectVelocity,
        });

        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.ROLE }) || HeroRole.GRUNT,
            type: CommandType.SPELL_CONTROL,
            source: gameState.entityMap[heroID],
            target: {
                id: targetEntityID,
                type: this.entityType,
                maxSpeed: this.entitySpeed,
                position: redirectEntityTo,
                velocity: redirectVelocity,
            },
        };
        return true;
    }
}
