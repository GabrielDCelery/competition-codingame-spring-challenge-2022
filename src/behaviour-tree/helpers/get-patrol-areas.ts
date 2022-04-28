import { ChosenHeroCommands } from '../../commands';
import { Vector2D } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis, PositionType } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class GetPatrolAreas extends LeafNode {
    protected _execute({
        gameStateAnalysis,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        localCache.set<Vector2D[]>({
            key: LocalCacheKey.TARGET_POSITIONS,
            value: [
                ...gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[
                    PositionType.PATROL_AREA
                ],
                ...gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[
                    PositionType.PATROL_AREA_2
                ],
            ],
        });
        return true;
    }
}
