/*
export class Vector2DOld {
    x: number;
    y: number;

    constructor({ x, y }: { x: number; y: number }) {
        this.x = x;
        this.y = y;
    }

    static Instance({ x, y }: { x: number; y: number }): Vector2DOld {
        return new Vector2DOld({ x, y });
    }

    Clone(): Vector2DOld {
        return new Vector2DOld({ x: this.x, y: this.y });
    }

    IsZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    Normalize(): this {
        const length = this.Length();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    }

    Dot({ v2 }: { v2: Vector2DOld }): number {
        const v1N = this.Clone().Normalize();
        const v2N = v2.Clone().Normalize();
        return Math.acos(v1N.x * v2N.x + v1N.y * v2N.y);
    }

    Truncate({ max }: { max: number }): this {
        const length = this.Length();
        if (length <= max) {
            return this;
        }
        const ratio = max / length;
        this.x = this.x * ratio;
        this.y = this.y * ratio;
        return this;
    }

    Distance({ v2 }: { v2: Vector2DOld }): number {
        const distX = Math.abs(this.x - v2.x);
        const distY = Math.abs(this.y - v2.y);
        return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    }

    Add({ v2 }: { v2: Vector2DOld }): Vector2DOld {
        const cloned = this.Clone();
        return Vector2DOld.Instance({ x: cloned.x + v2.x, y: cloned.y + v2.y });
    }

    Subtract({ v2 }: { v2: Vector2DOld }): Vector2DOld {
        const cloned = this.Clone();
        return Vector2DOld.Instance({ x: cloned.x - v2.x, y: cloned.y - v2.y });
    }
}
*/

export type Vector2D = {
    x: number;
    y: number;
};

export const Vector2DLengthSq = ({ v }: { v: Vector2D }): number => {
    return Math.pow(v.x, 2) + Math.pow(v.y, 2);
};

export const Vector2DLength = ({ v }: { v: Vector2D }): number => {
    return Math.sqrt(Vector2DLengthSq({ v }));
};

export const Vector2DIsZero = ({ v }: { v: Vector2D }): boolean => {
    return v.x === 0 && v.y === 0;
};

export const Vector2DNormalize = ({ v }: { v: Vector2D }): Vector2D => {
    const length = Vector2DLength({ v });
    return { x: v.x / length, y: v.y / length };
};

export const Vector2DDot = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): number => {
    const v1N = Vector2DNormalize({ v: v1 });
    const v2N = Vector2DNormalize({ v: v2 });
    return Math.acos(v1N.x * v2N.x + v1N.y * v2N.y);
};

export const Vector2DAdd = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): Vector2D => {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
};

export const Vector2DSubtract = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): Vector2D => {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
};

export const Vector2DMultiply = ({ v, ratio }: { v: Vector2D; ratio: number }): Vector2D => {
    return { x: v.x * ratio, y: v.y * ratio };
};

export const Vector2DTruncate = ({ v, max }: { v: Vector2D; max: number }): Vector2D => {
    const length = Vector2DLength({ v });
    if (length <= max) {
        return { x: v.x, y: v.y };
    }
    const ratio = max / length;
    return { x: v.x * ratio, y: v.y * ratio };
};

export const Vector2DDistance = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): number => {
    const distX = Math.abs(v1.x - v2.x);
    const distY = Math.abs(v1.y - v2.y);
    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
};
