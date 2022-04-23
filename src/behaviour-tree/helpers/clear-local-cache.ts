import { LeafNode, LocalCache } from '../common';

export class ClearLocalCache extends LeafNode {
    protected _execute({ localCache }: { localCache: LocalCache }): boolean {
        localCache.clearCache();
        return true;
    }
}
