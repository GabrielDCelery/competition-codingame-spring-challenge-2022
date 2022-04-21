import { Entity, EntityType } from './entity';

export class Player {
    entitiesMap: { [index: number]: Entity };
    myHeroes: number[];
    opponentHeroes: number[];
    monsters: number[];

    constructor() {
        this.entitiesMap = {};
        this.myHeroes = [];
        this.opponentHeroes = [];
        this.monsters = [];
    }

    private addEntityToEntitiesMap({ entity }: { entity: Entity }) {
        this.entitiesMap[entity.id] = entity;
    }

    private addEntityToEntityType({ entity }: { entity: Entity }) {
        switch (entity.type) {
            case EntityType.MY_HERO: {
                return this.myHeroes.push(entity.id);
            }
            case EntityType.OPPONENT_HERO: {
                return this.opponentHeroes.push(entity.id);
            }
            case EntityType.MONSTER: {
                return this.monsters.push(entity.id);
            }
            default: {
                throw new Error(`Unhandled entity type -> ${entity.type}`);
            }
        }
    }

    addEntity({ entity }: { entity: Entity }) {
        this.addEntityToEntitiesMap({ entity });
        this.addEntityToEntityType({ entity });
    }
}
