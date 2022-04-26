export type Vector2D = {
    x: number;
    y: number;
};

export const vector2DLengthSq = ({ v }: { v: Vector2D }): number => {
    return Math.pow(v.x, 2) + Math.pow(v.y, 2);
};

export const vector2DLength = ({ v }: { v: Vector2D }): number => {
    return Math.sqrt(vector2DLengthSq({ v }));
};

export const vector2DIsZero = ({ v }: { v: Vector2D }): boolean => {
    return v.x === 0 && v.y === 0;
};

export const vector2DNormalize = ({ v }: { v: Vector2D }): Vector2D => {
    const length = vector2DLength({ v });
    return { x: v.x / length, y: v.y / length };
};

export const vector2DDot = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): number => {
    const v1N = vector2DNormalize({ v: v1 });
    const v2N = vector2DNormalize({ v: v2 });
    return v1N.x * v2N.x + v1N.y * v2N.y;
    //  return Math.acos(v1N.x * v2N.x + v1N.y * v2N.y);
};

export const vector2DAdd = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): Vector2D => {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
};

export const vector2DSubtract = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): Vector2D => {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
};

export const vector2DMultiply = ({ v, ratio }: { v: Vector2D; ratio: number }): Vector2D => {
    return { x: v.x * ratio, y: v.y * ratio };
};

export const vector2DTruncate = ({ v, max }: { v: Vector2D; max: number }): Vector2D => {
    const length = vector2DLength({ v });
    if (length <= max) {
        return { x: v.x, y: v.y };
    }
    const ratio = max / length;
    return { x: v.x * ratio, y: v.y * ratio };
};

export const vector2DDistancePow = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): number => {
    const distX = Math.abs(v1.x - v2.x);
    const distY = Math.abs(v1.y - v2.y);
    return Math.pow(distX, 2) + Math.pow(distY, 2);
};

export const vector2DDistance = ({ v1, v2 }: { v1: Vector2D; v2: Vector2D }): number => {
    return Math.sqrt(vector2DDistancePow({ v1, v2 }));
};

export const vector2DClockwise = ({ v }: { v: Vector2D }): Vector2D => {
    return { x: -1 * v.y, y: v.x };
};

export const vector2DCounterClockwise = ({ v }: { v: Vector2D }): Vector2D => {
    return { x: v.y, y: -1 * v.x };
};

export const vectorToKey = ({ v }: { v: Vector2D }): string => {
    return `${v.x}_${v.y}`;
};
