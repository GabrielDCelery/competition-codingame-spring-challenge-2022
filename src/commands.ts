import { heroAI } from './behaviour-tree';
import { EntityBase, MovingEntity } from './entity';
import { GameState, PlayerID } from './game-state';
import { GameStateAnalysis } from './game-state-analysis';

export enum CommandRole {
    NO_ROLE = 'NO_ROLE',
    DEFENDER = 'DEFENDER',
}

export enum CommandType {
    PAUSE = 'PAUSE',
    WAIT = 'WAIT',
    INTERCEPT = 'INTERCEPT',
    FARM = 'FARM',
    SPELL_WIND = 'SPELL_WIND',
    MOVE_TO_AREA = 'MOVE_TO_AREA',
}

export type Command = {
    role: CommandRole;
    type: CommandType;
    source: EntityBase & MovingEntity;
    target: EntityBase & MovingEntity;
};

export type ChosenHeroCommands = { [index: number]: Command };
/*
export const haveAllMyHeroesBeenAsignedCommands = ({
    chosenHeroCommands,
}: {
    chosenHeroCommands: ChosenHeroCommands;
}) => {
    const validCommands = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
        return chosenHeroCommand.type !== CommandType.PAUSE;
    });
    return validCommands.length === 3;
};

export const generateHeroCommands = ({
    gameState,
    gameStateAnalysis,
}: {
    gameState: GameState;
    gameStateAnalysis: GameStateAnalysis;
}): ChosenHeroCommands => {
    let keepRunningAI = true;
    const chosenHeroCommands: ChosenHeroCommands = {};
    while (keepRunningAI) {
        gameStateAnalysis.players[PlayerID.ME].heroIDs.forEach((heroID) => {
            return heroAI.execute({
                heroID,
                gameState,
                gameStateAnalysis,
                chosenHeroCommands,
            });
        });

        keepRunningAI = !haveAllMyHeroesBeenAsignedCommands({ chosenHeroCommands });
    }
    return chosenHeroCommands;
};
*/
