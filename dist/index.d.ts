declare module 'lamprox' {
	import { IFuturePromiseLike } from 'monapt';
	import { Context } from 'aws-lambda';
	export interface LambdaFunction {
	    (event: LambdaEvent, context: LambdaContext, callback: LambdaCallback): void;
	}
	export type LambdaEvent = any;
	export type LambdaContext = Context;
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
	export type BeforeProcess<T, E> = Process<void, T, E>;
	export type MainProcess<T, U, E> = Process<T, U, E>;
	export type OnSuccessProcess<U, E> = Process<U, LambdaCallbackResult, E>;
	export type OnFailureProcess<E> = Process<Error, LambdaCallbackResult, E>;
	export type AfterProcess<E> = Process<LambdaCallbackResult, LambdaCallbackResult, E>;
	export interface ProcessorOptions<T, U, E> {
	    before?: BeforeProcess<T, E>;
	    onSuccess?: OnSuccessProcess<U, E>;
	    onFailure?: OnFailureProcess<E>;
	    after?: AfterProcess<E>;
	}
	export class Processor<T, U, E> implements ProcessorInterface<T, U, E> {
	    main: MainProcess<T, U, E>;
	    environments: E;
	    before: BeforeProcess<T, E>;
	    onSuccess: OnSuccessProcess<U, E>;
	    onFailure: OnFailureProcess<E>;
	    after: AfterProcess<E>;
	    constructor(main: MainProcess<T, U, E>, options?: ProcessorOptions<T, U, E>, environments?: E);
	    lambda(): LambdaFunction;
	}
	export const prepareLambdaFunction: <T, U, E>(options?: ProcessorOptions<T, U, E>, environments?: E) => (main: Process<T, U, E>) => LambdaFunction;
	export const createLambdaFunction: <T, U, E>(main: Process<T, U, E>, options?: ProcessorOptions<T, U, E>, environments?: E) => LambdaFunction;
	export const lamprox: <T>(main: Process<void, T, void>) => LambdaFunction;

}
