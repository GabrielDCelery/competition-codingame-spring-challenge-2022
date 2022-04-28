import { ChosenHeroCommands, HeroRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasReachedMaximumAllowedRolesOfType extends LeafNode {
    readonly role: HeroRole;
    readonly maxAllowed: number;

    constructor({ role, maxAllowed }: { role: HeroRole; maxAllowed: number }) {
        super();
        this.role = role;
        this.maxAllowed = maxAllowed;
    }

    protected _execute({
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const numOfHeroesAssumedRole = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.role === this.role;
        }).length;
        return numOfHeroesAssumedRole >= this.maxAllowed;
    }
}
