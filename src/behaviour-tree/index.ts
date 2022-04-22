import { BehaviourTree, SelectNode, SequenceNode } from './common';
import { AreThereMonstersThreateningMyBase, Wait, MeleeMonsterThreateningBaseIAmClosestTo } from './leaf-nodes';

const interceptBehaviour = new SequenceNode([
    new AreThereMonstersThreateningMyBase(),
    new MeleeMonsterThreateningBaseIAmClosestTo(),
]);

const behaviourTree = new BehaviourTree(new SelectNode([interceptBehaviour, new Wait()]));

export { behaviourTree };
