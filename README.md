# lamprox
Framework for development lambda-proxy function of AWS Lambda.

## Setup

```
$ npm install lamprox
```

## Functions
### lamprox()

```
(main: MainProcess<void, T, void>) => LambdaFunction
```

```
export const handler = lamprox<{ [key: string]: string }>((ambience, promise) => {
  promise.success({ foo: 'bar' });
});
```

Lambda function callback is setuped by lamprox.

```
callback(undefined, {
  statusCode: 200,
  headers: {},
  body: JSON.stringify({ foo: 'bar' })
});
```

### createLambdaFunction()

```
<T, U, E>(main: MainProcess<T, U, E>, options: ProcessorOptions<T, U, E>) => LambdaFunction
```

Create lambda function main process and optional processes - before, onSuccess, onFailure, and after -.

```
export const handler = createLambdaFunction<number, string, number>((ambience, promise) => {
  const beforeResult = ambience.result;
  promise.success(`Before result is ${beforeResult}`);
}, {
  before: (ambience, promise) => { promise.success(ambience.environments); },
  onSuccess: (ambience, promise) => {
    const mainResult = ambience.result;
    promise.success({
      statusCode: 200,
      headers: {},
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
},
42);
```

### prepareLambdaFunction()

```
<T, U, E>(options: ProcessorOptions<T, U, E>) => (main: MainProcess<T, U, E>) => LambdaFunction
```

By passing options in advance, you can get customized `lamprox` function.
