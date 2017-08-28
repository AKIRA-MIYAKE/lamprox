import { LambdaProxyHandler, MainProcess, BeforeProcess, AfterProcess, ResponseProcess, OnErrorProcess, IProcessor, ProcessorOptions } from '../types';
export declare class Processor<T, U, E> implements IProcessor<T, U, E> {
    main: MainProcess<T, U, E>;
    environments: E;
    before: BeforeProcess<T, E>;
    after: AfterProcess<U, E>;
    response: ResponseProcess<U, E>;
    onError: OnErrorProcess<E>;
    constructor(main: MainProcess<T, U, E>, environments: E, options?: ProcessorOptions<T, U, E>);
    toHandler(): LambdaProxyHandler;
}
