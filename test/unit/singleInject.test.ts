import { singleInject } from '../../src';
import { Flow } from '@flow-engine/core';

describe('Test singleInject flow', () => {
    test('single inject - success', async () => {
        let hasBeenCalled = false;

        const flow = singleInject<{ value: number }, Flow<{ value: number }>>(async (input) => {
            expect(input.value).toStrictEqual(5);
            hasBeenCalled = true;

            return new Promise((resolve) => {
                setImmediate(() => resolve(input));
            });
        });

        const result = await flow({ value: 5 });

        expect(result.value).toStrictEqual(5);
        expect(hasBeenCalled).toBeTruthy();
    });
});
