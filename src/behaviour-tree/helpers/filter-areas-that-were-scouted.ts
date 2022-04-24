import { ChosenHeroCommands } from '../../commands';
import { Vector2D, vector2DDistancePow, vectorToKey } from '../../common';
import { AREA_RADIUS } from '../../config';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { getClosestPosition } from '../filters';

export class FilterAreasWithNoKnownMonstersInThem extends LeafNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetAreas = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_AREAS });

        const areaMap: { [index: string]: { monsterCount: number; coordinates: Vector2D } } = {};

        targetAreas.forEach((targetArea) => {
            areaMap[vectorToKey({ v: targetArea })] = { monsterCount: 0, coordinates: targetArea };
        });

        const areaRadiusPow = AREA_RADIUS * AREA_RADIUS;

        gameStateAnalysis.monsterIDs.forEach((monsterID) => {
            const monster = gameState.entityMap[monsterID];
            const areasToCheck = targetAreas.filter((targetArea) => {
                const distancePow = vector2DDistancePow({
                    v1: monster.position,
                    v2: targetArea,
                });
                return distancePow <= areaRadiusPow;
            });
            if (areasToCheck.length === 0) {
                return;
            }
            const closestPosition = getClosestPosition({ sourceEntity: monster, positions: areasToCheck });
            areaMap[vectorToKey({ v: closestPosition })].monsterCount += 1;
        });
        /*
        const sortedAreas = Object.values(areaMap).sort((a, b) => {
            if (a.monsterCount < b.monsterCount) {
                return -1;
            }
            if (a.monsterCount > b.monsterCount) {
                return 1;
            }
            return 0;
        });

        */

        const positionsWithNoMonstersInThem = Object.values(areaMap)
            .filter((area) => {
                return area.monsterCount === 0;
            })
            .map((area) => area.coordinates);

        localCache.set<Vector2D[]>({
            key: LocalCacheKey.TARGET_AREAS,
            value: positionsWithNoMonstersInThem,
        });
        return true;
    }
}
