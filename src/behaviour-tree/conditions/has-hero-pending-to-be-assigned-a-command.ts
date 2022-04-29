import { ChosenHeroCommands, CommandType } from '../../commands';
import { EntityControlled } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasHeroPendingToBeAssignedACommand extends LeafNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const availableHeroes = gameStateAnalysis.players[PlayerID.ME].heroIDs.filter((heroID) => {
            return gameState.entityMap[heroID].isControlled !== EntityControlled.IS_CONTROLLED;
        });
        const heroNotBeingAssignedCommandYet = availableHeroes.find((heroID) => {
            return chosenHeroCommands[heroID] === undefined || chosenHeroCommands[heroID].type === CommandType.PAUSE;
        });
        return Number.isInteger(heroNotBeingAssignedCommandYet);
    }
}
