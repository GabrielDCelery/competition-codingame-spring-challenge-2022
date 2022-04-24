import { LeafNode, LocalCache } from '../bt-engine';

export class ClearLocalCache extends LeafNode {
    protected _execute({ localCache }: { localCache: LocalCache }): boolean {
        localCache.clearCache();
        return true;
    }
}
