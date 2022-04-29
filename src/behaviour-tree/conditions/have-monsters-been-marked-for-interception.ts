import { ChosenHeroCommands, CommandType } from '../../commands';
import { EntityType } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class HaveMonstersBeenMarkedForInterception extends LeafNode {
    protected _execute({
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
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
