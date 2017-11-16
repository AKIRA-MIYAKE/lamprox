import { LambdaProxyHandler, BeforeProcess, MainProcess, AfterProcess, ResponseProcess, OnErrorProcess, IProcessor } from '../types';
export declare namespace PrepareHandlerBuilder {
    interface Params<T, U, E> {
        before?: BeforeProcess<T, E>;
        after?: AfterProcess<U, E>;
        response?: ResponseProcess<U, E>;
        onError?: OnErrorProcess<E>;
    }
}
export interface BuildHandler<T, U, E> {
    (params: IProcessor.Params<T, U, E>): LambdaProxyHandler;
}
export declare const prepareHandlerBuilder: <T, U, E>(preparedParams?: PrepareHandlerBuilder.Params<T, U, E>) => BuildHandler<T, U, E>;
export declare const buildHandler: <T, U, E>(params: IProcessor.Params<T, U, E>) => LambdaProxyHandler;
export declare const lamprox: <U>(main: MainProcess<void, U, void>) => LambdaProxyHandler;
