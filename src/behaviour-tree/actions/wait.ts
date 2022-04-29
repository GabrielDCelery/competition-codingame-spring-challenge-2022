import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class Wait extends LeafNode {
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
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        const { id, position, velocity, maxSpeed, type } = gameState.entityMap[heroID];
        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.HERO_ROLE }) || HeroRole.WANDERER,
            type: CommandType.WAIT,
            source: { id, type, position, velocity, maxSpeed },
            target: { id, type, position, velocity, maxSpeed },
        };
        return true;
    }
}
