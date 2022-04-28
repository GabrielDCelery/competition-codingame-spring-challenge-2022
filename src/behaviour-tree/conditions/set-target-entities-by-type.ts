import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class SetTargetEntitiesByType extends LeafNode {
    readonly entityType: EntityType;

    constructor({ entityType }: { entityType: EntityType }) {
        super();
        this.entityType = entityType;
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
        const targetEntityIDs: number[] = [];
        Object.values(gameState.entityMap).forEach((entity) => {
            if (entity.type !== this.entityType) {
                return;
            }
            targetEntityIDs.push(entity.id);
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: targetEntityIDs });
        return true;
    }
}
