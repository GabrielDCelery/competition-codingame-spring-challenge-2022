import { EntityBase, MovingEntity } from './entity';

export enum HeroRole {
    GUARD = 'GUARD',
    PATROL = 'PATROL',
    BASE_PROTECTOR = 'BASE_PROTECTOR',
    WANDERER = 'WANDERER',
    DEFENDER = 'DEFENDER',
    INTERCEPTOR = 'INTERCEPTOR',
    GATHERER = 'GATHERER',
    TAGGER = 'TAGGER',
}

export enum CommandType {
    PAUSE = 'PAUSE',
    WAIT = 'WAIT',
    INTERCEPT = 'INTERCEPT',
    FARM = 'FARM',
    SPELL_WIND = 'SPELL_WIND',
    MOVE_TO_POSITION = 'MOVE_TO_POSITION',
    SPELL_SHIELD = 'SPELL_SHIELD',
    SPELL_CONTROL = 'SPELL_CONTROL',
}

export type HeroCommand = {
    role: HeroRole;
    type: CommandType;
    source: EntityBase & MovingEntity;
    target: EntityBase & MovingEntity;
};

export type ChosenHeroCommands = { [index: number]: HeroCommand };
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
            return playerAI.execute({
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
