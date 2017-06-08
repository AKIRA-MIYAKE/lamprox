import { IFuturePromiseLike } from 'monapt';
import { Context } from 'aws-lambda';
export interface LambdaFunction {
    (event: LambdaEvent, context: LambdaContext, callback: LambdaCallback): void;
}
export declare type LambdaEvent = any;
export declare type LambdaContext = Context;
export interface LambdaCallback {
    (error: undefined, result: LambdaCallbackResult): void;
}
export interface LambdaCallbackResult {
    statusCode: number;
    headers: {
        [key: string]: string;
    };
    body: string;
}
export interface Process<T, U, E> {
    (value: ProcessAmbience<T, E>, promise: IFuturePromiseLike<U>): void;
}
export interface ProcessAmbience<T, E> {
    lambda: ProcessAmbienceLambda;
    result: T;
    environments: E;
}
export interface ProcessAmbienceLambda {
    event: LambdaEvent;
    context: LambdaContext;
    callback: LambdaCallback;
}
export interface ProcessorInterface<T, U, E> {
    before: BeforeProcess<T, E>;
    main: MainProcess<T, U, E>;
    onSuccess: OnSuccessProcess<U, E>;
    onFailure: OnFailureProcess<E>;
    after: AfterProcess<E>;
    lambda: () => LambdaFunction;
}
export declare type BeforeProcess<T, E> = Process<void, T, E>;
export declare type MainProcess<T, U, E> = Process<T, U, E>;
export declare type OnSuccessProcess<U, E> = Process<U, LambdaCallbackResult, E>;
export declare type OnFailureProcess<E> = Process<Error, LambdaCallbackResult, E>;
export declare type AfterProcess<E> = Process<LambdaCallbackResult, LambdaCallbackResult, E>;
export interface ProcessorOptions<T, U, E> {
    before?: BeforeProcess<T, E>;
    onSuccess?: OnSuccessProcess<U, E>;
    onFailure?: OnFailureProcess<E>;
    after?: AfterProcess<E>;
}
export declare class Processor<T, U, E> implements ProcessorInterface<T, U, E> {
    main: MainProcess<T, U, E>;
    environments: E;
    before: BeforeProcess<T, E>;
    onSuccess: OnSuccessProcess<U, E>;
    onFailure: OnFailureProcess<E>;
    after: AfterProcess<E>;
    constructor(main: MainProcess<T, U, E>, options?: ProcessorOptions<T, U, E>, environments?: E);
    lambda(): LambdaFunction;
}
export declare const prepareLambdaFunction: <T, U, E>(options?: ProcessorOptions<T, U, E>, environments?: E) => (main: Process<T, U, E>) => LambdaFunction;
export declare const createLambdaFunction: <T, U, E>(main: Process<T, U, E>, options?: ProcessorOptions<T, U, E>, environments?: E) => LambdaFunction;
export declare const lamprox: <T>(main: Process<void, T, void>) => LambdaFunction;
