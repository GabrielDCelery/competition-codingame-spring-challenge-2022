import { ChosenHeroCommands, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../common';

export class FarmTargetMonster extends LeafNode {
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
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_MONSTER_ID });
        chosenHeroCommands[heroID] = {
            type: CommandType.FARM,
            source: gameState.entityMap[heroID],
            target: gameState.entityMap[targetMonsterID],
        };
        return true;
    }
}
