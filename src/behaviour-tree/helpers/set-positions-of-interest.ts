import { ChosenHeroCommands } from '../../commands';
import { Vector2D } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis, PositionType } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class SetPositionsOfInterest extends LeafNode {
    readonly positionTypes: PositionType[];

    constructor({ positionTypes }: { positionTypes: PositionType[] }) {
        super();
        this.positionTypes = positionTypes;
    }

    protected _execute({
        gameStateAnalysis,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetPositions: Vector2D[] = [];

        this.positionTypes.forEach((positionType) => {
            gameStateAnalysis.players[PlayerID.ME].mapAreaCenterCoordinatesGroupedByType[positionType].forEach(
                (position) => {
                    targetPositions.push(position);
                }
            );
        });

        localCache.set<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS, value: targetPositions });
        return true;
    }
}
