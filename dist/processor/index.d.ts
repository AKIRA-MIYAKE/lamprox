import { LambdaProxyHandler, IProcessor, BeforeProcess, MainProcess, AfterProcess, ResponseProcess, OnErrorProcess } from '../types';
export declare class Processor<T, U, E> implements IProcessor<T, U, E> {
    main: MainProcess<T, U, E>;
    enviroments: E;
    before: BeforeProcess<T, E>;
    after: AfterProcess<U, E>;
    response: ResponseProcess<U, E>;
    onError: OnErrorProcess<E>;
    constructor(params: IProcessor.Params<T, U, E>);
    toHandler(): LambdaProxyHandler;
}
