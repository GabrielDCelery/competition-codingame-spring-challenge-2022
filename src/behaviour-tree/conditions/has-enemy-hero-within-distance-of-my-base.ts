import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode } from '../bt-engine';

export class HasEnemyHeroWithinDistanceOfMyBase extends LeafNode {
    readonly distance: number;

    constructor({ distance }: { distance: number }) {
        super();
        this.distance = distance;
    }

    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
    }): boolean {
        const enemyHeroNearMyBase = gameStateAnalysis.players[PlayerID.OPPONENT].heroIDs.find((enemyHeroID) => {
            return (
                vector2DDistancePow({
                    v1: gameState.players[PlayerID.ME].baseCoordinates,
                    v2: gameState.entityMap[enemyHeroID].position,
                }) <= Math.pow(this.distance, 2)
            );
        });

        return Number.isInteger(enemyHeroNearMyBase);
    }
}
