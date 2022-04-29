import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { DecoratorNode, LocalCache } from '../bt-engine';

export class RepeaterDecorator extends DecoratorNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        let keepRunning = true;
        while (keepRunning) {
            const result = this.node.execute({ gameState, gameStateAnalysis, chosenHeroCommands, localCache });
            keepRunning = result;
        }
        return true;
    }
}
