import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class InterceptTargetEnemyHero extends LeafNode {
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
        const targetEnemyHeroID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.HERO_ROLE }) || HeroRole.WANDERER,
            type: CommandType.INTERCEPT,
            source: gameState.entityMap[heroID],
            target: gameState.entityMap[targetEnemyHeroID],
        };
        return true;
    }
}
