# lamprox
Framework for development lambda-proxy function of AWS Lambda.

## Setup

```
$ npm install lamprox
```

## Functions
### lamprox()

```
(main: IMainProcess<null, T>) => ILambdaFunction
```

```
export const handler = lamprox<{ [key: string]: string }>((ambience, promise) => {
  promise.success({ foo: 'bar' });
});
```

Lambda function callback is setuped by lamprox.

```
callback(null, {
  statusCode: 200,
  headers: {},
  body: { foo: 'bar' }
});
```

### createLambdaFunction()

```
(main: IMainProcess<T, U>, options: IProcessorOptions<T, U>) => ILambdaFunction
```

Create lambda function main process and optional processes - before, onSuccess, onFailure, and after -.

```
export const handler = createLambdaFunction<number, string>((ambience, promise) => {
  const beforeResult = ambience.result;
  promise.success(`Before result is ${beforeResult}`);
}, {
  before: (ambience, promise) => { promise.success(42); },
  onSuccess: (ambience, promise) => {
    const mainResult = ambience.result;
    promise.success({
      statusCode: 200,
      headers: {},
      body: { main: mainResult, foo: 'bar' }
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
});
```

### prepareLambdaFunction()

```
(options: IProcessorOptions<T, U>) => (main: IMainProcess<T, U>) => ILambdaFunction
```

By passing options in advance, you can get customized `lamprox` function.
