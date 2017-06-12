import { Future } from 'monapt';
import { LambdaFunction, LambdaProxyEvent, LambdaProxyCallbackResult } from '../interface';
export interface InvokeLambdaFunctionParams {
    event: LambdaProxyEvent;
}
export declare const invokeLambdaFunction: <E>(lambdaFunction: LambdaFunction, params: InvokeLambdaFunctionParams) => Future<LambdaProxyCallbackResult>;
