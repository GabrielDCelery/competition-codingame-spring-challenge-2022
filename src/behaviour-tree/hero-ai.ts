import { HeroRole } from '../commands';
import {
    AREA_RADIUS,
    BASE_VISION_RADIUS,
    CONTROL_SPELL_CAST_RANGE,
    FARMING_RANGE,
    HERO_MAX_SPEED,
    INTERCEPT_MONSTER_RANGE,
    MAX_ALLOWED_NUM_OF_DEFENDERS,
    MAX_ALLOWED_NUM_OF_INTERCEPTORS,
    BASE_AREA_RADIUS,
    NEAR_BASE_THRESHOLD,
    WIND_SPELL_CAST_RANGE,
    HERO_MELEE_RANGE,
    MONSTER_DAMAGING_BASE_DISTANCE,
    WIND_SPELL_POWER_RANGE,
    MONSTER_MAX_SPEED,
} from '../config';
import { EntityType } from '../entity';
import { PositionType } from '../game-state-analysis';
import {
    DirectEntityAwayFromMyBase,
    InterceptTargetEnemyHero,
    InterceptTargetEntity,
    MoveHeroToTargetPosition,
    MoveTowardsEnemyBase,
    MoveTowardsMyBase,
    Pause,
    PositionMyselfBetweenMyBaseAndTaretPosition,
    PushTargetEntityAwayFromMyBase,
    RedirectTargetEntityFromMyBase,
    SheildMyself,
    Wait,
} from './actions';
import { BehaviourTree, LocalCacheKey, SelectNode, SequenceNode } from './bt-engine';
import {
    IsTargetEntityWithinDistanceOfMyHero,
    IsTargetEntityShielded,
    CanISeeEnemyHero,
    DoIHaveShield,
    // HasEnoughHeroesAssumingRole,
    HasEnoughMana,
    IsTargetEntityExpectedToMoveIntoDistanceOfMyBase,
    // TargetAreaClosestToMe,
    TargetEntityClosestToMyBase,
    TargetEntityClosestToMyHero,
    AmIClosestToTargetEntity,
    IsTargetEntityControlled,
    HasAllowedMaximumNumberOfHeroesOfType,
    TargetPositionThatIsLeastCovered,
    TargetAreaThatIHaveLeastInformationAbout,
    HasExpectedMinimumNumberOfHeroesOfType,
    IsMyHeroWithinDistanceOfEnemyBase,
    AmIClosestToEnemyBase,
    AmIClosestToCenter,
    HasAllowedNumberOfHeroesOfType,
    HasHeroPendingToBeAssignedACommand,
    HasTargetEntitiesMoreOrEqualThan,
    TargetMidPositionOfTargetEntities,
    AmIClosestToMyBase,
    HasTargetPositionsMoreThan,
    IsTargetEntityWithinDistanceOfEnemyHero,
    CanTargetEntityBeKilledBeforeReachingMyBase,
    IsMyHeroWithinDistanceOfMyBase,
} from './conditions';
import { AmIClosestToTargetArea } from './conditions/am-i-closest-to-target-area';
import { HasEnemyHeroWithinDistanceOfMyBase } from './conditions/has-enemy-hero-within-distance-of-my-base';
import { IsTargetEntityWithinDistanceOfMyBase } from './conditions/is-target-entity-within-distance-of-my-base';
import { InverterDecorator, RepeaterDecorator } from './decorators';
import { ErrorCatcherNode } from './decorators/error-catcher';
import {
    ClearLocalCache,
    FilterTargetEntitiesWithingRangeOfMyBase,
    GetMonstersThreateningMyBase,
    SetPositionsOfInterest,
    GetWanderingMonsters,
    //  FilterToAreasWithNoMonsters,
    FilterOutAlreadyTargetedPositions,
    FilterAreaThatIJustVisited,
    SetHeroRole,
    GetMonsters,
    ClearLocalCacheAtKeys,
    GetEnemyHeroesWithinDistanceOfMyBase,
    GetMonstersWithinDistanceOfMyBase,
    FilterDownToPositionsIKnowTheLeastAbout,
    PickFirstPositionOfAvailablePositions,
    SetEntitiesOfType,
    FilterDownToEntitiesWithinDistanceOfMyBase,
    FilterDownToEntitiesClosestToMyBase,
    PickFirstEntityOfAvailableEntities,
    FilterDownToEntitiesThreateningMyBase,
    FilterDownToEntitiesClosestToMyHero,
} from './helpers';
import { FilterOutAlreadyTargetedEntities } from './helpers/filter-out-already-targeted-entities';
import { GetEnemyHeroesNearMyBase } from './helpers/get-enemy-heroes-near-my-base';
import { SelectNextHeroThatNeedsCommandBeingAssigned } from './helpers/select-next-hero-to-choose-command';

const defendBaseFromMonstersBehaviour = new SequenceNode([
    new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.DEFENDER, minExpected: 0 }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.DEFENDER, maxAllowed: 2 }),
    new SetHeroRole({ role: HeroRole.DEFENDER }),
    new GetMonstersThreateningMyBase(),
    new FilterTargetEntitiesWithingRangeOfMyBase({ range: INTERCEPT_MONSTER_RANGE }),
    new FilterOutAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityExpectedToMoveIntoDistanceOfMyBase({ distance: BASE_AREA_RADIUS }),
            new IsTargetEntityWithinDistanceOfMyHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushTargetEntityAwayFromMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new InverterDecorator(new IsTargetEntityControlled()),
            new InverterDecorator(new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 })),
            new InverterDecorator(new IsTargetEntityExpectedToMoveIntoDistanceOfMyBase({ distance: BASE_AREA_RADIUS })),
            new IsTargetEntityWithinDistanceOfMyBase({ distance: NEAR_BASE_THRESHOLD }),
            new IsTargetEntityWithinDistanceOfMyHero({ distance: CONTROL_SPELL_CAST_RANGE }),
            new RedirectTargetEntityFromMyBase(),
        ]),
        new InterceptTargetEntity(),
    ]),
]);

const farmBehaviour = new SequenceNode([
    new GetWanderingMonsters(),
    new FilterTargetEntitiesWithingRangeOfMyBase({ range: FARMING_RANGE }),
    new FilterOutAlreadyTargetedEntities(),
    //new TargetEntityClosestToMyBase(),
    new TargetEntityClosestToMyHero(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new InterceptTargetEntity(),
    ]),
]);

const patrolBehaviour = new SequenceNode([
    new SetPositionsOfInterest({ positionTypes: [PositionType.INNER_PATROL_AREA, PositionType.OUTER_PATROL_AREA] }),
    new FilterOutAlreadyTargetedPositions(),
    new TargetAreaThatIHaveLeastInformationAbout({ range: AREA_RADIUS }),
    // new TargetPositionThatIsLeastCovered(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetArea()), new Pause()]),
        new MoveHeroToTargetPosition(),
    ]),
]);
/*
const patrolBehaviourV2 = new SequenceNode([
    new SetPositionsOfInterest(),
    new FilterOutAlreadyTargetedPositions(),
    new FilterToAreasWithNoMonsters(),
    new FilterAreaThatIJustVisited(),
    new TargetAreaClosestToMe(),
    new SelectNode([new SequenceNode([new InverterDecorator(new AmIClosestToTargetArea()), new Pause()]), new MoveHeroToTargetPosition()]),
]);
*/
const shieldMyselfBehaviour = new SequenceNode([
    new CanISeeEnemyHero(),
    new InverterDecorator(new DoIHaveShield()),
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
    new FilterOutAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityWithinDistanceOfMyHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushTargetEntityAwayFromMyBase(),
        ]),
        new SequenceNode([
            new HasEnoughMana({ reserve: 0 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityWithinDistanceOfMyHero({ distance: CONTROL_SPELL_CAST_RANGE }),
            new InverterDecorator(new IsTargetEntityWithinDistanceOfMyHero({ distance: WIND_SPELL_CAST_RANGE })),
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
            new FilterOutAlreadyTargetedPositions(),
            new TargetAreaThatIHaveLeastInformationAbout({ range: AREA_RADIUS }),
            new MoveHeroToTargetPosition(),
        ]),
    ]),
]);

const taggerBehaviour = new SequenceNode([
    new SetHeroRole({ role: HeroRole.TAGGER }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.TAGGER, maxAllowed: 1 }),
    new HasAllowedNumberOfHeroesOfType({ role: HeroRole.DEFENDER, allowed: 0 }),
    new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 }),
    new GetEnemyHeroesNearMyBase(),
    new FilterOutAlreadyTargetedEntities(),
    new TargetEntityClosestToMyBase(),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
        new InterceptTargetEnemyHero(),
    ]),
]);

/*
new CanISeeEnemyHero(),
new InverterDecorator(new DoIHaveShield()),
new SheildMyself(),
*/

const baseProtectorBehavior = new SequenceNode([
    new SetHeroRole({ role: HeroRole.BASE_PROTECTOR }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.BASE_PROTECTOR, maxAllowed: 1 }),
    new SelectNode([
        new SequenceNode([
            new GetMonsters(),
            new FilterTargetEntitiesWithingRangeOfMyBase({ range: 7000 }),
            new FilterOutAlreadyTargetedEntities(),
            new TargetEntityClosestToMyBase(),
            new SelectNode([
                new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
                new SequenceNode([
                    new HasEnoughMana({ reserve: 0 }),
                    new InverterDecorator(new IsTargetEntityShielded()),
                    new IsTargetEntityWithinDistanceOfMyBase({ distance: BASE_AREA_RADIUS }),
                    new IsTargetEntityWithinDistanceOfMyHero({ distance: WIND_SPELL_CAST_RANGE }),
                    new PushTargetEntityAwayFromMyBase(),
                ]),
                new InterceptTargetEntity(),
            ]),
        ]),
        new SequenceNode([
            new HasEnemyHeroWithinDistanceOfMyBase({ distance: 7000 }),
            new GetEnemyHeroesNearMyBase(),
            new TargetEntityClosestToMyBase(),
            new SelectNode([
                new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),
                new InterceptTargetEnemyHero(),
            ]),
        ]),
    ]),
]);

const createPatrolBehaviour = ({
    positionTypes,
    areaRadius,
}: {
    positionTypes: PositionType[];
    areaRadius: number;
}) => {
    return new SequenceNode([
        new SetPositionsOfInterest({ positionTypes }),
        new FilterOutAlreadyTargetedPositions(),
        new FilterDownToPositionsIKnowTheLeastAbout({ radius: areaRadius }),
        new HasTargetPositionsMoreThan({ count: 1 }),
        new PickFirstPositionOfAvailablePositions(),
        new MoveHeroToTargetPosition(),
    ]);
};

const guardBehaviour = new SequenceNode([
    new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.GUARD, minExpected: 0 }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.GUARD, maxAllowed: 1 }),
    new SetHeroRole({ role: HeroRole.GUARD }),
    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToMyBase()), new Pause()]),

        new SequenceNode([
            new SetEntitiesOfType({ entityType: EntityType.MONSTER }),
            new FilterDownToEntitiesWithinDistanceOfMyBase({ distance: BASE_AREA_RADIUS }),
            new FilterDownToEntitiesClosestToMyBase(),
            // new FilterOutAlreadyTargetedEntities(),
            new HasTargetEntitiesMoreOrEqualThan({ count: 1 }),
            new PickFirstEntityOfAvailableEntities(),
            new SelectNode([
                new SequenceNode([
                    new HasEnoughMana({ reserve: 0 }),
                    new InverterDecorator(new IsTargetEntityShielded()),
                    new IsTargetEntityWithinDistanceOfMyHero({ distance: WIND_SPELL_CAST_RANGE }),
                    new SelectNode([
                        new SequenceNode([
                            new IsTargetEntityWithinDistanceOfEnemyHero({ distance: WIND_SPELL_CAST_RANGE }),
                            new IsTargetEntityWithinDistanceOfMyBase({
                                distance:
                                    WIND_SPELL_POWER_RANGE + MONSTER_DAMAGING_BASE_DISTANCE * 2 + MONSTER_MAX_SPEED,
                            }),
                            new PushTargetEntityAwayFromMyBase(),
                        ]),
                        new SequenceNode([
                            new InverterDecorator(new HasEnemyHeroWithinDistanceOfMyBase({ distance: 8000 })),
                            new PushTargetEntityAwayFromMyBase(),
                        ]),
                        new SequenceNode([
                            new IsTargetEntityWithinDistanceOfMyBase({
                                distance: MONSTER_DAMAGING_BASE_DISTANCE * 2 + MONSTER_MAX_SPEED,
                            }),
                            new PushTargetEntityAwayFromMyBase(),
                        ]),
                    ]),
                ]),
                new InterceptTargetEntity(),
            ]),
        ]),
        new SequenceNode([
            new GetEnemyHeroesWithinDistanceOfMyBase({ distance: 7000 }),
            new HasTargetEntitiesMoreOrEqualThan({ count: 1 }),
            new TargetMidPositionOfTargetEntities(),
            new PositionMyselfBetweenMyBaseAndTaretPosition({ ratio: 0.9 }),
        ]),
        // createPatrolBehaviour({ positionTypes: [PositionType.INNER_PATROL_AREA], areaRadius: AREA_RADIUS }),
    ]),
]);

const patrolBehaviourV2 = new SequenceNode([
    new HasExpectedMinimumNumberOfHeroesOfType({ role: HeroRole.PATROL, minExpected: 0 }),
    new HasAllowedMaximumNumberOfHeroesOfType({ role: HeroRole.PATROL, maxAllowed: 1 }),
    new SetHeroRole({ role: HeroRole.PATROL }),
    new SetEntitiesOfType({ entityType: EntityType.MONSTER }),
    new FilterDownToEntitiesThreateningMyBase(),
    new FilterTargetEntitiesWithingRangeOfMyBase({ range: INTERCEPT_MONSTER_RANGE }),
    new FilterOutAlreadyTargetedEntities(),
    new FilterDownToEntitiesClosestToMyHero(),
    new HasTargetEntitiesMoreOrEqualThan({ count: 1 }),
    new PickFirstEntityOfAvailableEntities(),

    new SelectNode([
        new SequenceNode([new InverterDecorator(new AmIClosestToTargetEntity()), new Pause()]),

        new SequenceNode([
            new HasEnoughMana({ reserve: 50 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new IsTargetEntityExpectedToMoveIntoDistanceOfMyBase({ distance: BASE_AREA_RADIUS }),
            new IsTargetEntityWithinDistanceOfMyHero({ distance: WIND_SPELL_CAST_RANGE }),
            new PushTargetEntityAwayFromMyBase(),
        ]),

        new SequenceNode([
            new HasEnoughMana({ reserve: 50 }),
            new InverterDecorator(new IsTargetEntityShielded()),
            new InverterDecorator(new IsTargetEntityExpectedToMoveIntoDistanceOfMyBase({ distance: BASE_AREA_RADIUS })),
            new IsTargetEntityWithinDistanceOfMyHero({ distance: CONTROL_SPELL_CAST_RANGE }),
            new RedirectTargetEntityFromMyBase(),
        ]),

        new InterceptTargetEntity(),
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
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, guardBehaviour])),
                new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, patrolBehaviourV2])),
                //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), shieldMyselfBehaviour])),
                //  new ErrorCatcherNode(new SequenceNode([new ClearLocalCache(), gathererBehaviour])),

                //  new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, baseProtectorBehavior])),
                //  new ErrorCatcherNode(new SequenceNode([clearCacheForRoleSelection, defendBaseFromMonstersBehaviour])),
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
