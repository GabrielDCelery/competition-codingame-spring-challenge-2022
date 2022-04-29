import { ChosenHeroCommands, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasEnoughHeroesToCoverTargetEntities extends LeafNode {
    protected _execute({
        chosenHeroCommands,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const numOfAvailableHeroes = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.type !== CommandType.PAUSE;
        }).length;
        return numOfAvailableHeroes >= 1;
    }
}
