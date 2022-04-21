export enum CommandName {
    WAIT = 'WAIT',
    MOVE = 'MOVE',
}

export abstract class BaseAction {
    protected _getUtility(): number {
        throw new Error(`Child class needs to implement`);
    }

    protected _getCommand(): string {
        throw new Error(`Child class needs to implement`);
    }

    getUtility(): number {
        return this._getUtility();
    }

    getCommand(): string {
        return this._getCommand();
    }
}
