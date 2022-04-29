import { ChosenHeroCommands, CommandType } from '../../commands';
import { Vector2D, vectorToKey } from '../../common';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterOutAlreadyTargetedPositions extends LeafNode {
    protected _execute({
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetPositions = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS });

        const alreadyTargetedPositionsMap: { [index: string]: true } = {};

        Object.values(chosenHeroCommands).forEach((chosenHeroCommand) => {
            if (chosenHeroCommand.type !== CommandType.MOVE_TO_POSITION) {
                return;
            }
            alreadyTargetedPositionsMap[vectorToKey({ v: chosenHeroCommand.target.position })] = true;
        });

        const filteredTargetPositions = targetPositions.filter((targetPosition) => {
            return alreadyTargetedPositionsMap[vectorToKey({ v: targetPosition })] !== true;
        });

        localCache.set<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS, value: filteredTargetPositions });

        return true;
    }
}
