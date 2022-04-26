import { Flow, FlowInput } from '@flow-engine/core';

const immediate = <
    Input = FlowInput,
    InputFlow extends Flow<Input> = Flow<Input>,
>(flow: InputFlow): Flow<Input, Input> => {
    const immediateFlow: Flow<Input, Input> = (input: Input): Input => {
        setImmediate(() => flow(input));
        return input;
    };

    immediateFlow.id = 'immediate';
    return immediateFlow;
};

export default immediate;
