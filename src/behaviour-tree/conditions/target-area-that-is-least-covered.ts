import { ChosenHeroCommands } from '../../commands';
import { Vector2D, vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class TargetPositionThatIsLeastCovered extends LeafNode {
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
        const targetPositions = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS });
        if (targetPositions.length === 0) {
            return false;
        }
        let chosenPosition = targetPositions[0];
        let chosenPositionDistanceAvgPow = 0;

        targetPositions.forEach((targetPosition) => {
            let totalDistancePow = 0;
            let numOfHeroes = 0;
            gameStateAnalysis.players[PlayerID.ME].heroIDs.forEach((heroID) => {
                totalDistancePow += vector2DDistancePow({
                    v1: targetPosition,
                    v2: gameState.entityMap[heroID].position,
                });
                numOfHeroes += 1;
            });
            const distanceFromHeroesAvgPow = totalDistancePow / numOfHeroes;
            if (distanceFromHeroesAvgPow < chosenPositionDistanceAvgPow) {
                return;
            }
            chosenPosition = targetPosition;
            chosenPositionDistanceAvgPow = distanceFromHeroesAvgPow;
        });
        localCache.set<Vector2D>({ key: LocalCacheKey.TARGET_POSITION, value: chosenPosition });
        return true;
    }
}
