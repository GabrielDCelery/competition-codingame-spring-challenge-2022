import { ChosenHeroCommands } from '../../commands';
import { Vector2D, vector2DDistancePow } from '../../common';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterDownToPositionsIKnowTheLeastAbout extends LeafNode {
    readonly radius: number;

    constructor({ radius }: { radius: number }) {
        super();
        this.radius = radius;
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
        const targetPositions = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS });
        if (targetPositions.length === 0) {
            return true;
        }
        const positionMapByKnownEtities: { [index: number]: Vector2D[] } = {};

        const rangeThresholdPow = Math.pow(this.radius, 2);

        targetPositions.forEach((targetPosition) => {
            let positionNumOfEntitiesWithin = 0;

            Object.values(gameState.entityMap).forEach((entity) => {
                if (entity.type !== EntityType.MONSTER) {
                    return;
                }
                const distanceFromPositionPow = vector2DDistancePow({
                    v1: targetPosition,
                    v2: entity.position,
                });
                if (distanceFromPositionPow > rangeThresholdPow) {
                    return;
                }
                positionNumOfEntitiesWithin += 1;
            });

            if (positionMapByKnownEtities[positionNumOfEntitiesWithin] === undefined) {
                positionMapByKnownEtities[positionNumOfEntitiesWithin] = [];
            }

            positionMapByKnownEtities[positionNumOfEntitiesWithin].push(targetPosition);
        });

        localCache.set<Vector2D[]>({
            key: LocalCacheKey.TARGET_POSITIONS,
            value: positionMapByKnownEtities[
                Math.min(...Object.keys(positionMapByKnownEtities).map((v) => parseInt(v)))
            ],
        });
        return true;
    }
}
