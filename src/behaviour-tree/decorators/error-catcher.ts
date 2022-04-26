import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { DecoratorNode, LocalCache } from '../bt-engine';

export class ErrorCatcherNode extends DecoratorNode {
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
        try {
            return this.node.execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands, localCache });
        } catch (error_) {
            const error = error_ as Error;
            console.error(`${this.node.constructor.name}`);
            throw error;
        }
    }
}
