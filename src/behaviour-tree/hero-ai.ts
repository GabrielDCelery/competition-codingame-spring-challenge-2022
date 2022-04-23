import {
    AssistInKillingMonsterMarkedForInterception,
    InterceptTargetMonster,
    Pause,
    PushtMonstersOutsideOfMyBase,
    Wait,
} from './actions';
import { BehaviourTree, SelectNode, SequenceNode } from './common';
import {
    MarkClosestToUnhandledMonsterThreateningMyBaseIfIAmTheClosest,
    HaveMonstersBeenMarkedForInterception,
    HasUnhandledMonstersThreateningMyBase,
    HaveIAlreadyChosenCommand,
    AmIInMeleeRangeOfTargetMonster,
    CanIDestroyTargetMonsterBeforeItDamagesMyBase,
    IsTargetMonsterWithinMyBase,
    DoIHaveEnoughManaToCastSpells,
} from './conditions';
import { InverterNode } from './decorators';
import { ClearLocalCache } from './helpers';

const interceptBehaviour = new SequenceNode([
    new HasUnhandledMonstersThreateningMyBase(),
    new SelectNode([
        new SequenceNode([
            new MarkClosestToUnhandledMonsterThreateningMyBaseIfIAmTheClosest(),
            new SelectNode([
                new SequenceNode([
                    new IsTargetMonsterWithinMyBase(),
                    new AmIInMeleeRangeOfTargetMonster(),
                    new SelectNode([
                        new SequenceNode([
                            new CanIDestroyTargetMonsterBeforeItDamagesMyBase(),
                            new InterceptTargetMonster(),
                        ]),
                        new SequenceNode([new DoIHaveEnoughManaToCastSpells(), new PushtMonstersOutsideOfMyBase()]),
                        new InterceptTargetMonster(),
                    ]),
                ]),
                new InterceptTargetMonster(),
            ]),
        ]),
        new Pause(),
    ]),
]);

const assistBehaviour = new SequenceNode([
    new InverterNode(new HasUnhandledMonstersThreateningMyBase()),
    new HaveMonstersBeenMarkedForInterception(),
    new AssistInKillingMonsterMarkedForInterception(),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()]),
        new SequenceNode([new ClearLocalCache(), interceptBehaviour]),
        new SequenceNode([new ClearLocalCache(), assistBehaviour]),
        new SequenceNode([new ClearLocalCache(), new Wait()]),
    ])
);

export { heroAI };
