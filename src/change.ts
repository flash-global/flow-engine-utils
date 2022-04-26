import { Flow, FlowInput } from '@flow-engine/core';
import objectPath, { Path } from 'object-path';
import { cloneDeep, clone } from 'lodash';
import { Expression } from 'jsonata';
import globalContext from './globalContext';

enum ChangeType {
    JSONata,
    copy,
    deepCopy,
    value,
}

const change = <
    Input extends FlowInput = FlowInput,
    Output extends Input = Input,
> (path: Path, type: ChangeType, value: Expression | Path | any): Flow<Input, Output> => {
    if (type === ChangeType.JSONata) {
        const changeFlow = (input: Input): Output => {
            const output: Input & { _globalContext?: object } = { ...input, _globalContext: globalContext.get() };
            objectPath.set(output, path, value.evaluate(output));
            delete output._globalContext;

            return output as Output;
        };

        changeFlow.id = 'changeFlow';
        return changeFlow;
    }

    if (type === ChangeType.copy) {
        const changeFlow = (input: Input): Output => {
            const output: Input & { _globalContext?: object } = { ...input, _globalContext: globalContext.get() };
            objectPath.set(output, path, clone(objectPath.get(output, value)));
            delete output._globalContext;

            return output as Output;
        };

        changeFlow.id = 'changeFlow';
        return changeFlow;
    }

    if (type === ChangeType.deepCopy) {
        const changeFlow = (input: Input): Output => {
            const output: Input & { _globalContext?: object } = { ...input, _globalContext: globalContext.get() };
            objectPath.set(output, path, cloneDeep(objectPath.get(output, value)));
            delete output._globalContext;

            return output as Output;
        };

        changeFlow.id = 'changeFlow';
        return changeFlow;
    }

    const changeFlow = (input: Input): Output => {
        const output: Input & { _globalContext?: object } = { ...input, _globalContext: globalContext.get() };
        objectPath.set(output, path, value);
        delete output._globalContext;

        return output as Output;
    };

    changeFlow.id = 'changeFlow';
    return changeFlow;
};

export { ChangeType };
export default change;
