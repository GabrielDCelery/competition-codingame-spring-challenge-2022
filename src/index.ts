import * as GS from './game-state';
import * as GSA from './game-state-analysis';
import { Entity, EntityThreatFor, getMaxSpeedOfEntity } from './entity';
import { MAP_HEIGHT, MAP_WIDTH } from './config';
import { pursuitTargetEntityNextPosition } from './common';
import { heroAI } from './behaviour-tree';
import { ChosenHeroCommands, CommandType } from './commands';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const readline: any;

const readNextLine = (): string => readline();

try {
    const [baseX, baseY] = readNextLine()
        .split(' ')
        .map((input) => Number.parseInt(input));

    const heroesPerPlayer = Number.parseInt(readline()); // Always 3

    let oldGameState: GS.GameState = GS.createEmptyGameState();

    // game loop
    while (true) {
        const newGameState: GS.GameState = GS.createEmptyGameState();

        const [myBaseHealth, myMana] = readNextLine()
            .split(' ')
            .map((input) => Number.parseInt(input));

        GS.setBaseForPlayer({
            gameState: newGameState,
            playerID: GS.PlayerID.ME,
            baseHealth: myBaseHealth,
            baseCoordinates: { x: baseX, y: baseY },
        });

        GS.setManaForPlayer({ gameState: newGameState, playerID: GS.PlayerID.ME, mana: myMana });

        const [opponentBaseHealth, opponentMana] = readNextLine()
            .split(' ')
            .map((input) => Number.parseInt(input));

        GS.setBaseForPlayer({
            gameState: newGameState,
            playerID: GS.PlayerID.OPPONENT,
            baseHealth: opponentBaseHealth,
            baseCoordinates: { x: baseX === 0 ? MAP_WIDTH : 0, y: baseY === 0 ? MAP_HEIGHT : 0 },
        });

        GS.setManaForPlayer({ gameState: newGameState, playerID: GS.PlayerID.OPPONENT, mana: opponentMana });

        const entityCount = Number.parseInt(readline()); // Amount of heros and monsters you can see

        for (let index = 0; index < entityCount; index++) {
            const [id, type, x, y, shieldLife, isControlled, health, vx, vy, nearBase, threatFor] = readNextLine()
                .split(' ')
                .map((input) => Number.parseInt(input));

            const entity: Entity = {
                id, // Unique identifier
                type, // 0=monster, 1=your hero, 2=opponent hero
                shieldLife, // Ignore for this league; Count down until shield spell fades
                isControlled, // Ignore for this league; Equals 1 when this entity is under a control spell
                health, // Remaining health of this monster
                nearBase, // 0=monster with no target yet, 1=monster targeting a base
                threatFor, // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
                position: { x, y }, // Position of this entity
                velocity: { x: vx, y: vy }, // Trajectory of this monster
                maxSpeed: getMaxSpeedOfEntity({ entityType: type }),
            };

            GS.addEntity({ gameState: newGameState, entity });
        }

        const compositeGameState = GS.createCompositeGameState({ oldGameState, newGameState });
        const gameStateAnalysis = GSA.createGameStateAnalysis({ gameState: compositeGameState });

        //  console.error(JSON.stringify(gameStateAnalysis));

        const chosenHeroCommands: ChosenHeroCommands = {};

        gameStateAnalysis.players[GS.PlayerID.ME].heroIDs.forEach((heroID) => {
            return heroAI.execute({
                heroID,
                gameState: compositeGameState,
                gameStateAnalysis,
                chosenHeroCommands,
            });
        });

        gameStateAnalysis.players[GS.PlayerID.ME].heroIDs.forEach((heroID) => {
            return heroAI.execute({
                heroID,
                gameState: compositeGameState,
                gameStateAnalysis,
                chosenHeroCommands,
            });
        });

        gameStateAnalysis.players[GS.PlayerID.ME].heroIDs.forEach((heroID) => {
            return heroAI.execute({
                heroID,
                gameState: compositeGameState,
                gameStateAnalysis,
                chosenHeroCommands,
            });
        });

        // console.error(JSON.stringify(chosenHeroCommands));

        const commands = Object.values(chosenHeroCommands).map((chosenCommand) => {
            switch (chosenCommand.type) {
                case CommandType.WAIT: {
                    return `WAIT`;
                }
                case CommandType.MELEE: {
                    const taretVelocity = pursuitTargetEntityNextPosition({
                        sourceEntity: chosenCommand.source,
                        targetEntity: chosenCommand.target,
                    });

                    return `MOVE ${Math.round(taretVelocity.x)} ${Math.round(taretVelocity.y)}`;
                }
                default: {
                    throw new Error('oops');
                }
            }
        });

        commands.forEach((command) => {
            console.log(command);
        });

        oldGameState = compositeGameState;
    }
} catch (error_) {
    const error = error_ as Error;
    console.error(error.message);
}
