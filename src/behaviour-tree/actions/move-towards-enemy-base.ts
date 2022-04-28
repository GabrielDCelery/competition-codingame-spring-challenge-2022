import { ChosenHeroCommands, HeroRole, CommandType } from '../../commands';
import { EntityType } from '../../entity';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class MoveTowardsEnemyBase extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<HeroRole>({ key: LocalCacheKey.HERO_ROLE }) || HeroRole.GRUNT,
            type: CommandType.MOVE_TO_POSITION,
            source: gameState.entityMap[heroID],
            target: {
                id: -1,
                type: EntityType.POINT_ON_MAP,
                maxSpeed: 0,
                position: gameState.players[PlayerID.OPPONENT].baseCoordinates,
                velocity: { x: 0, y: 0 },
            },
        };
        return true;
    }
}
