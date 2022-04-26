import { ChosenHeroCommands, CommandType } from '../../commands';
import { EntityControlled } from '../../entity';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class IsTargetEntityControlled extends LeafNode {
    protected _execute({
        gameState,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetEntityID = localCache.get<number>({ key: LocalCacheKey.TARGET_ENTITY_ID });
        return gameState.entityMap[targetEntityID].isControlled === EntityControlled.IS_CONTROLLED;
    }
}
