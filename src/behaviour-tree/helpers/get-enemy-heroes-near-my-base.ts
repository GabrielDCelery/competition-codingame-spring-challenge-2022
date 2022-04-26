import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { INTERCEPT_ENEMY_HERO_RANGE } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class GetEnemyHeroesNearMyBase extends LeafNode {
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
        const enemyHeroesNearMyBase = gameStateAnalysis.players[PlayerID.OPPONENT].heroIDs.filter((heroID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.entityMap[heroID].position,
                    v2: gameState.players[PlayerID.ME].baseCoordinates,
                }) <= Math.pow(INTERCEPT_ENEMY_HERO_RANGE, 2)
            );
        });

        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: enemyHeroesNearMyBase });
        return true;
    }
}
