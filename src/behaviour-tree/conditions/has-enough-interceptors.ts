import { ChosenHeroCommands, CommandRole } from '../../commands';
import { EntityControlled } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class HasEnoughInterceptors extends LeafNode {
    protected _execute({
        chosenHeroCommands,
        gameState,
        gameStateAnalysis,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetMonsterIDs = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENEMY_HERO_IDS });
        const numOfMonstersINeedToDealWith = targetMonsterIDs.length;
        const availableNumberOfDefenders = gameStateAnalysis.players[PlayerID.ME].heroIDs.filter((heroID) => {
            return gameState.entityMap[heroID].isControlled !== EntityControlled.IS_CONTROLLED;
        }).length;
        const numOfDefenders = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.role === CommandRole.INTERCEPTOR;
        }).length;

        const numOfDefendersNeeded = Math.min(availableNumberOfDefenders, numOfMonstersINeedToDealWith);
        return numOfDefenders >= numOfDefendersNeeded && numOfDefenders <= 1;
    }
}
