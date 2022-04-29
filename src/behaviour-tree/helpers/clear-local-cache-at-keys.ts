import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class ClearLocalCacheAtKeys extends LeafNode {
    readonly keys: LocalCacheKey[];

    constructor({ keys }: { keys: LocalCacheKey[] }) {
        super();
        this.keys = keys;
    }

    protected _execute({ localCache }: { localCache: LocalCache }): boolean {
        this.keys.forEach((key) => {
            return localCache.clearCacheAtKey({ key });
        });
        return true;
    }
}
