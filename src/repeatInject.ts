import { Flow, FlowInput } from '@flow-engine/core';

const repeatInject = <
    Input = FlowInput,
    InputFlow extends Flow<Input> = Flow<Input>,
>(flow: InputFlow, interval: number, iteration?: number): Flow<Input, Input> => {
    if (typeof iteration !== 'undefined' && iteration <= 0) {
        throw new Error('if iteration is set, it must be higher than 0');
    }

    const repeatInjectFlow: Flow<Input, Input> = async (input: Input): Promise<Input> => {
        return new Promise((resolve, reject) => {
            let currentIteration = 1;

            const runningInterval = setInterval(async () => {
                try {
                    await flow(input);
                } catch (error: any) {
                    clearInterval(runningInterval);
                    reject(error);
                    return;
                }

                currentIteration++;

                if (typeof iteration !== 'undefined' && currentIteration > iteration) {
                    clearInterval(runningInterval);
                    resolve(input);
                }
            }, interval);
        });
    };

    repeatInjectFlow.id = 'repeatInject';
    return repeatInjectFlow;
};

export default repeatInject;
