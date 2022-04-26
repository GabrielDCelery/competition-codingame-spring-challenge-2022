import { ChosenHeroCommands, HeroRole } from '../../commands';
import { EntityControlled } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class HasEnoughHeroesAssumingRole extends LeafNode {
    readonly role: HeroRole;
    readonly maxAllowed: number;

    constructor({ role, maxAllowed }: { role: HeroRole; maxAllowed: number }) {
        super();
        this.role = role;
        this.maxAllowed = maxAllowed;
    }

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
        const numOfEntitiesINeedToDealWith = localCache.get<number[]>({ key: LocalCacheKey.TARGET_ENTITY_IDS }).length;
        const availableNumberOfHeroes = gameStateAnalysis.players[PlayerID.ME].heroIDs.filter((heroID) => {
            return gameState.entityMap[heroID].isControlled !== EntityControlled.IS_CONTROLLED;
        }).length;
        const numOfHeroesAssumedRole = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.role === this.role;
        }).length;

        const numOfDefendersNeeded = Math.min(availableNumberOfHeroes, numOfEntitiesINeedToDealWith);
        return numOfHeroesAssumedRole >= numOfDefendersNeeded && numOfHeroesAssumedRole <= 1;
    }
}
