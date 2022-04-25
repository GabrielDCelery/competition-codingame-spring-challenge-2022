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
    CanIPushTargetMonster,
    DoIHaveEnoughManaToCastSpells,
    HasEnoughDefenders,
    //   HasNonPatrolledAreas,
    HaveIAlreadyChosenCommand,
    IsTargetMonsterWithinMyBase,
    // MarkClosestNonPatrolledAreaIfIAmTheClosest,
    TargetAreaClosestToMe,
    TargetMonsterClosestToBase,
    TargetMonsterClosestToMe,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { AmIInWindSpellRangeOfTargetMonster } from './conditions/am-i-in-wind-spell-range-of-target-monster';
import { InverterNode } from './decorators';
import {
    ClearLocalCache,
    FilterAlreadyTargetedMonsters,
    FilterMonstersWithinFarmingRange,
    GetMonstersThreateningMyBase,
    GetPatrolAreas,
    GetWanderingMonsters,
    FilterToAreasWithNoMonsters,
    FilterAlreadyTargetedAreas,
    FilterMonstersWithinInterceptRange,
    SetDefenderRole,
    FilterAreaThatIJustVisited,
} from './helpers';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    //  new InverterNode(new HasEnoughDefenders()),
    new GetMonstersThreateningMyBase(),
    // new FilterMonstersWithinInterceptRange(),
    new FilterAlreadyTargetedMonsters(),
    new TargetMonsterClosestToBase(),
    new SetDefenderRole(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetMonster()), new Pause()]),
        new SequenceNode([
            new IsTargetMonsterWithinMyBase(),
            new DoIHaveEnoughManaToCastSpells(),
            // new AmIInMeleeRangeOfTargetMonster(),
            new AmIInWindSpellRangeOfTargetMonster(),
            new CanIPushTargetMonster(),
            new PushMonstersOutsideOfMyBase(),
            /*

            new SelectNode([
                new SequenceNode([new CanIDestroyTargetMonsterBeforeItDamagesMyBase(), new InterceptTargetMonster()]),
                new SequenceNode([new DoIHaveEnoughManaToCastSpells(), new PushMonstersOutsideOfMyBase()]),
                new InterceptTargetMonster(),
            ]),
            */
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
        new FarmTargetMonster(),
    ]),
]);

const patrolBehaviourV2 = new SequenceNode([
    new GetPatrolAreas(),
    new FilterAlreadyTargetedAreas(),
    new FilterToAreasWithNoMonsters(),
    new FilterAreaThatIJustVisited(),
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
