import { ChosenHeroCommands } from '../../commands';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class GetMonstersThreateningMyBase extends LeafNode {
    protected _execute({
        gameStateAnalysis,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        localCache.set<number[]>({
            key: LocalCacheKey.TARGET_MONSTER_IDS,
            value: gameStateAnalysis.players[PlayerID.ME].monsterThreateningMyBaseByDistanceIDs,
        });
        return true;
    }
}
