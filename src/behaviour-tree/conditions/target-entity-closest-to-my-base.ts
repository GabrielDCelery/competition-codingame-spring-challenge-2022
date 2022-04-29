import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class TargetEntityClosestToMyBase extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetEntityIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });

        if (targetEntityIDs.length === 0) {
            return false;
        }

        const [closestToMyHero] = targetEntityIDs
            .map((entityID) => {
                return gameState.entityMap[entityID];
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

        localCache.set<number>({ key: LocalCacheKey.TARGET_ENTITY_ID, value: closestToMyHero.id });

        return true;
    }
}
