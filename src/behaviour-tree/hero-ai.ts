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
import { BehaviourTree, LocalCacheKey, SelectNode, SequenceNode } from './bt-engine';
import {
    IsTargetEntityWithinRangeOfHero,
    IsTargetEntityShielded,
    CanISeeEnemyHero,
    DoIHaveShield,
    // HasEnoughHeroesAssumingRole,
    HasEnoughMana,
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
    HasHeroPendingToBeAssignedACommand,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { HasEnemyHeroWithinDistanceOfMyBase } from './conditions/has-enemy-hero-within-distance-of-my-base';
import { IsTargetEntityWithinRangeOfMyBase } from './conditions/is-target-entity-within-range-of-my-base';
import { InverterDecorator, RepeaterDecorator } from './decorators';
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
    GetMonsters,
    ClearLocalCacheAtKeys,
} from './helpers';
import { FilterAlreadyTargetedEntities } from './helpers/filter-already-targeted-entities';
import { GetEnemyHeroesNearMyBase } from './helpers/get-enemy-heroes-near-my-base';
import { SelectNextHeroThatNeedsCommandBeingAssigned } from './helpers/select-next-hero-to-choose-command';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.DEFENDER, minExpected: 0 }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.DEFENDER, maxAllowed: 2 }),
    new SetHeroRole({ role: HeroRole.DEFENDER }),
    new GetMonstersThreateningMyBase(),
    new FilterEntitiesWithingRangeOfMyBase({ range: INTERCEPT_MONSTER_RANGE }),
    new FilterAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityExpectedToMoveIntoRangeOfMyBase({ range: MONSTER_BASE_DETECTION_THRESHOLD }),
            new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushTargetEntityAwayFromMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new InverterDecorator(new IsTargetEntityControlled()),
            new InverterDecorator(new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 })),
            new InverterDecorator(
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
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new InterceptTargetEntity(),
    ]),
]);

const patrolBehaviour = new SequenceNode([
    new SetPositionsOfInterest({ positionTypes: [PositionType.INNER_PATROL_AREA, PositionType.OUTER_PATROL_AREA] }),
    new FilterOutAlreadyTargetedAreas(),
    new TargetAreaThatIHaveLeastInformation({ range: AREA_RADIUS }),
    // new TargetPositionThatIsLeastCovered(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetArea()), new Pause()]),
        new MoveToArea(),
    ]),
]);
/*
const patrolBehaviourV2 = new SequenceNode([
    new SetPositionsOfInterest(),
    new FilterOutAlreadyTargetedAreas(),
    new FilterToAreasWithNoMonsters(),
    new FilterAreaThatIJustVisited(),
    new TargetAreaClosestToMe(),
    new SelectNode([new SequenceNode([new InverterDecorator(new AmIClosestToTargetArea()), new Pause()]), new MoveToArea()]),
]);
*/
const shieldMyselfBehaviour = new SequenceNode([
    new CanISeeEnemyHero(),
    new InverterDecorator(new DoIHaveShield()),
    new HasEnoughMana({ reserve: 50 }),
    new SheildMyself(),
]);

const interceptEnemyHeroBehaviour = new SequenceNode([
    new InverterDecorator(
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
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushTargetEntityAwayFromMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityWithinRangeOfHero({ distance: CONTROL_SPELL_CAST_RANGE }),
            new InverterDecorator(new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE })),
            new DirectEntityAwayFromMyBase({ entityType: EntityType.OPPONENT_HERO, entitySpeed: HERO_MAX_SPEED }),
        ]),
        new InterceptTargetEnemyHero(),
    ]),
]);

const gathererBehaviour = new SequenceNode([
    new InverterDecorator(new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.GATHERER, minExpected: 1 })),
    new InverterDecorator(new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.GATHERER, maxAllowed: 1 })),
    new SetHeroRole({ role: HeroRole.GATHERER }),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToCenter()), new Pause()]),
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
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new InterceptTargetEnemyHero(),
    ]),
]);

const baseProtectorBehavior = new SequenceNode([
    new SetHeroRole({ role: HeroRole.BASE_PROTECTOR }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.BASE_PROTECTOR, maxAllowed: 1 }),
    new SelectNode([
        new SequenceNode([
            new GetMonsters(),
            new FilterEntitiesWithingRangeOfMyBase({ range: 7000 }),
            new FilterAlreadyTargetedEntities(),
            new TargetEntityClosestToMyBase(),
            new SelectNode([
                new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
                new SequenceNode([
                    new HasEnoughMana({ reserve: 0 }),
                    new InverterDecorator(new IsTargetEntityShielded()),
                    new IsTargetEntityExpectedToMoveIntoRangeOfMyBase({ range: MONSTER_BASE_DETECTION_THRESHOLD }),
                    new IsTargetEntityWithinRangeOfHero({ distance: WIND_SPELL_CAST_RANGE }),
                    new PushTargetEntityAwayFromMyBase(),
                ]),
                new InterceptTargetEntity(),
            ]),
        ]),
        new SequenceNode([
            new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 }),
            new GetEnemyHeroesNearMyBase(),
            new FilterAlreadyTargetedEntities(),
            new TargetEntityClosestToMyBase(),
            new SelectNode([
                new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
                new InterceptTargetEnemyHero(),
            ]),
        ]),
    ]),
]);

const clearCacheForRoleSelection = new ClearLocalCacheAtKeys({
    keys: [
        LocalCacheKey.HERO_ROLE,
        LocalCacheKey.TARGET_ENTITY_ID,
        LocalCacheKey.TARGET_ENTITY_IDS,
        LocalCacheKey.TARGET_POSITION,
        LocalCacheKey.TARGET_POSITIONS,
    ],
});

const playerAI = new BehaviourTree(
    new RepeaterDecorator(
        new SequenceNode([
            new ClearLocalCacheAtKeys({ keys: [LocalCacheKey.MY_HERO_EVALUATING_BT] }),
            new SelectNextHeroThatNeedsCommandBeingAssigned(),
            new SelectNode([
                //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), shieldMyselfBehaviour])),
                //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), gathererBehaviour])),
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, baseProtectorBehavior])),
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, defendBaseFromMonstersBehaviour])),
                // new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), taggerBehaviour])),

                //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), interceptEnemyHeroBehaviour])),
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, farmBehaviour])),
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, patrolBehaviour])),
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, new Wait()])),
            ]),
        ])
    )
);

export { playerAI };
