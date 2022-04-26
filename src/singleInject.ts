import { Flow, FlowInput } from '@flow-engine/core';

const singleInject = <
    Input = FlowInput,
    InputFlow extends Flow<Input> = Flow<Input>,
>(flow: InputFlow): Flow<Input, Input> => {
    const singleInjectFlow: Flow<Input, Input> = async (input: Input): Promise<Input> => {
        await flow(input);
        return input;
    };

    singleInjectFlow.id = 'singleInject';
    return singleInjectFlow;
};

export default singleInject;
