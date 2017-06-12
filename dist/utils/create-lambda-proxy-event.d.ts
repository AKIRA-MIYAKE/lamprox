import { LambdaProxyEvent } from '../interface';
export interface CreateLambdaProxyEventParams {
    resource?: string;
    path?: string;
    httpMethod?: string;
    headers?: {
        [key: string]: string;
    };
    queryStringParameters?: {
        [key: string]: string;
    };
    pathParameters?: {
        [key: string]: string;
    };
    stageVariables?: string | undefined;
    requestContext?: {
        [key: string]: any;
    };
    body?: any;
    isBase64Encoded?: boolean;
}
export declare const createLambdaProxyEvent: (params?: CreateLambdaProxyEventParams) => LambdaProxyEvent;
