import { ChosenHeroCommands } from '../../commands';
import { isEntityClosestToTarget } from '../../conditions';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../common';
import { filterDownToUnhandledMonsterIDs, getMyOtherAvailableHeroIDs } from '../filters';

export class ClearLocalCache extends LeafNode {
    protected _execute({ localCache }: { localCache: LocalCache }): boolean {
        localCache.clearCache();
        return true;
    }
}
