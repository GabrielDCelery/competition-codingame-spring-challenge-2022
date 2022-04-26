import {
    FarmTargetMonster,
    InterceptTargetEnemyHero,
    InterceptTargetMonster,
    MoveToArea,
    Pause,
    PushMonstersOutsideOfMyBase,
    RedirectMonsterFromMyBase,
    SheildMyself,
    Wait,
} from './actions';
import { BehaviourTree, SelectNode, SequenceNode } from './bt-engine';
import {
    AmIClosestToTargetEnemyHero,
    AmIClosestToTargetMonster,
    AmIInMeleeRangeOfTargetMonster,
    AmIInWindSpellRangeOfTargetEnemyHero,
    CanIDestroyTargetMonsterBeforeItDamagesMyBase,
    CanIPushTargetEnemyHero,
    CanIPushTargetMonster,
    CanISeeEnemyHero,
    DoIHaveEnoughManaToCastSpells,
    DoIHaveShield,
    HasEnoughDefenders,
    HasEnoughInterceptors,
    HasEnoughManaInEmergencyPool,
    HasReachedMaximumNumberOfDefenders,
    HasReachedMaximumNumberOfInterceptors,
    //   HasNonPatrolledAreas,
    HaveIAlreadyChosenCommand,
    IsTargetMonsterWithinMyBase,
    // MarkClosestNonPatrolledAreaIfIAmTheClosest,
    TargetAreaClosestToMe,
    TargetEnemyHeroClosestToBase,
    TargetMonsterClosestToBase,
    TargetMonsterClosestToMe,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { AmIInControlSpellRangeOfTargetMonster } from './conditions/am-i-in-control-spell-range-of-target-monster';
import { AmIInWindSpellRangeOfTargetMonster } from './conditions/am-i-in-wind-spell-range-of-target-monster';
import { CanIControlTargetMonster } from './conditions/can-i-control-target-monster';
import { IsTargetMonsterNearMyBase } from './conditions/is-target-monster-near-my-base';
import { InverterNode } from './decorators';
import { ErrorCatcherNode } from './decorators/error-catcher';
import {
    ClearLocalCache,
    FilterAlreadyTargetedMonsters,
    FilterMonstersWithinFarmingRange,
    GetMonstersThreateningMyBase,
    GetPatrolAreas,
    GetWanderingMonsters,
    FilterToAreasWithNoMonsters,
    FilterAlreadyTargetedAreas,
    SetDefenderRole,
    FilterAreaThatIJustVisited,
    SetInterceptorRole,
} from './helpers';
import { FilterAlreadyTargetedHeroes } from './helpers/filter-already-targeted-heroes';
import { GetEnemyHeroesNearMyBase } from './helpers/get-enemy-heroes-near-my-base';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    new GetMonstersThreateningMyBase(),
    // new FilterMonstersWithinInterceptRange(),
    new FilterAlreadyTargetedMonsters(),
    new InverterNode(new HasEnoughDefenders()),
    new TargetMonsterClosestToBase(),
    new SetDefenderRole(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetMonster()), new Pause()]),
        new SequenceNode([
            new DoIHaveEnoughManaToCastSpells(),
            new IsTargetMonsterWithinMyBase(),
            new AmIInWindSpellRangeOfTargetMonster(),
            new CanIPushTargetMonster(),
            new PushMonstersOutsideOfMyBase(),
        ]),
        new SequenceNode([
            new DoIHaveEnoughManaToCastSpells(),
            new InverterNode(new IsTargetMonsterWithinMyBase()),
            new IsTargetMonsterNearMyBase(),
            new AmIInControlSpellRangeOfTargetMonster(),
            new CanIControlTargetMonster(),
            new RedirectMonsterFromMyBase(),
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

const shieldMyselfBehaviour = new SequenceNode([
    new CanISeeEnemyHero(),
    new InverterNode(new DoIHaveShield()),
    new HasEnoughManaInEmergencyPool(),
    // new DoIHaveEnoughManaToCastSpells(),
    new SheildMyself(),
]);

const interceptEnemyHeroBehaviour = new SequenceNode([
    new HasEnoughManaInEmergencyPool(),
    new GetEnemyHeroesNearMyBase(),
    new FilterAlreadyTargetedHeroes(),
    new InverterNode(new HasEnoughInterceptors()),
    new TargetEnemyHeroClosestToBase(),
    new SetInterceptorRole(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetEnemyHero()), new Pause()]),
        new SequenceNode([
            new DoIHaveEnoughManaToCastSpells(),
            new AmIInWindSpellRangeOfTargetEnemyHero(),
            new CanIPushTargetEnemyHero(),
            new PushMonstersOutsideOfMyBase(),
        ]),
        new InterceptTargetEnemyHero(),
    ]),
]);
const heroAI = new BehaviourTree(
    new SelectNode([
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), shieldMyselfBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), defendBaseFromMonstersBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), interceptEnemyHeroBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), farmBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), patrolBehaviourV2])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new Wait()])),
    ])
);

export { heroAI };
