import {
    AssistInKillingMonsterMarkedForInterception,
    FarmTargetMonster,
    InterceptTargetMonster,
    MoveToArea,
    Pause,
    PushMonstersOutsideOfMyBase,
    Wait,
} from './actions';
import { BehaviourTree, SelectNode, SequenceNode } from './bt-engine';
import {
    AmIClosestToTargetMonster,
    AmIInMeleeRangeOfTargetMonster,
    CanIDestroyTargetMonsterBeforeItDamagesMyBase,
    DoIHaveEnoughManaToCastSpells,
    HasNonPatrolledAreas,
    HasUnhandledMonstersThreateningMyBase,
    HaveIAlreadyChosenCommand,
    HaveMonstersBeenMarkedForInterception,
    IsTargetMonsterWithinMyBase,
    MarkClosestNonPatrolledAreaIfIAmTheClosest,
    TargetMonsterClosestToBase,
    TargetMonsterClosestToMe,
} from './conditions';
import { InverterNode } from './decorators';
import {
    ClearLocalCache,
    FilterAlreadyTargetedMonsters,
    FilterMonstersWithinFarmingRange,
    GetMonstersThreateningMyBase,
    GetWanderingMonsters,
} from './helpers';

const defendBaseFromMonsterThreatsBehaviour = new SequenceNode([
    new GetMonstersThreateningMyBase(),
    new FilterAlreadyTargetedMonsters(),
    new TargetMonsterClosestToBase(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetMonster()), new Pause()]),
        new SequenceNode([
            new IsTargetMonsterWithinMyBase(),
            new AmIInMeleeRangeOfTargetMonster(),
            new SelectNode([
                new SequenceNode([new CanIDestroyTargetMonsterBeforeItDamagesMyBase(), new InterceptTargetMonster()]),
                new SequenceNode([new DoIHaveEnoughManaToCastSpells(), new PushMonstersOutsideOfMyBase()]),
                new InterceptTargetMonster(),
            ]),
        ]),
        new InterceptTargetMonster(),
    ]),
]);

const farmBehaviour = new SequenceNode([
    new GetWanderingMonsters(),
    new FilterMonstersWithinFarmingRange(),
    new FilterAlreadyTargetedMonsters(),
    new TargetMonsterClosestToMe(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetMonster()), new Pause()]),
        new SequenceNode([new FarmTargetMonster()]),
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

const heroAI = new BehaviourTree(
    new SelectNode([
        new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()]),
        new SequenceNode([new ClearLocalCache(), defendBaseFromMonsterThreatsBehaviour]),
        new SequenceNode([new ClearLocalCache(), farmBehaviour]),
        //   new SequenceNode([new ClearLocalCache(), assistMonsterKillBehaviour]),
        new SequenceNode([new ClearLocalCache(), patrolBehaviour]),
        new SequenceNode([new ClearLocalCache(), new Wait()]),
    ])
);

export { heroAI };
