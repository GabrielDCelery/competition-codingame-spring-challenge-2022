import { ChosenHeroCommands, HeroRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasAllowedNumberOfHeroesOfType extends LeafNode {
    readonly role: HeroRole;
    readonly allowed: number;

    constructor({ role, allowed }: { role: HeroRole; allowed: number }) {
        super();
        this.role = role;
        this.allowed = allowed;
    }

    protected _execute({
        chosenHeroCommands,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const numOfHeroesAssumedRole = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return chosenHeroCommand.role === this.role;
        }).length;
        return this.allowed === numOfHeroesAssumedRole;
    }
}
