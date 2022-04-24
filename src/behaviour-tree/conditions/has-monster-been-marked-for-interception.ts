import { ChosenHeroCommands, CommandType } from '../../commands';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../common';

export class HaveMonstersBeenMarkedForInterception extends LeafNode {
    protected _execute({
        heroID,
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
            if (
                chosenHeroCommand.type === CommandType.INTERCEPT &&
                chosenHeroCommand.target.type === EntityType.MONSTER
            ) {
                monstersMarkedForInterception.push(chosenHeroCommand.target.id);
            }
        });
        return monstersMarkedForInterception.length > 0;
    }
}
