import { ChosenHeroCommands } from '../../commands';
import { isClosestPosition } from '../../conditions';
import { MAP_HEIGHT, MAP_WIDTH } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getMyOtherAvailableHeroIDs } from '../filters';

export class AmIClosestToCenter extends LeafNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        const otherHeroIDs = getMyOtherAvailableHeroIDs({ heroID, gameStateAnalysis, chosenHeroCommands });
        const amIClosest = isClosestPosition({
            sourcePosition: gameState.entityMap[heroID].position,
            targetPosition: { x: MAP_WIDTH / 2, y: MAP_HEIGHT },
            otherPositions: otherHeroIDs.map((otherHeroID) => gameState.entityMap[otherHeroID].position),
        });
        return amIClosest;
    }
}
