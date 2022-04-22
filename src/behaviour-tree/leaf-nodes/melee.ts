import { ChosenHeroCommands, CommandType } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { isEntityClosestToTarget } from '../../conditions';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode } from '../common';

export class MeleeMonsterThreateningBaseIAmClosestTo extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        const alreadyTargetedMonsterIDs = Object.values(chosenHeroCommands)
            .filter((chosenCommand) => {
                return chosenCommand.target.type === EntityType.MONSTER;
            })
            .map((chosenCommand) => {
                return chosenCommand.target.id;
            });

        const sortedPotentialTargets = gameStateAnalysis.players[PlayerID.ME].monstersDirectlyThreateningBase
            .filter((monsterID) => {
                return !alreadyTargetedMonsterIDs.includes(monsterID);
            })
            .map((potentialTargetID) => {
                return {
                    id: potentialTargetID,
                    distancePow: vector2DDistancePow({
                        v1: gameState.entityMap[heroID].position,
                        v2: gameState.entityMap[potentialTargetID].position,
                    }),
                };
            })
            .sort((a, b) => {
                if (a.distancePow < b.distancePow) {
                    return -1;
                }
                if (a.distancePow > b.distancePow) {
                    return 1;
                }
                return 0;
            });

        const otherAvailableHeroes = gameStateAnalysis.players[PlayerID.ME].heroes
            .filter((otherHeroID) => {
                return otherHeroID !== heroID && chosenHeroCommands[otherHeroID] === undefined;
            })
            .map((hID) => {
                return gameState.entityMap[hID];
            });

        for (let i = 0, iMax = sortedPotentialTargets.length; i < iMax; i++) {
            const targetEntity = gameState.entityMap[sortedPotentialTargets[i].id];
            if (
                isEntityClosestToTarget({
                    sourceEntity: gameState.entityMap[heroID],
                    targetEntity,
                    otherEntities: otherAvailableHeroes,
                })
            ) {
                chosenHeroCommands[heroID] = {
                    type: CommandType.MELEE,
                    source: gameState.entityMap[heroID],
                    target: targetEntity,
                };
                return true;
            }
        }

        return false;
    }
}
