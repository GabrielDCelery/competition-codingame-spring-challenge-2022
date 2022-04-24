import { ChosenHeroCommands } from '../../commands';
import { isEntityClosestToTarget } from '../../conditions';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getMyOtherAvailableHeroIDs } from '../filters';

export class MarkClosestToUnhandledMonsterThreateningMyBaseIfIAmTheClosest extends LeafNode {
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
        const [potentialTargetMonsterID] = localCache.get<number[]>({
            key: LocalCacheKey.TARGET_MONSTER_IDS,
        });
        const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
        const amIClosest = isEntityClosestToTarget({
            sourceEntity: gameState.entityMap[heroID],
            targetEntity: gameState.entityMap[potentialTargetMonsterID],
            otherEntities: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID]),
        });
        if (!amIClosest) {
            return false;
        }
        localCache.set<number>({ key: LocalCacheKey.TARGET_MONSTER_ID, value: potentialTargetMonsterID });
        return true;
    }
}
