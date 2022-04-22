import { vector2DAdd, vector2DDistance, vector2DMultiply, vector2DNormalize } from './common';
import { MONSTER_DETECTION_THRESHOLD, MONSTER_MAX_SPEED } from './config';
import { GameState, PlayerID } from './game-state';

export const getNumOfTurnsItTakesForMonsterToGetToPlayerBase = ({
    gameState,
    playerID,
    entityID,
}: {
    gameState: GameState;
    playerID: PlayerID;
    entityID: number;
}): number => {
    const monster = gameState.entityMap[entityID];
    const baseCoordinates = gameState.players[playerID].baseCoordinates;
    const monsterTickSpeed = 100;
    const velocity = vector2DMultiply({ v: vector2DNormalize({ v: monster.velocity }), ratio: monsterTickSpeed });
    let numOfTicks = 0;
    let monsterPosition = { x: monster.position.x, y: monster.position.y };
    let hasReachedBordersOfBase =
        vector2DDistance({ v1: baseCoordinates, v2: monsterPosition }) <= MONSTER_DETECTION_THRESHOLD;
    while (!hasReachedBordersOfBase) {
        monsterPosition = vector2DAdd({ v1: monsterPosition, v2: velocity });
        numOfTicks++;
        if (vector2DDistance({ v1: baseCoordinates, v2: monsterPosition }) <= MONSTER_DETECTION_THRESHOLD) {
            hasReachedBordersOfBase = true;
        }
    }
    return Math.floor(
        MONSTER_DETECTION_THRESHOLD / MONSTER_MAX_SPEED + (monsterTickSpeed * numOfTicks) / MONSTER_MAX_SPEED
    );
};
