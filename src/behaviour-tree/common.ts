import { ChosenHeroCommands } from '../commands';
import { GameState } from '../game-state';
import { GameStateAnalysis } from '../game-state-analysis';

export abstract class CompositeNode {
    protected nodes: (CompositeNode | LeafNode)[];

    constructor(nodes: (CompositeNode | LeafNode)[]) {
        this.nodes = nodes;
    }

    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        throw new Error(`Child needs to execute`);
    }

    execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return this._execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands, localCache });
    }
}

export abstract class LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        throw new Error(`Child needs to execute`);
    }

    execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return this._execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands, localCache });
    }
}

export class SequenceNode extends CompositeNode {
    _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        for (let i = 0, iMax = this.nodes.length; i < iMax; i++) {
            const result = this.nodes[i].execute({
                heroID,
                gameState,
                gameStateAnalysis,
                chosenHeroCommands,
                localCache,
            });
            if (result === false) {
                return false;
            }
        }
        return true;
    }
}

export class SelectNode extends CompositeNode {
    _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        for (let i = 0, iMax = this.nodes.length; i < iMax; i++) {
            const result = this.nodes[i].execute({
                heroID,
                gameState,
                gameStateAnalysis,
                chosenHeroCommands,
                localCache,
            });
            if (result === true) {
                return true;
            }
        }
        return false;
    }
}

export enum LocalCacheKey {
    UNHANDLED_MONSTER_IDS = 'UNHANDLED_MONSTER_IDS',
    EVALUATED_MONSTER_ID = 'EVALUATED_MONSTER_ID',
}

export class LocalCache {
    private cache: Record<string, unknown>;

    constructor() {
        this.cache = {};
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.clearCacheAtKey = this.clearCacheAtKey.bind(this);
        this.clearCache = this.clearCache.bind(this);
    }

    get<T>({ key }: { key: LocalCacheKey }): T | undefined {
        const value = this.cache[key];
        if (value === undefined) {
            return undefined;
        }
        return value as T;
    }

    set<T>({ key, value }: { key: LocalCacheKey; value: T }): void {
        this.cache[key] = value;
    }

    clearCacheAtKey({ key }: { key: LocalCacheKey }): void {
        delete this.cache[key];
    }

    clearCache(): void {
        this.cache = {};
    }
}

export class BehaviourTree {
    private rootNode: CompositeNode | LeafNode;
    private localCache: LocalCache;

    constructor(rootNode: CompositeNode | LeafNode) {
        this.rootNode = rootNode;
        this.localCache = new LocalCache();
    }

    execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }) {
        this.localCache.clearCache();
        this.rootNode.execute({
            heroID,
            gameState,
            gameStateAnalysis,
            chosenHeroCommands,
            localCache: this.localCache,
        });
    }
}
