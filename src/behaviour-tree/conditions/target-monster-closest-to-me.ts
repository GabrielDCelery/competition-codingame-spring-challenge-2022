import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestEntityID } from '../filters';

export class TargetMonsterClosestToMe extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetMonsterIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_MONSTER_IDS });
        if (targetMonsterIDs.length === 0) {
            return false;
        }
        const closestFarmableMonsterID = getClosestEntityID({
            sourceEntity: gameState.entityMap[heroID],
            targetEntities: targetMonsterIDs.map((monsterID) => gameState.entityMap[monsterID]),
        });
        localCache.set<number>({ key: LocalCacheKey.TARGET_MONSTER_ID, value: closestFarmableMonsterID });
        return true;
    }
}
