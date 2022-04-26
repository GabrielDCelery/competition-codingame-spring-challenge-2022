import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class IsTargetEntityWithinRangeOfMyBase extends LeafNode {
    readonly distance: number;

    constructor({ distance }: { distance: number }) {
        super();
        this.distance = distance;
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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        const monsterDistanceFromBasePow = vector2DDistancePow({
            v1: gameState.players[PlayerID.ME].baseCoordinates,
            v2: gameState.entityMap[targetMonsterID].position,
        });
        return monsterDistanceFromBasePow <= Math.pow(this.distance, 2);
    }
}
