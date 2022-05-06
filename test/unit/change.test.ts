import { change, ChangeType, globalContext } from '../../src';
import jsonata from 'jsonata';

describe('Test change flow', () => {
    test('Change type jsonata', async () => {
        const flow = change<{ value: number }, { value: number, value2: number }>('value2', ChangeType.JSONata, jsonata('value + 1'));
        const result = await flow({ value: 5 });

        expect(result.value).toStrictEqual(5);
        expect(result.value2).toStrictEqual(6);
    });

    test('Change type jsonata - globalContext', async () => {
        globalContext.get().value = 5;

        const flow = change<{}, {}>('_globalContext.value', ChangeType.JSONata, jsonata('_globalContext.value + 1'));
        await flow({});

        expect(globalContext.get().value).toStrictEqual(6);
    });

    test('Change type copy', async () => {
        const flow = change<{ value: number }, { value: number, value2: number }>('value2', ChangeType.copy, 'value');
        const result = await flow({ value: 5 });

        expect(result.value).toStrictEqual(5);
        expect(result.value2).toStrictEqual(5);
    });

    test('Change type copy - globalContext', async () => {
        globalContext.get().value = 5;

        const flow = change<{}, {}>('_globalContext.value2', ChangeType.copy, '_globalContext.value');
        await flow({});

        expect(globalContext.get().value).toStrictEqual(5);
        expect(globalContext.get().value2).toStrictEqual(5);
    });

    test('Change type deep copy', async () => {
        type Obj = { test1: { val1: string } };
        const input: Obj = { test1: { val1: 'test1' } };

        const flow = change<{ value: Obj }, { value: Obj, value2: Obj }>('value2', ChangeType.deepCopy, 'value');
        const result = await flow({ value: input });

        input.test1.val1 = 'test2';

        expect(result.value).toStrictEqual({ test1: { val1: 'test2' } });
        expect(result.value2).toStrictEqual({ test1: { val1: 'test1' } });
    });

    test('Change type deep copy - globalContext', async () => {
        type Obj = { test1: { val1: string } };
        const input: Obj = { test1: { val1: 'test1' } };

        globalContext.get().value = input;

        const flow = change<{}, {}>('_globalContext.value2', ChangeType.deepCopy, '_globalContext.value');
        await flow({});

        input.test1.val1 = 'test2';

        expect(globalContext.get().value).toStrictEqual({ test1: { val1: 'test2' } });
        expect(globalContext.get().value2).toStrictEqual({ test1: { val1: 'test1' } });
    });

    test('Change type value', async () => {
        const flow = change<{}, { value1: number }>('value1', ChangeType.value, 5);
        const result = await flow({});

        expect(result.value1).toStrictEqual(5);
    });

    test('Change type value - globalContext', async () => {
        const flow = change<{}, {}>('_globalContext.value1', ChangeType.value, 5);
        await flow({});

        expect(globalContext.get().value1).toStrictEqual(5);
    });
});
