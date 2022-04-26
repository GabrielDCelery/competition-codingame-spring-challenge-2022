import { expect } from 'chai';
import { describe, it } from 'mocha';

import { vector2DSubtract, vector2DDot } from '../src/common';

// import { generateHeroCommands } from '../src/commands';

describe('main', () => {
    it('does something', () => {
        // Given

        const start = new Date().getTime();
        /*
        const cosenHeroCommands = generateHeroCommands({
            gameState: {
                players: {
                    '0': {
                        baseHealth: 3,
                        mana: 202,
                        baseCoordinates: {
                            x: 17630,
                            y: 9000,
                        },
                    },
                    '1': {
                        baseHealth: 3,
                        mana: 96,
                        baseCoordinates: {
                            x: 0,
                            y: 0,
                        },
                    },
                },
                entityMap: {
                    '3': {
                        id: 3,
                        type: 1,
                        shieldLife: 0,
                        isControlled: 0,
                        health: -1,
                        nearBase: -1,
                        threatFor: -1,
                        position: {
                            x: 11575,
                            y: 3909,
                        },
                        velocity: {
                            x: -168,
                            y: -195,
                        },
                        maxSpeed: 800,
                    },
                    '4': {
                        id: 4,
                        type: 1,
                        shieldLife: 0,
                        isControlled: 0,
                        health: -1,
                        nearBase: -1,
                        threatFor: -1,
                        position: {
                            x: 9921,
                            y: 3518,
                        },
                        velocity: {
                            x: 264,
                            y: -324,
                        },
                        maxSpeed: 800,
                    },
                    '5': {
                        id: 5,
                        type: 1,
                        shieldLife: 0,
                        isControlled: 0,
                        health: -1,
                        nearBase: -1,
                        threatFor: -1,
                        position: {
                            x: 12454,
                            y: 4195,
                        },
                        velocity: {
                            x: -797,
                            y: -67,
                        },
                        maxSpeed: 800,
                    },
                    '38': {
                        id: 38,
                        type: 0,
                        shieldLife: 0,
                        isControlled: 0,
                        health: 10,
                        nearBase: 0,
                        threatFor: 1,
                        position: {
                            x: 11881,
                            y: 4166,
                        },
                        velocity: {
                            x: 306,
                            y: 257,
                        },
                        maxSpeed: 400,
                    },
                    '42': {
                        id: 42,
                        type: 0,
                        shieldLife: 0,
                        isControlled: 0,
                        health: 12,
                        nearBase: 0,
                        threatFor: 0,
                        position: {
                            x: 10267,
                            y: 3348,
                        },
                        velocity: {
                            x: 132,
                            y: 377,
                        },
                        maxSpeed: 400,
                    },
                    '44': {
                        id: 44,
                        type: 0,
                        shieldLife: 0,
                        isControlled: 0,
                        health: 14,
                        nearBase: 0,
                        threatFor: 0,
                        position: {
                            x: 9306,
                            y: 1852,
                        },
                        velocity: {
                            x: -319,
                            y: 241,
                        },
                        maxSpeed: 400,
                    },
                    '46': {
                        id: 46,
                        type: 0,
                        shieldLife: 0,
                        isControlled: 0,
                        health: 15,
                        nearBase: 0,
                        threatFor: 0,
                        position: {
                            x: 9481,
                            y: 1505,
                        },
                        velocity: {
                            x: 111,
                            y: 384,
                        },
                        maxSpeed: 400,
                    },
                },
            },
            gameStateAnalysis: {
                players: {
                    '0': {
                        heroIDs: [3, 4, 5],
                        monsterWanderingIDs: [42, 44, 46],
                        monsterThreateningMyBaseByDistanceIDs: [38],
                        mapAreaCenterCoordinatesGroupedByType: {
                            MY_BASE: [
                                {
                                    x: 15867,
                                    y: 7500,
                                },
                            ],
                            MY_BASE_EDGE: [
                                {
                                    x: 12341,
                                    y: 7500,
                                },
                                {
                                    x: 12341,
                                    y: 4500,
                                },
                                {
                                    x: 15867,
                                    y: 4500,
                                },
                            ],
                            CENTER: [
                                {
                                    x: 8815,
                                    y: 4500,
                                },
                            ],
                            OUTER_RIM: [
                                {
                                    x: 8815,
                                    y: 7500,
                                },
                                {
                                    x: 15867,
                                    y: 1500,
                                },
                            ],
                            PATROL_AREA: [
                                {
                                    x: 16230,
                                    y: 2000,
                                },
                                {
                                    x: 10630,
                                    y: 7600,
                                },
                                {
                                    x: 12630,
                                    y: 4000,
                                },
                            ],
                        },
                    },
                    '1': {
                        heroIDs: [],
                    },
                },
                monsterIDs: [38, 42, 44, 46],
                entityAnalysisMap: {
                    '3': {
                        turnsItTakesToDamageBase: Infinity,
                    },
                    '4': {
                        turnsItTakesToDamageBase: Infinity,
                    },
                    '5': {
                        turnsItTakesToDamageBase: Infinity,
                    },
                    '38': {
                        turnsItTakesToDamageBase: 19,
                    },
                    '42': {
                        turnsItTakesToDamageBase: Infinity,
                    },
                    '44': {
                        turnsItTakesToDamageBase: Infinity,
                    },
                    '46': {
                        turnsItTakesToDamageBase: Infinity,
                    },
                },
            },
        });
        console.log(JSON.stringify(cosenHeroCommands));
        const end = new Date().getTime();
        console.log(end - start);
                */

        const a = vector2DDot({
            v1: { x: -1, y: 0 },
            v2: { x: -1, y: -1 },
        });

        console.log(a);

        // When

        // Then
        expect(true).to.deep.equal(true);
    });
});
