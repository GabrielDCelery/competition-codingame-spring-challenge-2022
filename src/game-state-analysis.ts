import { EntityThreatFor, EntityType } from './entity';
import { GameState, PlayerID } from './game-state';

export type GameStateAnalysis = {
    players: {
        [PlayerID.ME]: {
            heroes: number[];
            monstersDirectlyThreateningBase: number[];
        };
        [PlayerID.OPPONENT]: {
            heroes: number[];
            monstersDirectlyThreateningBase: number[];
        };
    };
    monsters: number[];
};

export const createGameStateAnalysis = ({ gameState }: { gameState: GameState }): GameStateAnalysis => {
    const gameStateAnalysis: GameStateAnalysis = {
        players: {
            [PlayerID.ME]: {
                heroes: [],
                monstersDirectlyThreateningBase: [],
            },
            [PlayerID.OPPONENT]: {
                heroes: [],
                monstersDirectlyThreateningBase: [],
            },
        },
        monsters: [],
    };
    Object.values(gameState.entityMap).forEach((entity) => {
        const { id, type, threatFor } = entity;
        switch (type) {
            case EntityType.MY_HERO: {
                gameStateAnalysis.players[PlayerID.ME].heroes.push(id);
                return;
            }
            case EntityType.OPPONENT_HERO: {
                gameStateAnalysis.players[PlayerID.OPPONENT].heroes.push(id);
                return;
            }
            case EntityType.MONSTER: {
                gameStateAnalysis.monsters.push(id);
                if (threatFor === EntityThreatFor.MY_BASE) {
                    gameStateAnalysis.players[PlayerID.ME].monstersDirectlyThreateningBase.push(id);
                }
                if (threatFor === EntityThreatFor.OPPONENT_BASE) {
                    gameStateAnalysis.players[PlayerID.OPPONENT].monstersDirectlyThreateningBase.push(id);
                }
                return;
            }
            default: {
                throw new Error('oops');
            }
        }
    });
    return gameStateAnalysis;
};
