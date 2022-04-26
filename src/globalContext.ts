const globalContext = {};

type GlobalContextType = {
    [k: string]: string | number | object | GlobalContextType,
};

const get = (): GlobalContextType => globalContext;

export { GlobalContextType };
export default { get };
