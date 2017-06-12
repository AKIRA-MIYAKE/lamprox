# lamprox
Framework for development lambda-proxy function of AWS Lambda.

## Setup

```
$ npm install lamprox
```

## Functions
### lamprox()
Create simple lambda function.

```
<U>(main: MainProcess<undefined, U, undefined>) => LambdaFunction
```

```
export const handler = lamprox<{ [key: string]: string }>((ambience, promise) => {
  promise.success({ 'fizz': 'buzz' });
});
```

Lambda function callback is setuped by lamprox.

```
callback(undefined, {
  statusCode: 200,
  body: JSON.stringify({ 'fizz': 'buzz' })
});
```

### createLambdaFunction()
Create lambda function with various processes - before, onSuccess, onFailure, after -, enviroments and settings.
Enviroments is value shared across processes.
Settings is objects that change the standard behavior.

```
<T, U, E>(main: MainProcess<T, U, E>, environments: E, options?: ProcessorOptions<T, U, E>, settings?: ProcessorSettings) => LambdaFunction
```

```
export const handler = createLambdaFunction<number, string, number>(
  (ambience, promise) => {
    const beforeResult = ambience.result
    promise.success(`Before result is ${beforeResult}`)
  },
  42,
  {
    before: (ambience, promise) => { promise.success(ambience.environments); },
    onSuccess: (ambience, promise) => {
      const mainResult = ambience.result;
      promise.success({
        statusCode: 200,
        body: JSON.stringify({ main: mainResult, foo: 'bar' })
      });
    },
    onFailure: (ambience, promise) => {
      const error = ambience.result;
      promise.success({
        statusCode: 400,
        headers: {},
        body: JSON.stringify({
          title: 'Process fail!!',
          error: error
        })
      });
    },
    after: (ambience, promise) => {
      const callbackResult = ambience.result;
      promise.success(Object.assign({}, callbackResult, {
        headers: Object.assign({}, callbackResult.headers, {
          'Cache-Control': 'max-age=3600'
        })
      }));
    }
  }
)
```

### prepareLambdaFunctionBuilder()
Make a builder that makes common settings for creating multiple functions.
When create lambda function by builder, can override processes with `ProcessorOptions`.

```
<T, U, E>(options?: ProcessorOptions<T, U, E>, settings?: ProcessorSettings) => LambdaFunctionBuilder<T, U, E>
```

```
interface LambdaFunctionBuilder<T, U, E> {
  (main: MainProcess<T, U, E>, environments: E, options?: ProcessorOptions<T, U, E>): LambdaFunction
}
```

## Processes
`lamprox` is preparing default processes for creating simple api response.

### BeforeProcess [getBeforeProcess()]
Process not doing anything by standard.
Recommend you to do session management etc in this process.

### OnSuccessProcess [getOnSuccessProcess()]
The process of converting the result of the main process to the appropriate format of lambda proxy.

## OnFailuerProcess [getOnFailureProcess()]
The process of error handling.
It is expected that an error is contained in `ambience.result`.

## AfterProcess [getAfeterProcess()]
A process that performs common processing before returning a response.

## Utils
### extendProcess()
```
<T, U, E>(parent: Process<T, U, E>, ex: Process<U, U, E>) => Process<T, U, E>
```

### createLambdaProxyEvent()
```
(params?: CreateLambdaProxyEventParams) => LambdaProxyEvent
```

```
interface CreateLambdaProxyEventParams {
  resource?: string
  path?: string
  httpMethod?: string
  headers?: { [key: string]: string }
  queryStringParameters?: { [key: string]: string }
  pathParameters?: { [key: string]: string }
  stageVariables?: string | undefined
  requestContext?: { [key: string]: any }
  body?: any
  isBase64Encoded?: boolean
}
```

### invokeProcess()
```
<T, U, E>(process: Process<T, U, E>, params: InvokeProcessParams<T, E>) => Future<ProcessAmbience<U, E>>
```

```
interface InvokeProcessParams<T, E> {
  event: LambdaProxyEvent
  result: T
  environments: E
}
```

### invokeLambdaFunction()
```
<E>(lambdaFunction: LambdaFunction, params: InvokeLambdaFunctionParams) => Future<LambdaProxyCallbackResult>
```

```
interface InvokeLambdaFunctionParams {
  event: LambdaProxyEvent
}
```
