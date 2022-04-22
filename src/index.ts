import {
    createEmptyGameState,
    setBaseForPlayer,
    setManaForPlayer,
    addEntity,
    getMonstersIDs,
    GameState,
    PlayerID,
} from './game-state';
import { Entity, EntityThreatFor, EntityType } from './entity';
import { HERO_MAX_SPEED, MAP_HEIGHT, MAP_WIDTH, MONSTER_MAX_SPEED } from './config';
import { pursuitTargetEntityNextPosition } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const readline: any;

const readNextLine = (): string => readline();

const [baseX, baseY] = readNextLine()
    .split(' ')
    .map((input) => Number.parseInt(input));

const heroesPerPlayer = Number.parseInt(readline()); // Always 3

const gameState: GameState = createEmptyGameState();

// game loop
while (true) {
    const [myBaseHealth, myMana] = readNextLine()
        .split(' ')
        .map((input) => Number.parseInt(input));

    setBaseForPlayer({
        gameState,
        playerID: PlayerID.ME,
        baseHealth: myBaseHealth,
        baseCoordinates: { x: baseX, y: baseY },
    });

    setManaForPlayer({ gameState, playerID: PlayerID.ME, mana: myMana });

    const [opponentBaseHealth, opponentMana] = readNextLine()
        .split(' ')
        .map((input) => Number.parseInt(input));

    setBaseForPlayer({
        gameState,
        playerID: PlayerID.OPPONENT,
        baseHealth: opponentBaseHealth,
        baseCoordinates: { x: baseX === 0 ? MAP_WIDTH : 0, y: baseY === 0 ? MAP_HEIGHT : 0 },
    });

    setManaForPlayer({ gameState, playerID: PlayerID.OPPONENT, mana: opponentMana });

    const entityCount = Number.parseInt(readline()); // Amount of heros and monsters you can see

    gameState.players[PlayerID.ME].heroes = [];
    gameState.players[PlayerID.OPPONENT].heroes = [];

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
            maxSpeed: (() => {
                switch (type) {
                    case EntityType.MY_HERO: {
                        return HERO_MAX_SPEED;
                    }
                    case EntityType.MONSTER: {
                        return MONSTER_MAX_SPEED;
                    }
                    case EntityType.OPPONENT_HERO: {
                        return HERO_MAX_SPEED;
                    }
                    default: {
                        throw new Error(`Unhandled entity type: ${type}`);
                    }
                }
            })(),
        };

        addEntity({ gameState, entity });
    }

    const chosenMonster: { [index: number]: true } = {};

    const heroTargets: { [index: number]: number } = {};

    gameState.players[PlayerID.ME].heroes.forEach((myHeroID) => {
        getMonstersIDs({ gameState }).forEach((monsterID) => {
            const monster = gameState.entityHistoryMap[monsterID];
            if (
                monster.threatFor === EntityThreatFor.MY_BASE &&
                heroTargets[myHeroID] === undefined &&
                chosenMonster[monsterID] !== true
            ) {
                heroTargets[myHeroID] = monsterID;
                chosenMonster[monsterID] = true;
            }
        });
    });

    const commands = gameState.players[PlayerID.ME].heroes.map((myHeroID) => {
        const myHero = gameState.entityHistoryMap[myHeroID];
        if (heroTargets[myHeroID] === undefined) {
            return 'WAIT';
        }
        const monster = gameState.entityHistoryMap[heroTargets[myHeroID]];

        const taretVelocity = pursuitTargetEntityNextPosition({
            sourceEntity: myHero,
            targetEntity: monster,
        });

        return `MOVE ${Math.round(taretVelocity.x)} ${Math.round(taretVelocity.y)}`;
    });

    commands.forEach((command) => {
        console.log(command);
    });
}
