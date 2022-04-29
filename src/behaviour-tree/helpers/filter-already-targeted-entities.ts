import { ChosenHeroCommands, CommandType } from '../../commands';
import { areVectorsWithinDistance } from '../../conditions';
import { WIND_SPELL_CAST_RANGE } from '../../config';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class FilterAlreadyTargetedEntities extends LeafNode {
    protected _execute({
        gameState,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const entityIDsToFilter = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS });

        const entitiesAlreadyBeingDealtWith: { [index: number]: true } = {};

        Object.values(chosenHeroCommands).forEach((chosenHeroCommand) => {
            if (
                [CommandType.INTERCEPT, CommandType.FARM, CommandType.SPELL_CONTROL, CommandType.SPELL_SHIELD].includes(
                    chosenHeroCommand.type
                )
            ) {
                entitiesAlreadyBeingDealtWith[chosenHeroCommand.target.id] = true;
                return;
            }

            if (chosenHeroCommand.type === CommandType.SPELL_WIND) {
                Object.values(gameState.entityMap).forEach((entity) => {
                    if (entity.type === EntityType.MY_HERO) {
                        return;
                    }
                    if (
                        !areVectorsWithinDistance({
                            v1: chosenHeroCommand.source.position,
                            v2: entity.position,
                            distance: WIND_SPELL_CAST_RANGE,
                        })
                    ) {
                        return;
                    }
                    entitiesAlreadyBeingDealtWith[entity.id] = true;
                });
            }

            if (chosenHeroCommand.type === CommandType.SPELL_CONTROL) {
                entitiesAlreadyBeingDealtWith[chosenHeroCommand.target.id] = true;
                return;
            }
        });

        const filteredEntityIDs = entityIDsToFilter.filter((entityID) => {
            return !entitiesAlreadyBeingDealtWith[entityID];
        });

        localCache.set<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS, value: filteredEntityIDs });

        return true;
    }
}
