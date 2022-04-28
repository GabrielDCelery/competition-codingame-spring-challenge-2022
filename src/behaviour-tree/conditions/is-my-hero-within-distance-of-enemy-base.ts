import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode } from '../bt-engine';

export class IsMyHeroWithinDistanceOfEnemyBase extends LeafNode {
    readonly distance: number;

    constructor({ distance }: { distance: number }) {
        super();
        this.distance = distance;
    }

    protected _execute({
        heroID,
        gameState,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        const distanceFromEnemyBasePow = vector2DDistancePow({
            v1: gameState.players[PlayerID.OPPONENT].baseCoordinates,
            v2: gameState.entityMap[heroID].position,
        });
        return distanceFromEnemyBasePow <= Math.pow(this.distance, 2);
    }
}
