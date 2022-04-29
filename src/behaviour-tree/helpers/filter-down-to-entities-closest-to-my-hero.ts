import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterDownToEntitiesClosestToMyHero extends LeafNode {
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
        const targetEntityIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });
        if (targetEntityIDs.length === 0) {
            return true;
        }
        const entityMapByDistance: { [index: number]: number[] } = {};
        targetEntityIDs.forEach((entityID) => {
            const distanceFromPositionPow = vector2DDistancePow({
                v1: gameState.entityMap[heroID].position,
                v2: gameState.entityMap[entityID].position,
            });
            if (entityMapByDistance[distanceFromPositionPow] === undefined) {
                entityMapByDistance[distanceFromPositionPow] = [];
            }
            entityMapByDistance[distanceFromPositionPow].push(entityID);
        });

        localCache.set<number[]>({
            key: LocalCacheKey.TARGET_ENTITY_IDS,
            value: entityMapByDistance[Math.min(...Object.keys(entityMapByDistance).map((v) => parseInt(v)))],
        });
        return true;
    }
}
