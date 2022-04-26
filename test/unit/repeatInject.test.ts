import { repeatInject } from '../../src';
import { Flow } from '@flow-engine/core';

describe('Test repeatInject flow', () => {
    test('Flow baldy configured for iteration', async () => {
        await expect(async () => repeatInject<{ value: number }, Flow<{ value: number }>>((input) => {
            return new Promise((resolve) => {
                setImmediate(() => resolve(input));
            });
        }, 100, -1)).rejects.toThrowError('if iteration is set, it must be higher than 0');
    });

    test('1 iteration', async () => {
        let countCalled = 0;

        const flow = repeatInject<{ value: number }, Flow<{ value: number }>>((input) => {
            countCalled++;
            expect(input.value).toStrictEqual(5);

            return new Promise((resolve) => {
                setImmediate(() => resolve(input));
            });
        }, 100, 1);

        const result = await flow({ value: 5 });

        expect(result.value).toStrictEqual(5);
        expect(countCalled).toStrictEqual(1);
    });

    test('5 iterations', async () => {
        let countCalled = 0;

        const flow = repeatInject<{ value: number }, Flow<{ value: number }>>((input) => {
            countCalled++;
            expect(input.value).toStrictEqual(5);

            return new Promise((resolve) => {
                setImmediate(() => resolve(input));
            });
        }, 100, 5);

        const result = await flow({ value: 5 });

        expect(result.value).toStrictEqual(5);
        expect(countCalled).toStrictEqual(5);
    });

    test('Infinite iterations, but stop by a throw', async () => {
        let countCalled = 0;

        const flow = repeatInject<{ value: number }, Flow<{ value: number }>>((input) => {
            if (countCalled === 9) {
                throw new Error('Stop iterations');
            }

            countCalled++;
            expect(input.value).toStrictEqual(5);

            return new Promise((resolve) => {
                setImmediate(() => resolve(input));
            });
        }, 100);

        await expect(() => flow({ value: 5 })).rejects.toThrowError('Stop iterations');

        expect(countCalled).toStrictEqual(9);
    });
});
