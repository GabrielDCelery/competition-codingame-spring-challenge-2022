import { ChosenHeroCommands, CommandType } from '../../commands';
import { EntityControlled } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class SelectNextHeroThatNeedsCommandBeingAssigned extends LeafNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        /*
        const availableHeroes = gameStateAnalysis.players[PlayerID.ME].heroIDs.filter((heroID) => {
            return gameState.entityMap[heroID].isControlled !== EntityControlled.IS_CONTROLLED;
        });
        */
        const availableHeroes = gameStateAnalysis.players[PlayerID.ME].heroIDs;

        const heroUnassigned = availableHeroes.find((heroID) => chosenHeroCommands[heroID] === undefined);
        if (heroUnassigned !== undefined) {
            localCache.set<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT, value: heroUnassigned });
            return true;
        }

        const heroPaused = availableHeroes.find((heroID) => {
            return chosenHeroCommands[heroID] !== undefined && chosenHeroCommands[heroID].type === CommandType.PAUSE;
        });
        if (heroPaused !== undefined) {
            localCache.set<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT, value: heroPaused });
            return true;
        }

        return false;
    }
}
