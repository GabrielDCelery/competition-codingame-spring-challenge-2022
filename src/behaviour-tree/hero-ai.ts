import { HeroRole } from '../commands';
import { HERO_MAX_SPEED, HERO_VISION_RANGE, MAX_ALLOWED_NUM_OF_INTERCEPTORS, WIND_SPELL_CAST_RANGE } from '../config';
import { EntityType } from '../entity';
import {
    DirectEntityAwayFromMyBase,
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
    AmIClosestToTargetMonster,
    IsTargetEntityWithinRangeOfHero,
    IsTargetEntityShielded,
    CanIPushTargetMonster,
    CanISeeEnemyHero,
    DoIHaveShield,
    HasEnoughDefenders,
    HasEnoughHeroesAssumingRole,
    HasEnoughMana,
    HaveIAlreadyChosenCommand,
    IsTargetMonsterWithinMyBase,
    TargetAreaClosestToMe,
    TargetEntityClosestToMyBase,
    TargetMonsterClosestToBase,
    TargetMonsterClosestToMe,
    AmIClosestToTargetEntity,
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
    SetHeroRole,
} from './helpers';
import { FilterAlreadyTargetedEntities } from './helpers/filter-already-targeted-entities';
import { GetEnemyHeroesNearMyBase } from './helpers/get-enemy-heroes-near-my-base';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    new GetMonstersThreateningMyBase(),
    new FilterAlreadyTargetedMonsters(),
    new InverterNode(new HasEnoughDefenders()),
    new TargetMonsterClosestToBase(),
    new SetDefenderRole(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetMonster()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new IsTargetMonsterWithinMyBase(),
            new AmIInWindSpellRangeOfTargetMonster(),
            new CanIPushTargetMonster(),
            new PushMonstersOutsideOfMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
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
    new HasEnoughMana({ reserve: 50 }),
    new SheildMyself(),
]);

const interceptEnemyHeroBehaviour = new SequenceNode([
    new HasEnoughMana({ reserve: 50 }),
    new GetEnemyHeroesNearMyBase(),
    new FilterAlreadyTargetedEntities(),
    new InverterNode(
        new HasEnoughHeroesAssumingRole({ role: HeroRole.INTERCEPTOR, maxAllowed: MAX_ALLOWED_NUM_OF_INTERCEPTORS })
    ),
    new TargetEntityClosestToMyBase(),
    new SetHeroRole({ role: HeroRole.INTERCEPTOR }),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetEntity()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterNode(new IsTargetEntityShielded()),
            new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushMonstersOutsideOfMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterNode(new IsTargetEntityShielded()),
            new IsTargetEntityWithinRangeOfHero({ distance: HERO_VISION_RANGE }),
            new InverterNode(new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE })),
            new DirectEntityAwayFromMyBase({ entityType: EntityType.OPPONENT_HERO, entitySpeed: HERO_MAX_SPEED }),
        ]),
        new InterceptTargetEnemyHero(),
    ]),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()])),
        //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), shieldMyselfBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), defendBaseFromMonstersBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), interceptEnemyHeroBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), farmBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), patrolBehaviourV2])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new Wait()])),
    ])
);

export { heroAI };
