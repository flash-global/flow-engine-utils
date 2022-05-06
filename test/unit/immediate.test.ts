import { immediate } from '../../src';
import { Flow } from '@flow-engine/core';

describe('Test immediate flow', () => {
    test('immediate - success', async () => {
        let hasBeenCalled = false;

        const flow = immediate<{ value: number }, Flow<{ value: number }>>(async (input) => {
            hasBeenCalled = true;
            expect(input.value).toStrictEqual(5);

            return input;
        });

        await flow({ value: 5 });
        await new Promise((resolve) => setImmediate(resolve));

        expect(hasBeenCalled).toBeTruthy();
    });
});
