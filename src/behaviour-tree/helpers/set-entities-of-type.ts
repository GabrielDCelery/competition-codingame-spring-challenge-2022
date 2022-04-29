import { ChosenHeroCommands } from '../../commands';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class SetEntitiesOfType extends LeafNode {
    readonly entityType: EntityType;

    constructor({ entityType }: { entityType: EntityType }) {
        super();
        this.entityType = entityType;
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
        const entityIDs: number[] = [];
        Object.values(gameState.entityMap).forEach((entity) => {
            if (entity.type !== this.entityType) {
                return;
            }
            entityIDs.push(entity.id);
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: entityIDs });
        return true;
    }
}
