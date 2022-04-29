import { ChosenHeroCommands, HeroRole } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasExpectedMinimumNumberOfHeroesOfType extends LeafNode {
    readonly role: HeroRole;
    readonly minExpected: number;

    constructor({ role, minExpected }: { role: HeroRole; minExpected: number }) {
        super();
        this.role = role;
        this.minExpected = minExpected;
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
        return numOfHeroesAssumedRole >= this.minExpected;
    }
}
