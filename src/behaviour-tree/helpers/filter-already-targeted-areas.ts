import { ChosenHeroCommands, CommandType } from '../../commands';
import { Vector2D, vectorToKey } from '../../common';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterAlreadyTargetedAreas extends LeafNode {
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
        const targetAreas = localCache.get<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS });

        const alreadyTargetedPositionsMap: { [index: string]: true } = {};

        Object.values(chosenHeroCommands)
            .filter((chosenHeroCommand) => {
                return chosenHeroCommand.type === CommandType.MOVE_TO_AREA;
            })
            .forEach((chosenHeroCommand) => {
                alreadyTargetedPositionsMap[vectorToKey({ v: chosenHeroCommand.target.position })] = true;
            });

        const filteredTargetAreas = targetAreas.filter((targetArea) => {
            return alreadyTargetedPositionsMap[vectorToKey({ v: targetArea })] !== true;
        });

        localCache.set<Vector2D[]>({ key: LocalCacheKey.TARGET_POSITIONS, value: filteredTargetAreas });

        return true;
    }
}
