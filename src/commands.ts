import { EntityBase, MovingEntity } from './entity';

export enum CommandRole {
    DEFENDER = 'DEFENDER',
}

export enum CommandType {
    PAUSE = 'PAUSE',
    WAIT = 'WAIT',
    INTERCEPT = 'INTERCEPT',
    FARM = 'FARM',
    SPELL_WIND = 'SPELL_WIND',
    MOVE_TO_AREA = 'MOVE_TO_AREA',
}

export type Command = {
    type: CommandType;
    source: EntityBase & MovingEntity;
    target: EntityBase & MovingEntity;
};

export type ChosenHeroCommands = { [index: number]: Command };
