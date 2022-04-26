import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class InterceptTargetMonster extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.ROLE }) || HeroRole.GRUNT,
            type: CommandType.INTERCEPT,
            source: gameState.entityMap[heroID],
            target: gameState.entityMap[targetMonsterID],
        };
        return true;
    }
}
