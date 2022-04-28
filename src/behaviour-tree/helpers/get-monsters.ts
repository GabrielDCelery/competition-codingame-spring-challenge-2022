import { ChosenHeroCommands } from '../../commands';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class GetMonsters extends LeafNode {
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
        const monsterIDs: number[] = [];

        Object.values(gameState.entityMap).forEach((entity) => {
            if (entity.type !== EntityType.MONSTER) {
                return;
            }
            monsterIDs.push(entity.id);
        });
        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: monsterIDs });
        return true;
    }
}
