import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class TargetEnemyHeroClosestToBase extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        try {
            const targetEnemyHeroIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENEMY_HERO_IDS });

            if (targetEnemyHeroIDs.length === 0) {
                return false;
            }

            const [closestToBaseEnemyHero] = targetEnemyHeroIDs
                .map((enemyHeroID) => {
                    return gameState.entityMap[enemyHeroID];
                })
                .sort((a, b) => {
                    const distanceA = vector2DDistancePow({
                        v1: a.position,
                        v2: gameState.players[PlayerID.ME].baseCoordinates,
                    });
                    const distanceB = vector2DDistancePow({
                        v1: b.position,
                        v2: gameState.players[PlayerID.ME].baseCoordinates,
                    });
                    if (distanceA < distanceB) {
                        return -1;
                    }
                    if (distanceA > distanceB) {
                        return 1;
                    }
                    return 0;
                });

            localCache.set<number>({ key: LocalCacheKey.TARGET_ENEMY_HERO_ID, value: closestToBaseEnemyHero.id });

            return true;
        } catch (error_) {
            console.error(`TargetEnemyHeroClosestToBase`);
            throw new Error(`TargetEnemyHeroClosestToBase`);
        }
    }
}
