import { IFuturePromiseLike } from 'monapt';
import { Context } from 'aws-lambda';
export interface LambdaFunctionBuilder<T, U, E> {
    (main: MainProcess<T, U, E>, environments: E, options?: ProcessorOptions<T, U, E>): LambdaFunction;
}
/**
 *  Lambda function for Proxy Integration
 */
export interface LambdaFunction {
    (event: LambdaProxyEvent, context: Context, callback: LambdaProxyCallback): void;
}
/**
 * Input event parameter that contains a request made by a client to an API Gateway.
 * @see {@link http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format}
 */
export interface LambdaProxyEvent {
    resource: string;
    path: string;
    httpMethod: string;
    headers?: {
        [key: string]: any;
    };
    queryStringParameters?: {
        [key: string]: any;
    };
    pathParameters?: {
        [key: string]: any;
    };
    stageVariables?: string | undefined;
    requestContext: {
        [key: string]: any;
    };
    body?: any;
    isBase64Encoded: boolean;
}
export interface LambdaProxyCallback {
    (error: undefined, result: LambdaProxyCallbackResult): void;
}
/**
 * Object that containing the required statusCode and any applicable headers and body, for API Gateway to return it as an HTTP response to the client.
 * @see {@link http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-output-format}
 */
export interface LambdaProxyCallbackResult {
    isBase64Encoded?: boolean;
    statusCode: number;
    headers?: {
        [key: string]: any;
    };
    body?: string;
}
/**
 * Processing one unit.
 */
export interface Process<T, U, E> {
    (ambience: ProcessAmbience<T, E>, promise: IFuturePromiseLike<U>): void;
}
/** Preparing before main process. */
export declare type BeforeProcess<T, E> = Process<undefined, T, E>;
/** Main process for request. */
export declare type MainProcess<T, U, E> = Process<T, U, E>;
/** Build callback result process when main process success. */
export declare type OnSuccessProcess<U, E> = Process<U, LambdaProxyCallbackResult, E>;
/** Build callback result process when main process fail. */
export declare type OnFailureProcess<E> = Process<Error, LambdaProxyCallbackResult, E>;
/** After process. */
export declare type AfterProcess<E> = Process<LambdaProxyCallbackResult, LambdaProxyCallbackResult, E>;
export interface ProcessAmbience<T, E> {
    /** Variables that pssed lambda function. */
    lambda: {
        event: LambdaProxyEvent;
        context: Context;
        callback: LambdaProxyCallback;
    };
    /** Result that preceding process. */
    result?: T;
    /** Shared variables accross that processes. */
    environments?: E;
}
export interface IProcessor<T, U, E> {
    before: BeforeProcess<T, E>;
    main: MainProcess<T, U, E>;
    onSuccess: OnSuccessProcess<U, E>;
    onFailure: OnFailureProcess<E>;
    after: AfterProcess<E>;
    fatalErrorHandler: FatalErrorHandler;
    getLambdaFunction: () => LambdaFunction;
}
export interface ProcessorOptions<T, U, E> {
    before?: BeforeProcess<T, E>;
    onSuccess?: OnSuccessProcess<U, E>;
    onFailure?: OnFailureProcess<E>;
    after?: AfterProcess<E>;
}
export interface ProcessorSettings {
    fatalErrorHandler?: FatalErrorHandler;
}
export interface FatalErrorHandler {
    (error: Error, callback: LambdaProxyCallback): void;
}
