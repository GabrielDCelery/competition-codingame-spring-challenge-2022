import { ChosenHeroCommands } from '../../commands';
import { Vector2D, vector2DDistancePow } from '../../common';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class TargetAreaThatIHaveLeastInformation extends LeafNode {
    readonly range: number;

    constructor({ range }: { range: number }) {
        super();
        this.range = range;
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
            return false;
        }
        let chosenPosition = targetPositions[0];
        let chosenPositionNumOfEntitiesWithin = Infinity;
        const rangeThresholdPow = Math.pow(this.range, 2);

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

            if (positionNumOfEntitiesWithin > chosenPositionNumOfEntitiesWithin) {
                return;
            }

            chosenPosition = targetPosition;
            chosenPositionNumOfEntitiesWithin = positionNumOfEntitiesWithin;
        });
        localCache.set<Vector2D>({ key: LocalCacheKey.TARGET_POSITION, value: chosenPosition });
        return true;
    }
}
