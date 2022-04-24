import {
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
    //   HasNonPatrolledAreas,
    HaveIAlreadyChosenCommand,
    IsTargetMonsterWithinMyBase,
    // MarkClosestNonPatrolledAreaIfIAmTheClosest,
    TargetAreaClosestToMe,
    TargetMonsterClosestToBase,
    TargetMonsterClosestToMe,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { InverterNode } from './decorators';
import {
    ClearLocalCache,
    FilterAlreadyTargetedMonsters,
    FilterMonstersWithinFarmingRange,
    GetMonstersThreateningMyBase,
    GetPatrolAreas,
    GetWanderingMonsters,
    FilterAreasWithNoKnownMonstersInThem,
    FilterAlreadyTargetedAreas,
} from './helpers';

const defendBaseFromMonstersBehaviour = new SequenceNode([
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

const patrolBehaviourV2 = new SequenceNode([
    new GetPatrolAreas(),
    new FilterAlreadyTargetedAreas(),
    new FilterAreasWithNoKnownMonstersInThem(),
    new TargetAreaClosestToMe(),
    new SelectNode([new SequenceNode([new InverterNode(new AmIClosestToTargetArea()), new Pause()]), new MoveToArea()]),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()]),
        new SequenceNode([new ClearLocalCache(), defendBaseFromMonstersBehaviour]),
        new SequenceNode([new ClearLocalCache(), farmBehaviour]),
        new SequenceNode([new ClearLocalCache(), patrolBehaviourV2]),
        new SequenceNode([new ClearLocalCache(), new Wait()]),
    ])
);

export { heroAI };
