import { HeroRole } from '../commands';
import {
    AREA_RADIUS,
    BASE_VISION_RANGE,
    CONTROL_SPELL_CAST_RANGE,
    FARMING_RANGE,
    HERO_MAX_SPEED,
    INTERCEPT_MONSTER_RANGE,
    MAX_ALLOWED_NUM_OF_DEFENDERS,
    MAX_ALLOWED_NUM_OF_INTERCEPTORS,
    MONSTER_BASE_DETECTION_THRESHOLD,
    NEAR_BASE_THRESHOLD,
    WIND_SPELL_CAST_RANGE,
} from '../config';
import { EntityType } from '../entity';
import { PositionType } from '../game-state-analysis';
import {
    DirectEntityAwayFromMyBase,
    InterceptTargetEnemyHero,
    InterceptTargetEntity,
    MoveToArea,
    MoveTowardsEnemyBase,
    MoveTowardsMyBase,
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
    // HasEnoughHeroesAssumingRole,
    HasEnoughMana,
    HaveIAlreadyChosenCommand,
    IsTargetEntityExpectedToMoveIntoRangeOfMyBase,
    // TargetAreaClosestToMe,
    TargetEntityClosestToMyBase,
    TargetEntityClosestToMyHero,
    AmIClosestToTargetEntity,
    IsTargetEntityControlled,
    HasAllowedMaximumNumberOfHeroesOfType,
    TargetPositionThatIsLeastCovered,
    TargetAreaThatIHaveLeastInformation,
    HasExpectedMinimumNumberOfHeroesOfType,
    IsMyHeroWithinDistanceOfEnemyBase,
    AmIClosestToEnemyBase,
    AmIClosestToCenter,
    HasAllowedNumberOfHeroesOfType,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { HasEnemyHeroWithinDistanceOfMyBase } from './conditions/has-enemy-hero-within-distance-of-my-base';
import { IsTargetEntityWithinRangeOfMyBase } from './conditions/is-target-entity-within-range-of-my-base';
import { InverterNode } from './decorators';
import { ErrorCatcherNode } from './decorators/error-catcher';
import {
    ClearLocalCache,
    FilterEntitiesWithingRangeOfMyBase,
    GetMonstersThreateningMyBase,
    SetPositionsOfInterest,
    GetWanderingMonsters,
    //  FilterToAreasWithNoMonsters,
    FilterOutAlreadyTargetedAreas,
    FilterAreaThatIJustVisited,
    SetHeroRole,
} from './helpers';
import { FilterAlreadyTargetedEntities } from './helpers/filter-already-targeted-entities';
import { GetEnemyHeroesNearMyBase } from './helpers/get-enemy-heroes-near-my-base';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.DEFENDER, minExpected: 0 }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.DEFENDER, maxAllowed: 2 }),
    new SetHeroRole({ role: HeroRole.DEFENDER }),
    new GetMonstersThreateningMyBase(),
    new FilterEntitiesWithingRangeOfMyBase({ range: INTERCEPT_MONSTER_RANGE }),
    new FilterAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
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
            new InverterNode(new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 })),
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
    new FilterEntitiesWithingRangeOfMyBase({ range: FARMING_RANGE }),
    new FilterAlreadyTargetedEntities(),
    //new TargetEntityClosestToMyBase(),
    new TargetEntityClosestToMyHero(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetEntity()), new Pause()]),
        new InterceptTargetEntity(),
    ]),
]);

const patrolBehaviour = new SequenceNode([
    new SetPositionsOfInterest({ positionTypes: [PositionType.INNER_PATROL_AREA, PositionType.OUTER_PATROL_AREA] }),
    new FilterOutAlreadyTargetedAreas(),
    new TargetAreaThatIHaveLeastInformation({ range: AREA_RADIUS }),
    // new TargetPositionThatIsLeastCovered(),
    new SelectNode([new SequenceNode([new InverterNode(new AmIClosestToTargetArea()), new Pause()]), new MoveToArea()]),
]);
/*
const patrolBehaviourV2 = new SequenceNode([
    new SetPositionsOfInterest(),
    new FilterOutAlreadyTargetedAreas(),
    new FilterToAreasWithNoMonsters(),
    new FilterAreaThatIJustVisited(),
    new TargetAreaClosestToMe(),
    new SelectNode([new SequenceNode([new InverterNode(new AmIClosestToTargetArea()), new Pause()]), new MoveToArea()]),
]);
*/
const shieldMyselfBehaviour = new SequenceNode([
    new CanISeeEnemyHero(),
    new InverterNode(new DoIHaveShield()),
    new HasEnoughMana({ reserve: 50 }),
    new SheildMyself(),
]);

const interceptEnemyHeroBehaviour = new SequenceNode([
    new InverterNode(
        new HasAllowedMaximumNumberOfHeroesOfType({
            role: HeroRole.INTERCEPTOR,
            maxAllowed: MAX_ALLOWED_NUM_OF_INTERCEPTORS,
        })
    ),
    new SetHeroRole({ role: HeroRole.INTERCEPTOR }),
    new HasEnoughMana({ reserve: 50 }),
    new GetEnemyHeroesNearMyBase(),
    new FilterAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
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

const gathererBehaviour = new SequenceNode([
    new InverterNode(new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.GATHERER, minExpected: 1 })),
    new InverterNode(new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.GATHERER, maxAllowed: 1 })),
    new SetHeroRole({ role: HeroRole.GATHERER }),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToCenter()), new Pause()]),
        new SequenceNode([new GetWanderingMonsters(), new TargetEntityClosestToMyHero(), new InterceptTargetEntity()]),
        new SequenceNode([
            new SetPositionsOfInterest({ positionTypes: [PositionType.OUTER_PATROL_AREA] }),
            new FilterOutAlreadyTargetedAreas(),
            new TargetAreaThatIHaveLeastInformation({ range: AREA_RADIUS }),
            new MoveToArea(),
        ]),
    ]),
]);

const taggerBehaviour = new SequenceNode([
    new SetHeroRole({ role: HeroRole.TAGGER }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.TAGGER, maxAllowed: 1 }),
    new HasAllowedNumberOfHeroesOfType({ role: HeroRole.DEFENDER, allowed: 0 }),
    new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 }),
    new GetEnemyHeroesNearMyBase(),
    new FilterAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
    new SelectNode([
        new SequenceNode([new InverterNode(new AmIClosestToTargetEntity()), new Pause()]),
        new InterceptTargetEnemyHero(),
    ]),
]);

const heroAI = new BehaviourTree(
    new SelectNode([
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new HaveIAlreadyChosenCommand()])),

        //   new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), shieldMyselfBehaviour])),
        //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), gathererBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), defendBaseFromMonstersBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), taggerBehaviour])),

        //    new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), interceptEnemyHeroBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), farmBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), patrolBehaviour])),
        new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), new Wait()])),
    ])
);

export { heroAI };
