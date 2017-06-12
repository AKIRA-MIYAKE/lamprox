import { Future } from 'monapt';
import { LambdaProxyEvent, Process, ProcessAmbience } from '../interface';
export interface InvokeProcessParams<T, E> {
    event: LambdaProxyEvent;
    result: T;
    environments: E;
}
export declare const invokeProcess: <T, U, E>(process: Process<T, U, E>, params: InvokeProcessParams<T, E>) => Future<ProcessAmbience<U, E>>;
