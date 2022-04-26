import { ChosenHeroCommands } from '../../commands';
import { isClosestPosition } from '../../conditions';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getMyOtherAvailableHeroIDs } from '../filters';

export class AmIClosestToTargetEnemyHero extends LeafNode {
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
        try {
            const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENEMY_HERO_ID });
            const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
            const amIClosest = isClosestPosition({
                sourcePosition: gameState.entityMap[heroID].position,
                targetPosition: gameState.entityMap[targetMonsterID].position,
                otherPositions: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID].position),
            });
            return amIClosest;
        } catch (error_) {
            console.error(`AmIClosestToTargetEnemyHero`);
            throw new Error(`AmIClosestToTargetEnemyHero`);
        }
    }
}
