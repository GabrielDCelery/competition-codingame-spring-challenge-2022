import { ChosenHeroCommands, CommandType } from '../commands';
import { EntityType } from '../entity';
import { PlayerID } from '../game-state';
import { GameStateAnalysis } from '../game-state-analysis';

export const filterDownToUnhandledMonsterIDs = ({
    monsterIDsToFilter,
    chosenHeroCommands,
}: {
    monsterIDsToFilter: number[];
    chosenHeroCommands: ChosenHeroCommands;
}): number[] => {
    const monstersAlreadyBeingDealtWith: { [index: number]: true } = {};

    Object.values(chosenHeroCommands).forEach((chosenHeroCommand) => {
        if (chosenHeroCommand.type === CommandType.MELEE && chosenHeroCommand.target.type === EntityType.MONSTER) {
            monstersAlreadyBeingDealtWith[chosenHeroCommand.target.id] = true;
            return;
        }
    });

    const unhandledMonsterIDs = monsterIDsToFilter.filter((monsterID) => {
        return !monstersAlreadyBeingDealtWith[monsterID];
    });

    return unhandledMonsterIDs;
};

export const getMyOtherAvailableHeroIDs = ({
    heroID,
    gameStateAnalysis,
    chosenHeroCommands,
}: {
    heroID: number;
    gameStateAnalysis: GameStateAnalysis;
    chosenHeroCommands: ChosenHeroCommands;
}): number[] => {
    const otherAvailableHeroIDs = gameStateAnalysis.players[PlayerID.ME].heroIDs.filter((otherHeroID) => {
        return otherHeroID !== heroID && chosenHeroCommands[otherHeroID] === undefined;
    });

    return otherAvailableHeroIDs;
};
