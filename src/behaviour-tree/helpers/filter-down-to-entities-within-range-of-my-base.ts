import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterDownToEntitiesWithinDistanceOfMyBase extends LeafNode {
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
        const entityIDsToFilter = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });
        const filteredEntityIDs = entityIDsToFilter.filter((entityID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.players[PlayerID.ME].baseCoordinates,
                    v2: gameState.entityMap[entityID].position,
                }) <= Math.pow(this.distance, 2)
            );
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: filteredEntityIDs });
        return true;
    }
}
