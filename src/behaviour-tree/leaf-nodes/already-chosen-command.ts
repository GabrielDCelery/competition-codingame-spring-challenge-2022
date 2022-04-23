import { ChosenHeroCommands, CommandType } from '../../commands';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode } from '../common';

export class AlreadyChosenCommand extends LeafNode {
    protected _execute({
        heroID,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        return chosenHeroCommands[heroID] !== undefined && chosenHeroCommands[heroID].type !== CommandType.WAIT;
    }
}
