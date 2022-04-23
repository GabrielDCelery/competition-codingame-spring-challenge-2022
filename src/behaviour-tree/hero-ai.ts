import { Wait, MeleeMonsterThreateningBaseIAmClosestTo, Pause } from './actions';
import { BehaviourTree, SelectNode, SequenceNode } from './common';
import {
    HaveIAlreadyChosenCommand,
    HasUnhandledMonstersThreateningMyBase,
    AmIClosestToUnhandledMonsterThreateningMyBase,
} from './conditions';
import { ClearLocalCache } from './helpers';

const interceptBehaviour = new SequenceNode([
    new HasUnhandledMonstersThreateningMyBase(),
    new SelectNode([
        new SequenceNode([
            new AmIClosestToUnhandledMonsterThreateningMyBase(),
            new MeleeMonsterThreateningBaseIAmClosestTo(),
        ]),
        new Pause(),
    ]),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()]),
        new SequenceNode([new ClearLocalCache(), interceptBehaviour]),
        new SequenceNode([new ClearLocalCache(), new Wait()]),
    ])
);

export { heroAI };
