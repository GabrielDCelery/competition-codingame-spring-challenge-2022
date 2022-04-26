import { HeroRole } from '../commands';
import {
    CONTROL_SPELL_CAST_RANGE,
    HERO_MAX_SPEED,
    MAX_ALLOWED_NUM_OF_DEFENDERS,
    MAX_ALLOWED_NUM_OF_INTERCEPTORS,
    MONSTER_BASE_DETECTION_THRESHOLD,
    NEAR_BASE_THRESHOLD,
    WIND_SPELL_CAST_RANGE,
} from '../config';
import { EntityType } from '../entity';
import {
    DirectEntityAwayFromMyBase,
    FarmTargetMonster,
    InterceptTargetEnemyHero,
    InterceptTargetEntity,
    MoveToArea,
    Pause,
    PushTargetEntityAwayFromMyBase,
    RedirectTargetEntityFromMyBase,
    SheildMyself,
    Wait,
} from './actions';
import { BehaviourTree, SelectNode, SequenceNode } from './bt-engine';
import {
    IsTargetEntityWithinRangeOfHero,
    IsTargetEntityShielded,
    CanISeeEnemyHero,
    DoIHaveShield,
    HasEnoughHeroesAssumingRole,
    HasEnoughMana,
    HaveIAlreadyChosenCommand,
    IsTargetEntityExpectedToMoveIntoRangeOfMyBase,
    TargetAreaClosestToMe,
    TargetEntityClosestToMyBase,
    TargetEntityClosestToMyHero,
    AmIClosestToTargetEntity,
    IsTargetEntityControlled,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { IsTargetEntityWithinRangeOfMyBase } from './conditions/is-target-entity-within-range-of-my-base';
import { InverterNode } from './decorators';
import { ErrorCatcherNode } from './decorators/error-catcher';
import {
    ClearLocalCache,
    FilterMonstersWithinFarmingRange,
    GetMonstersThreateningMyBase,
    GetPatrolAreas,
    GetWanderingMonsters,
    FilterToAreasWithNoMonsters,
    FilterAlreadyTargetedAreas,
    FilterAreaThatIJustVisited,
    SetHeroRole,
} from './helpers';
import { FilterAlreadyTargetedEntities } from './helpers/filter-already-targeted-entities';
import { GetEnemyHeroesNearMyBase } from './helpers/get-enemy-heroes-near-my-base';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    new GetMonstersThreateningMyBase(),
    new FilterAlreadyTargetedEntities(),
    new InverterNode(
        new HasEnoughHeroesAssumingRole({ role: HeroRole.DEFENDER, maxAllowed: MAX_ALLOWED_NUM_OF_DEFENDERS })
    ),
    new TargetEntityClosestToMyBase(),
    new SetHeroRole({ role: HeroRole.DEFENDER }),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetEntity()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterNode(new IsTargetEntityShielded()),
            new IsTargetEntityExpectedToMoveIntoRangeOfMyBase({ range: MONSTER_BASE_DETECTION_THRESHOLD }),
            new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushTargetEntityAwayFromMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterNode(new IsTargetEntityShielded()),
            new InverterNode(new IsTargetEntityControlled()),
            new InverterNode(
                new IsTargetEntityExpectedToMoveIntoRangeOfMyBase({ range: MONSTER_BASE_DETECTION_THRESHOLD })
            ),
            new IsTargetEntityWithinRangeOfMyBase({ distance: NEAR_BASE_THRESHOLD }),
            new IsTargetEntityWithinRangeOfHero({ distance: CONTROL_SPELL_CAST_RANGE }),
            new RedirectTargetEntityFromMyBase(),
        ]),
        new InterceptTargetEntity(),
    ]),
]);

const farmBehaviour = new SequenceNode([
    new GetWanderingMonsters(),
    new FilterMonstersWithinFarmingRange(),
    new FilterAlreadyTargetedEntities(),
    new TargetEntityClosestToMyHero(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetEntity()), new Pause()]),
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
            new PushTargetEntityAwayFromMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterNode(new IsTargetEntityShielded()),
            new IsTargetEntityWithinRangeOfHero({ distance: CONTROL_SPELL_CAST_RANGE }),
            new InverterNode(new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE })),
            new DirectEntityAwayFromMyBase({ entityType: EntityType.OPPONENT_HERO, entitySpeed: HERO_MAX_SPEED }),
        ]),
        new InterceptTargetEnemyHero(),
    ]),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()])),
        //   new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), shieldMyselfBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), defendBaseFromMonstersBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), interceptEnemyHeroBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), farmBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), patrolBehaviourV2])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new Wait()])),
    ])
);

export { heroAI };
