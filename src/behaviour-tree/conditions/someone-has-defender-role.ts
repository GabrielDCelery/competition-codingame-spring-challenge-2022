import { ChosenHeroCommands, CommandRole } from '../../commands';
import { EntityControlled } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class HasEnoughDefenders extends LeafNode {
    protected _execute({
        chosenHeroCommands,
        gameState,
        gameStateAnalysis,
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
        const numOfDefenders = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.role === CommandRole.DEFENDER;
        });
        switch (availableHeroes.length) {
            case 3: {
                return numOfDefenders.length >= 2;
            }
            case 2: {
                return numOfDefenders.length >= 2;
            }
            case 1: {
                return numOfDefenders.length >= 1;
            }
            case 0: {
                return numOfDefenders.length >= 0;
            }
            default: {
                throw new Error('oops');
            }
        }
    }
}
