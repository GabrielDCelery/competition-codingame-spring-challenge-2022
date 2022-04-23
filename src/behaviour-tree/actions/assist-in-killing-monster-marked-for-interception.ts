import { ChosenHeroCommands, CommandType } from '../../commands';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../common';
import { getClosestEntityID } from '../filters';

export class AssistInKillingMonsterMarkedForInterception extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const monstersMarkedForInterception: number[] = [];
        Object.values(chosenHeroCommands).forEach((chosenHeroCommand) => {
            if (chosenHeroCommand.source.id === heroID) {
                return;
            }
            const tryingToInterceptMonster =
                chosenHeroCommand.type === CommandType.MELEE && chosenHeroCommand.target.type === EntityType.MONSTER;
            if (!tryingToInterceptMonster) {
                return;
            }
            monstersMarkedForInterception.push(chosenHeroCommand.target.id);
        });
        const closestMonsterMarkedForInterception = getClosestEntityID({
            sourceEntity: gameState.entityMap[heroID],
            targetEntities: monstersMarkedForInterception.map((monsterID) => {
                return gameState.entityMap[monsterID];
            }),
        });
        chosenHeroCommands[heroID] = {
            type: CommandType.MELEE,
            source: gameState.entityMap[heroID],
            target: gameState.entityMap[closestMonsterMarkedForInterception],
        };
        return true;
    }
}
