declare module 'lamprox' {
	import { IFuturePromiseLike } from 'monapt';
	import { Context } from 'aws-lambda';
	export interface LambdaFunction {
	    (event: LambdaEvent, context: LambdaContext, callback: LambdaCallback): void;
	}
	export type LambdaEvent = any;
	export type LambdaContext = Context;
	export interface LambdaCallback {
	    (error: null, result: LambdaCallbackResult): void;
	}
	export interface LambdaCallbackResult {
	    statusCode: number;
	    headers: {
	        [key: string]: string;
	    };
	    body: string;
	}
	export interface Process<T, U> {
	    (value: ProcessAmbience<T>, promise: IFuturePromiseLike<U>): void;
	}
	export interface ProcessAmbience<T> {
	    lambda: ProcessAmbienceLambda;
	    result: T;
	}
	export interface ProcessAmbienceLambda {
	    event: LambdaEvent;
	    context: LambdaContext;
	    callback: LambdaCallback;
	}
	export interface ProcessorInterface<T, U> {
	    before: BeforeProcess<T>;
	    main: MainProcess<T, U>;
	    onSuccess: OnSuccessProcess<U>;
	    onFailure: OnFailureProcess;
	    after: AfterProcess;
	    lambda: () => LambdaFunction;
	}
	export type BeforeProcess<T> = Process<null, T>;
	export type MainProcess<T, U> = Process<T, U>;
	export type OnSuccessProcess<T> = Process<T, LambdaCallbackResult>;
	export type OnFailureProcess = Process<Error, LambdaCallbackResult>;
	export type AfterProcess = Process<LambdaCallbackResult, LambdaCallbackResult>;
	export interface ProcessorOptions<T, U> {
	    before?: BeforeProcess<T>;
	    onSuccess?: OnSuccessProcess<U>;
	    onFailure?: OnFailureProcess;
	    after?: AfterProcess;
	}
	export class Processor<T, U> implements ProcessorInterface<T, U> {
	    main: MainProcess<T, U>;
	    before: BeforeProcess<T>;
	    onSuccess: OnSuccessProcess<U>;
	    onFailure: OnFailureProcess;
	    after: AfterProcess;
	    constructor(main: MainProcess<T, U>, options?: ProcessorOptions<T, U>);
	    lambda(): LambdaFunction;
	}
	export const prepareLambdaFunction: <T, U>(options?: ProcessorOptions<T, U>) => (main: Process<T, U>) => LambdaFunction;
	export const createLambdaFunction: <T, U>(main: Process<T, U>, options?: ProcessorOptions<T, U>) => LambdaFunction;
	export const lamprox: <T>(main: Process<null, T>) => LambdaFunction;

}
