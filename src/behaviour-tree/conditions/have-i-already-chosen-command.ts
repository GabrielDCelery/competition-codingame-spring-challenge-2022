import { ChosenHeroCommands, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode } from '../common';

export class HaveIAlreadyChosenCommand extends LeafNode {
    protected _execute({
        heroID,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        return chosenHeroCommands[heroID] !== undefined && chosenHeroCommands[heroID].type !== CommandType.PAUSE;
    }
}
