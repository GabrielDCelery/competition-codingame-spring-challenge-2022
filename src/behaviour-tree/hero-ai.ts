import {
    AssistInKillingMonsterMarkedForInterception,
    FarmTargetMonster,
    InterceptTargetMonster,
    Pause,
    PushMonstersOutsideOfMyBase,
    Wait,
    MoveToArea,
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
    MarkClosestAvailableWanderingMonsterForFarmingIfIAmTheClosest,
    HasUnhandledWanderingMonsters,
    HasNonPatrolledAreas,
    MarkClosestNonPatrolledAreaIfIAmTheClosest,
} from './conditions';
import { InverterNode } from './decorators';
import { ClearLocalCache } from './helpers';

const defendBaseFromMonsterThreatsBehaviour = new SequenceNode([
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
                        new SequenceNode([new DoIHaveEnoughManaToCastSpells(), new PushMonstersOutsideOfMyBase()]),
                        new InterceptTargetMonster(),
                    ]),
                ]),
                new InterceptTargetMonster(),
            ]),
        ]),
        new Pause(),
    ]),
]);

const assistMonsterKillBehaviour = new SequenceNode([
    new InverterNode(new HasUnhandledMonstersThreateningMyBase()),
    new HaveMonstersBeenMarkedForInterception(),
    new AssistInKillingMonsterMarkedForInterception(),
]);

const patrolBehaviour = new SequenceNode([
    //   new InverterNode(new HasUnhandledMonsters()),
    new HasNonPatrolledAreas(),
    new SelectNode([
        new SequenceNode([new MarkClosestNonPatrolledAreaIfIAmTheClosest(), new MoveToArea()]),
        new Pause(),
    ]),
]);

const farmBehaviour = new SequenceNode([
    new HasUnhandledWanderingMonsters(),
    new SelectNode([
        new SequenceNode([
            new MarkClosestAvailableWanderingMonsterForFarmingIfIAmTheClosest(),
            new FarmTargetMonster(),
        ]),
        new Pause(),
    ]),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()]),
        new SequenceNode([new ClearLocalCache(), defendBaseFromMonsterThreatsBehaviour]),
        //   new SequenceNode([new ClearLocalCache(), assistMonsterKillBehaviour]),
        new SequenceNode([new ClearLocalCache(), farmBehaviour]),
        new SequenceNode([new ClearLocalCache(), patrolBehaviour]),
        new SequenceNode([new ClearLocalCache(), new Wait()]),
    ])
);

export { heroAI };
