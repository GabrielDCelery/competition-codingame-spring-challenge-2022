import { ChosenHeroCommands } from '../../commands';
import { Vector2D } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis, PositionType } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';
import { filterDownToNonPatrolledPositions, filterDownToUnhandledMonsterIDs } from '../filters';

export class HasNonPatrolledAreas extends LeafNode {
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
        const positionsToFilter = [
            //  ...gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[PositionType.MY_BASE],
            ...gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[PositionType.MY_BASE_EDGE],
            ...gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[PositionType.OUTER_RIM],
            //    ...gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[PositionType.CENTER],
        ];
        const nonPatrolledAreas = filterDownToNonPatrolledPositions({
            heroID,
            positionsToFilter,
            gameState,
            gameStateAnalysis,
            chosenHeroCommands,
        });
        localCache.set<Vector2D[]>({ key: LocalCacheKey.NON_PATROLLED_POSITIONS, value: nonPatrolledAreas });
        return nonPatrolledAreas.length > 0;
    }
}
