import { ChosenHeroCommands, CommandRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasReachedMaximumNumberOfInterceptors extends LeafNode {
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
            return chosenHeroCommand.role === CommandRole.INTERCEPTOR;
        }).length;
        return numOfInterceptors >= 1;
    }
}
