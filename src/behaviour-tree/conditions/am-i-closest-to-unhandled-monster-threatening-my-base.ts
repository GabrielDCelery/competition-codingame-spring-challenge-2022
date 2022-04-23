import { ChosenHeroCommands } from '../../commands';
import { isEntityClosestToTarget } from '../../conditions';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';
import { filterDownToUnhandledMonsterIDs, getMyOtherAvailableHeroIDs } from '../filters';

export class AmIClosestToUnhandledMonsterThreateningMyBase extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const monsterIDsToFilter = gameStateAnalysis.players[PlayerID.ME].monsterThreateningBaseByDistanceIDs;
        const unhandledMonsterIDs =
            localCache.get<number[]>({ key: LocalCacheKey.UNHANDLED_MONSTER_IDS }) ||
            filterDownToUnhandledMonsterIDs({ monsterIDsToFilter, chosenHeroCommands });
        const [potentialTargetMonsterID] = unhandledMonsterIDs;
        const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
        const amIClosest = isEntityClosestToTarget({
            sourceEntity: gameState.entityMap[heroID],
            targetEntity: gameState.entityMap[potentialTargetMonsterID],
            otherEntities: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID]),
        });
        localCache.set<number>({ key: LocalCacheKey.EVALUATED_MONSTER_ID, value: potentialTargetMonsterID });
        return amIClosest;
    }
}
