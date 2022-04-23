import { BehaviourTree, SelectNode, SequenceNode } from './common';
import {
    AreThereMonstersThreateningMyBase,
    Wait,
    MeleeMonsterThreateningBaseIAmClosestTo,
    AlreadyChosenCommand,
} from './leaf-nodes';

const interceptBehaviour = new SequenceNode([
    new AreThereMonstersThreateningMyBase(),
    new MeleeMonsterThreateningBaseIAmClosestTo(),
]);

const behaviourTree = new BehaviourTree(new SelectNode([new AlreadyChosenCommand(), interceptBehaviour, new Wait()]));

export { behaviourTree };
