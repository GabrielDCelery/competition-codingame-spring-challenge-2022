import { ChosenHeroCommands, CommandType } from '../../commands';
import { areVectorsWithinDistance } from '../../conditions';
import { WIND_SPELL_CAST_RANGE } from '../../config';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterAlreadyTargetedMonsters extends LeafNode {
    protected _execute({
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
        const monsterIDsToFilter = localCache.get<number[]>({ key: LocalCacheKey.TARGET_MONSTER_IDS });

        const monstersAlreadyBeingDealtWith: { [index: number]: true } = {};

        Object.values(chosenHeroCommands).forEach((chosenHeroCommand) => {
            if (
                [CommandType.INTERCEPT, CommandType.FARM].includes(chosenHeroCommand.type) &&
                chosenHeroCommand.target.type === EntityType.MONSTER
            ) {
                monstersAlreadyBeingDealtWith[chosenHeroCommand.target.id] = true;
                return;
            }

            if (chosenHeroCommand.type === CommandType.SPELL_WIND) {
                const hero = chosenHeroCommand.source;
                gameStateAnalysis.players[PlayerID.ME].monsterThreateningMyBaseByDistanceIDs.forEach((monsterID) => {
                    const monster = gameState.entityMap[monsterID];
                    if (
                        !areVectorsWithinDistance({
                            v1: hero.position,
                            v2: monster.position,
                            distance: WIND_SPELL_CAST_RANGE,
                        })
                    ) {
                        return;
                    }
                    monstersAlreadyBeingDealtWith[monster.id] = true;
                });
            }
        });

        const filteredMonsterIDs = monsterIDsToFilter.filter((monsterID) => {
            return !monstersAlreadyBeingDealtWith[monsterID];
        });

        localCache.set<number[]>({ key: LocalCacheKey.TARGET_MONSTER_IDS, value: filteredMonsterIDs });

        return true;
    }
}
