import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class GetMonstersWithinDistanceOfMyBase extends LeafNode {
    readonly distance: number;

    constructor({ distance }: { distance: number }) {
        super();
        this.distance = distance;
    }

    protected _execute({
        gameState,
        gameStateAnalysis,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const enemyHeroes = gameStateAnalysis.monsterIDs.filter((monsterID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.entityMap[monsterID].position,
                    v2: gameState.players[PlayerID.ME].baseCoordinates,
                }) <= Math.pow(this.distance, 2)
            );
        });

        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: enemyHeroes });
        return true;
    }
}
