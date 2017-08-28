import { APIGatewayEvent } from 'aws-lambda';
export declare const generateDummyAPIGatewayEvent: (params?: GenerateDummyAPIGatewayEvent.Params) => APIGatewayEvent;
export declare namespace GenerateDummyAPIGatewayEvent {
    interface Params {
        body?: string;
        headers?: {
            [name: string]: string;
        };
        httpMethod?: string;
        isBase64Encoded?: boolean;
        path?: string;
        pathParameters?: {
            [name: string]: string;
        };
        queryStringParameters?: {
            [name: string]: string;
        };
        stageVariables?: {
            [name: string]: string;
        };
        requestContext?: {
            accountId: string;
            apiId: string;
            httpMethod: string;
            identity: {
                accessKey: string | null;
                accountId: string | null;
                apiKey: string | null;
                caller: string | null;
                cognitoAuthenticationProvider: string | null;
                cognitoAuthenticationType: string | null;
                cognitoIdentityId: string | null;
                cognitoIdentityPoolId: string | null;
                sourceIp: string;
                user: string | null;
                userAgent: string | null;
                userArn: string | null;
            };
            stage: string;
            requestId: string;
            resourceId: string;
            resourcePath: string;
        };
        resource?: string;
    }
}
