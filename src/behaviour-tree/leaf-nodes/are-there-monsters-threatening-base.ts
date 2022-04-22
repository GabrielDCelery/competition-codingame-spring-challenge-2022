import { ChosenHeroCommands } from '../../commands';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode } from '../common';

export class AreThereMonstersThreateningMyBase extends LeafNode {
    protected _execute({
        gameStateAnalysis,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        return gameStateAnalysis.players[PlayerID.ME].monstersDirectlyThreateningBase.length > 0;
    }
}
