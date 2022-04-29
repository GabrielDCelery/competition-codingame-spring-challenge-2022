import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class IsTargetEntityWithinDistanceOfEnemyHero extends LeafNode {
    readonly distance: number;

    constructor({ distance }: { distance: number }) {
        super();
        this.distance = distance;
    }

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
        const distanceThresholdPow = Math.pow(this.distance, 2);
        const opponentHeroWithinRange = Object.values(gameState.entityMap).find((entity) => {
            return (
                entity.type === EntityType.OPPONENT_HERO &&
                vector2DDistancePow({ v1: entity.position, v2: gameState.entityMap[targetEntityID].position }) <=
                    distanceThresholdPow
            );
        });
        return opponentHeroWithinRange !== undefined;
    }
}
