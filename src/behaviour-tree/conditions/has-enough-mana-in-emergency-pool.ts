import { ChosenHeroCommands, CommandType } from '../../commands';
import { MANA_EMERGENCY_POOL, SPELL_MANA_COST } from '../../config';
import { GameState, PlayerID } from '../../game-state';
import { GameStateAnalysis } from '../../game-state-analysis';
import { LeafNode, LocalCache } from '../bt-engine';

export class HasEnoughManaInEmergencyPool extends LeafNode {
    protected _execute({
        gameState,

        chosenHeroCommands,
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
        return availableMana - MANA_EMERGENCY_POOL >= SPELL_MANA_COST;
    }
}
