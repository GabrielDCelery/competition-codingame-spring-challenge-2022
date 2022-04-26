import { ChosenHeroCommands, CommandType } from '../../commands';
import { GameState } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class CanIControlTargetMonster extends LeafNode {
    protected _execute({
        gameState,
        localCache,
        chosenHeroCommands,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const targetMonsterID = localCache.get<number>({ key: LocalCacheKey.TARGET_MONSTER_ID });
        const hasNoShield = gameState.entityMap[targetMonsterID].shieldLife === 0;
        const notControllingMonster = !Object.values(chosenHeroCommands).find((chosenHeroCommand) => {
            return (
                chosenHeroCommand.type === CommandType.SPELL_CONTROL &&
                gameState.entityMap[targetMonsterID].position.x === chosenHeroCommand.target.position.x &&
                gameState.entityMap[targetMonsterID].position.y === chosenHeroCommand.target.position.y
            );
        });
        return hasNoShield && notControllingMonster;
    }
}
