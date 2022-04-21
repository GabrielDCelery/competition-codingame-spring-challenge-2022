import { Player } from './player';
import { Entity, EntityThreatFor } from './entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const readline: any;

const readNextLine = (): string => readline();

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const [baseX, baseY] = readNextLine()
    .split(' ')
    .map((input) => Number.parseInt(input));
const heroesPerPlayer = Number.parseInt(readline()); // Always 3

// game loop
while (true) {
    const player: Player = new Player();

    const [myHealth, myMana] = readNextLine()
        .split(' ')
        .map((input) => Number.parseInt(input));

    const [opponentHealth, opponentMana] = readNextLine()
        .split(' ')
        .map((input) => Number.parseInt(input));

    const entityCount = Number.parseInt(readline()); // Amount of heros and monsters you can see

    for (let index = 0; index < entityCount; index++) {
        const [id, type, x, y, shieldLife, isControlled, health, vx, vy, nearBase, threatFor] = readNextLine()
            .split(' ')
            .map((input) => Number.parseInt(input));

        const entity: Entity = new Entity({
            id, // Unique identifier
            type, // 0=monster, 1=your hero, 2=opponent hero
            x, // Position of this entity
            y, // Position of this entity
            shieldLife, // Ignore for this league; Count down until shield spell fades
            isControlled, // Ignore for this league; Equals 1 when this entity is under a control spell
            health, // Remaining health of this monster
            vx, // Trajectory of this monster
            vy, // Trajectory of this monster
            nearBase, // 0=monster with no target yet, 1=monster targeting a base
            threatFor, // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
        });

        player.addEntity({ entity });
    }

    const chosenMonster: { [index: number]: true } = {};

    const heroTargets: { [index: number]: number } = {};

    player.myHeroes.forEach((myHeroID) => {
        player.monsters.forEach((monsterID) => {
            const monster = player.entitiesMap[monsterID];
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

    const commands = player.myHeroes.map((myHeroID) => {
        const myHero = player.entitiesMap[myHeroID];
        if (heroTargets[myHeroID] === undefined) {
            return 'WAIT';
        }
        const monster = player.entitiesMap[heroTargets[myHeroID]];
        const taretVelocity = myHero.movingObject.MoveToTargetPositionVelocity({
            targetPos: monster.movingObject.position,
        });
        return `MOVE ${Math.round(taretVelocity.x)} ${Math.round(taretVelocity.y)}`;
    });

    commands.forEach((command) => {
        console.log(command);
    });
}
