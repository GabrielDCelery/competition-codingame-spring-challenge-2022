import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { DecoratorNode, LocalCache } from '../common';

export class InverterNode extends DecoratorNode {
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
        const result = this.node.execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands, localCache });
        return !result;
    }
}
