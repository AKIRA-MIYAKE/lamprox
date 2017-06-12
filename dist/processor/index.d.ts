import { LambdaFunction, MainProcess, BeforeProcess, OnSuccessProcess, OnFailureProcess, AfterProcess, IProcessor, ProcessorOptions, ProcessorSettings, FatalErrorHandler } from '../interface';
export declare class Processor<T, U, E> implements IProcessor<T, U, E> {
    main: MainProcess<T, U, E>;
    environments: E;
    before: BeforeProcess<T, E>;
    onSuccess: OnSuccessProcess<U, E>;
    onFailure: OnFailureProcess<E>;
    after: AfterProcess<E>;
    fatalErrorHandler: FatalErrorHandler;
    constructor(main: MainProcess<T, U, E>, environments: E, options?: ProcessorOptions<T, U, E>, settings?: ProcessorSettings);
    getLambdaFunction(): LambdaFunction;
}
