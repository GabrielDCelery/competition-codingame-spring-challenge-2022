import { expect } from 'chai';
import { describe, it } from 'mocha';

import { vector2DSubtract, vector2DDot } from '../src/common';

describe('main', () => {
    it('does something', () => {
        // Given

        const sourcePosition = {
            x: 1761,
            y: 5285,
        };

        const targetPosition = {
            x: 1763,
            y: 4500,
        };

        const sourceDirection = {
            x: 2,
            y: 799,
        };

        const targetDirection = vector2DSubtract({
            v1: targetPosition,
            v2: sourcePosition,
        });

        const a = vector2DDot({
            v1: targetDirection,
            v2: sourceDirection,
        });

        const b = vector2DDot({
            v1: sourceDirection,
            v2: targetDirection,
        });
        console.log(a);
        console.log(b);

        // When

        // Then
        expect(true).to.deep.equal(true);
    });
});
