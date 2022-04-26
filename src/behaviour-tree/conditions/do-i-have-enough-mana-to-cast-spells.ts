import { ChosenHeroCommands, CommandType } from '../../commands';
import { HERO_MELEE_DAMAGE, SPELL_MANA_COST } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache, LocalCacheKey } from '../bt-engine';

export class DoIHaveEnoughManaToCastSpells extends LeafNode {
    protected _execute({
        heroID,
        gameState,
        gameStateAnalysis,
        chosenHeroCommands,
        localCache,
    }: {
        heroID: number;
        gameState: GameState;
        gameStateAnalysis: GameStateAnalysis;
        chosenHeroCommands: ChosenHeroCommands;
        localCache: LocalCache;
    }): boolean {
        const numOfCommandsAlreadyCastingSpell = Object.values(chosenHeroCommands).filter((chosenHeroCommand) => {
            return (
                chosenHeroCommand.type === CommandType.SPELL_WIND ||
                chosenHeroCommand.type === CommandType.SPELL_CONTROL ||
                chosenHeroCommand.type === CommandType.SPELL_SHIELD
            );
        }).length;
        const availableMana = gameState.players[PlayerID.ME].mana - numOfCommandsAlreadyCastingSpell * SPELL_MANA_COST;
        return availableMana >= SPELL_MANA_COST;
    }
}
