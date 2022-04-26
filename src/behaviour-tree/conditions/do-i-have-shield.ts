import { ChosenHeroCommands } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class DoIHaveShield extends LeafNode {
    protected _execute({
        heroID,
        gameState,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        return gameState.entityMap[heroID].shieldLife > 0;
    }
}
