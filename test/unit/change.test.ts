import { change, ChangeType, globalContext } from '../../src';
import jsonata from 'jsonata';

describe('Test change flow', () => {
    test('Change type jsonata', () => {
        const flow = change<{ value: number }, { value: number, value2: number }>('value2', ChangeType.JSONata, jsonata('value + 1'));
        const result = flow({ value: 5 }) as { value: number, value2: number };

        expect(result.value).toStrictEqual(5);
        expect(result.value2).toStrictEqual(6);
    });

    test('Change type jsonata - globalContext', () => {
        globalContext.get().value = 5;

        const flow = change<{}, {}>('_globalContext.value', ChangeType.JSONata, jsonata('_globalContext.value + 1'));
        flow({});

        expect(globalContext.get().value).toStrictEqual(6);
    });

    test('Change type copy', () => {
        const flow = change<{ value: number }, { value: number, value2: number }>('value2', ChangeType.copy, 'value');
        const result = flow({ value: 5 }) as { value: number, value2: number };

        expect(result.value).toStrictEqual(5);
        expect(result.value2).toStrictEqual(5);
    });

    test('Change type copy - globalContext', () => {
        globalContext.get().value = 5;

        const flow = change<{}, {}>('_globalContext.value2', ChangeType.copy, '_globalContext.value');
        flow({});

        expect(globalContext.get().value).toStrictEqual(5);
        expect(globalContext.get().value2).toStrictEqual(5);
    });

    test('Change type deep copy', () => {
        type Obj = { test1: { val1: string } };
        const input: Obj = { test1: { val1: 'test1' } };

        const flow = change<{ value: Obj }, { value: Obj, value2: Obj }>('value2', ChangeType.deepCopy, 'value');
        const result = flow({ value: input }) as { value: Obj, value2: Obj };

        input.test1.val1 = 'test2';

        expect(result.value).toStrictEqual({ test1: { val1: 'test2' } });
        expect(result.value2).toStrictEqual({ test1: { val1: 'test1' } });
    });

    test('Change type deep copy - globalContext', () => {
        type Obj = { test1: { val1: string } };
        const input: Obj = { test1: { val1: 'test1' } };

        globalContext.get().value = input;

        const flow = change<{}, {}>('_globalContext.value2', ChangeType.deepCopy, '_globalContext.value');
        flow({});

        input.test1.val1 = 'test2';

        expect(globalContext.get().value).toStrictEqual({ test1: { val1: 'test2' } });
        expect(globalContext.get().value2).toStrictEqual({ test1: { val1: 'test1' } });
    });

    test('Change type value', () => {
        const flow = change<{}, { value1: number }>('value1', ChangeType.value, 5);
        const result = flow({}) as { value1: number };

        expect(result.value1).toStrictEqual(5);
    });

    test('Change type value - globalContext', () => {
        const flow = change<{}, {}>('_globalContext.value1', ChangeType.value, 5);
        flow({});

        expect(globalContext.get().value1).toStrictEqual(5);
    });
});
