import { ChosenHeroCommands } from '../commands';
import { GameState } from '../game-state';
import { GameStateAnalysis } from '../game-state-analysis';

type BehaviourTreeNode = CompositeNode | LeafNode | DecoratorNode;

export abstract class CompositeNode {
    protected nodes: BehaviourTreeNode[];

    constructor(nodes: BehaviourTreeNode[]) {
        this.nodes = nodes;
    }

    protected _execute({}: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        throw new Error(`Child needs to execute`);
    }

    execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return this._execute({ gameState, gameStateAnalysis, chosenHeroCommands, localCache });
    }
}

export abstract class DecoratorNode {
    protected node: BehaviourTreeNode;

    constructor(node: BehaviourTreeNode) {
        this.node = node;
    }

    protected _execute({}: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        throw new Error(`Child needs to execute`);
    }

    execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return this._execute({ gameState, gameStateAnalysis, chosenHeroCommands, localCache });
    }
}

export abstract class LeafNode {
    protected _execute({}: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        throw new Error(`Child needs to execute`);
    }

    execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return this._execute({ gameState, gameStateAnalysis, chosenHeroCommands, localCache });
    }
}

export class SequenceNode extends CompositeNode {
    _execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        for (let i = 0, iMax = this.nodes.length; i < iMax; i++) {
            const result = this.nodes[i].execute({
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
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        for (let i = 0, iMax = this.nodes.length; i < iMax; i++) {
            const result = this.nodes[i].execute({
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
    MY_HERO_EVALUATING_BT = 'MY_HERO_EVALUATING_BT',
    HERO_ROLE = 'HERO_ROLE',
    TARGET_ENTITY_IDS = 'TARGET_ENTITY_IDS',
    TARGET_ENTITY_ID = 'TARGET_ENTITY_ID',
    TARGET_POSITIONS = 'TARGET_POSITIONS',
    TARGET_POSITION = 'TARGET_POSITION',
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

    get<T>({ key }: { key: LocalCacheKey }): T {
        const value = this.cache[key];
        if (value === undefined) {
            throw new Error(`No value in local cache at ${key}`);
        }
        return value as T;
    }

    getOptional<T>({ key }: { key: LocalCacheKey }): T | undefined {
        const value = this.cache[key];
        if (value === undefined) {
            undefined;
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
    private rootNode: BehaviourTreeNode;
    private localCache: LocalCache;

    constructor(rootNode: BehaviourTreeNode) {
        this.rootNode = rootNode;
        this.localCache = new LocalCache();
    }

    execute({
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }) {
        this.localCache.clearCache();
        this.rootNode.execute({
            gameState,
            gameStateAnalysis,
            chosenHeroCommands,
            localCache: this.localCache,
        });
    }
}
