import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { FARMING_RANGE } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterEntitiesWithingRangeOfMyBase extends LeafNode {
    readonly range: number;

    constructor({ range }: { range: number }) {
        super();
        this.range = range;
    }

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
        const entityIDsToFilter = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });
        const filteredEntityIDs = entityIDsToFilter.filter((entityID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.players[PlayerID.ME].baseCoordinates,
                    v2: gameState.entityMap[entityID].position,
                }) <= Math.pow(this.range, 2)
            );
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: filteredEntityIDs });
        return true;
    }
}
