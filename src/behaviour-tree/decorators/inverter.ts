import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { DecoratorNode, LocalCache } from '../bt-engine';

export class InverterDecorator extends DecoratorNode {
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
        const result = this.node.execute({ gameState, gameStateAnalysis, chosenHeroCommands, localCache });
        return !result;
    }
}
