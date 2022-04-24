import { ChosenHeroCommands } from '../../commands';
import { isEntityClosestToTarget } from '../../conditions';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestEntityID, getMyOtherAvailableHeroIDs } from '../filters';

export class MarkClosestAvailableWanderingMonsterForFarmingIfIAmTheClosest extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        localCache,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const unhandledWanderingMonsterIDs = localCache.get<number[]>({
            key: LocalCacheKey.UNHANDLED_FARMABLE_MONSTER_IDS,
        });
        const closestFarmableMonsterID = getClosestEntityID({
            sourceEntity: gameState.entityMap[heroID],
            targetEntities: unhandledWanderingMonsterIDs.map((monsterID) => {
                return gameState.entityMap[monsterID];
            }),
        });
        const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
        const amIClosest = isEntityClosestToTarget({
            sourceEntity: gameState.entityMap[heroID],
            targetEntity: gameState.entityMap[closestFarmableMonsterID],
            otherEntities: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID]),
        });
        if (!amIClosest) {
            return false;
        }
        localCache.set<number>({ key: LocalCacheKey.TARGET_MONSTER_ID, value: closestFarmableMonsterID });
        return true;
    }
}
