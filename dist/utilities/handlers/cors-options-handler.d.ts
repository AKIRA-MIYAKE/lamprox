import { ProxyHandler, APIGatewayEvent } from 'aws-lambda';
export declare const buildCORSOptionsHandler: (options?: BuildCORSOptionsHandler.Options) => ProxyHandler;
export declare namespace BuildCORSOptionsHandler {
    interface Options {
        allowOrigin?: string | ((event?: APIGatewayEvent) => string);
        allowCredentials?: boolean;
        allowMethods?: string[];
        allowHeaders?: string[];
        exposeHeaders?: string[];
        maxAge?: number;
    }
}
