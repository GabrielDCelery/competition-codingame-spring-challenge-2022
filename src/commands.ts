import { EntityBase, MovingEntity } from './entity';

export enum CommandType {
    WAIT = 'WAIT',
    MELEE = 'MELEE',
}

export type Command = {
    type: CommandType;
    source: EntityBase & MovingEntity;
    target: EntityBase & MovingEntity;
};

export type ChosenHeroCommands = { [index: number]: Command };
