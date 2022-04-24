import { ChosenHeroCommands, CommandType } from '../../commands';
import { Vector2D } from '../../common';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';

export class MoveToArea extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetPosition = localCache.get<Vector2D>({ key: LocalCacheKey.TARGET_POSITION });
        chosenHeroCommands[heroID] = {
            type: CommandType.MOVE_TO_AREA,
            source: gameState.entityMap[heroID],
            target: {
                id: -1,
                type: EntityType.POINT_ON_MAP,
                maxSpeed: 0,
                position: targetPosition,
                velocity: { x: 0, y: 0 },
            },
        };
        return true;
    }
}