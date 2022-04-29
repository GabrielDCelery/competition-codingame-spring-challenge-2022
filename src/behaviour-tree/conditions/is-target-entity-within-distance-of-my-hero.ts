import { ChosenHeroCommands } from '../../commands';
import { vector2DDistance } from '../../common';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class IsTargetEntityWithinDistanceOfMyHero extends LeafNode {
    readonly distance: number;

    constructor({ distance }: { distance: number }) {
        super();
        this.distance = distance;
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
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        const distance = vector2DDistance({
            v1: gameState.entityMap[heroID].position,
            v2: gameState.entityMap[targetMonsterID].position,
        });
        return distance <= this.distance;
    }
}
