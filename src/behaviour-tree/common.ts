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
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        throw new Error(`Child needs to execute`);
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
    }): boolean {
        return this._execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands });
    }
}

export abstract class LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        throw new Error(`Child needs to execute`);
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
    }): boolean {
        return this._execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands });
    }
}

export class SequenceNode extends CompositeNode {
    _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        for (let i = 0, iMax = this.nodes.length; i < iMax; i++) {
            const result = this.nodes[i].execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands });
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
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        for (let i = 0, iMax = this.nodes.length; i < iMax; i++) {
            const result = this.nodes[i].execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands });
            if (result === true) {
                return true;
            }
        }
        return false;
    }
}

export class BehaviourTree {
    private rootNode: CompositeNode | LeafNode;

    constructor(rootNode: CompositeNode | LeafNode) {
        this.rootNode = rootNode;
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
        this.rootNode.execute({ heroID, gameState, gameStateAnalysis, chosenHeroCommands });
    }
}
