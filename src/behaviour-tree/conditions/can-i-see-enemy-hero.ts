import { ChosenHeroCommands } from '../../commands';
import { vector2DDistancePow } from '../../common';
import { HERO_VISION_RANGE } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class CanISeeEnemyHero extends LeafNode {
    protected _execute({
        gameState,
        gameStateAnalysis,
        localCache,
    }: {
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const heroID = localCache.get<number>({ key: LocalCacheKey.MY_HERO_EVALUATING_BT });
        for (let i = 0, iMax = gameStateAnalysis.players[PlayerID.OPPONENT].heroIDs.length; i < iMax; i++) {
            const enemyHeroID = gameStateAnalysis.players[PlayerID.OPPONENT].heroIDs[i];
            const canISee =
                vector2DDistancePow({
                    v1: gameState.entityMap[heroID].position,
                    v2: gameState.entityMap[enemyHeroID].position,
                }) <= Math.pow(HERO_VISION_RANGE, 2);
            if (canISee) {
                return true;
            }
        }
        return false;
    }
}
