import { ChosenHeroCommands, CommandRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasReachedMaximumNumberOfDefenders extends LeafNode {
    protected _execute({
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const numOfInterceptors = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.role === CommandRole.DEFENDER;
        }).length;
        return numOfInterceptors >= 2;
    }
}
