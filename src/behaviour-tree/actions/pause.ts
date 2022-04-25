import { ChosenHeroCommands, CommandRole, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class Pause extends LeafNode {
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
        const { id, position, velocity, maxSpeed, type } = gameState.entityMap[heroID];
        chosenHeroCommands[heroID] = {
            role: localCache.getOptional<CommandRole>({ key: LocalCacheKey.ROLE }) || CommandRole.NO_ROLE,
            type: CommandType.PAUSE,
            source: { id, type, position, velocity, maxSpeed },
            target: { id, type, position, velocity, maxSpeed },
        };
        return true;
    }
}
