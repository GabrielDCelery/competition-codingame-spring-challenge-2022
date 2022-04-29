import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestEntityID } from '../filters';

export class TargetEntityClosestToMyHero extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        const targetMonsterIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });
        if (targetMonsterIDs.length === 0) {
            return false;
        }
        const closestFarmableMonsterID = getClosestEntityID({
            sourceEntity: gameState.entityMap[heroID],
            targetEntities: targetMonsterIDs.map((monsterID) => gameState.entityMap[monsterID]),
        });
        localCache.set<number>({ key: LocalCacheKey.TARGET_ENTITY_ID, value: closestFarmableMonsterID });
        return true;
    }
}
