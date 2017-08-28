import { APIGatewayEvent, Context, ProxyCallback } from 'aws-lambda';
import { ProcessAmbience } from '../../types';
export declare const generateProcessAmbience: <T, E>(params: GenerateProcessAmbience.Params<T, E>) => ProcessAmbience<T, E>;
export declare namespace GenerateProcessAmbience {
    interface Params<T, E> {
        result: T | undefined;
        environments: E;
        event: APIGatewayEvent;
        context: Context;
        callback: ProxyCallback;
    }
}
