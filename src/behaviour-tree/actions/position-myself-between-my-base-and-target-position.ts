import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import { Vector2D, vector2DAdd, vector2DMultiply, vector2DSubtract } from '../../common';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class PositionMyselfBetweenMyBaseAndTaretPosition extends LeafNode {
    readonly ratio: number;

    constructor({ ratio }: { ratio: number }) {
        super();
        this.ratio = ratio;
    }

    protected _execute({
        gameState,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        const targetPosition = localCache.get<Vector2D>({ key: LocalCacheKey.TARGET_POSITION });

        const vectorPointingFromBaseToTargetPosition = vector2DSubtract({
            v1: targetPosition,
            v2: gameState.players[PlayerID.ME].baseCoordinates,
        });

        const positionToGetTo = vector2DAdd({
            v1: gameState.players[PlayerID.ME].baseCoordinates,
            v2: vector2DMultiply({ v: vectorPointingFromBaseToTargetPosition, ratio: this.ratio }),
        });

        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.HERO_ROLE }) || HeroRole.WANDERER,
            type: CommandType.MOVE_TO_POSITION,
            source: gameState.entityMap[heroID],
            target: {
                id: -1,
                type: EntityType.POINT_ON_MAP,
                maxSpeed: 0,
                position: positionToGetTo,
                velocity: { x: 0, y: 0 },
            },
        };
        return true;
    }
}
