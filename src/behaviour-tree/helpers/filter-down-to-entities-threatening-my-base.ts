import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { EntityThreatFor } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterDownToEntitiesThreateningMyBase extends LeafNode {
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
        const filteredTargetIDs = targetEntityIDs.filter((targetEntityID) => {
            return gameState.entityMap[targetEntityID].threatFor === EntityThreatFor.MY_BASE;
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: filteredTargetIDs });
        return true;
    }
}
