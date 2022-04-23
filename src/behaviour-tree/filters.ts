import { ChosenHeroCommands, CommandType } from '../commands';
import { vector2DDistancePow } from '../common';
import { EntityBase, EntityType, MovingEntity } from '../entity';
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

export const getClosestEntityID = ({
    sourceEntity,
    targetEntities,
}: {
    sourceEntity: MovingEntity & EntityBase;
    targetEntities: (MovingEntity & EntityBase)[];
}): number => {
    let closestEntity = sourceEntity;
    let distancePow = 0;
    targetEntities.forEach((targetEntity) => {
        const newDistancePow = vector2DDistancePow({ v1: sourceEntity.position, v2: targetEntity.position });
        if (newDistancePow < distancePow) {
            return;
        }
        closestEntity = targetEntity;
        distancePow = newDistancePow;
    });
    return closestEntity.id;
};
