# Lamprox
Framework for development lambda-proxy function of AWS Lambda.

## Setup

```
$ npm install lamprox
```

## Concept and Usage
Lamprox is a minimal and flexible framework for lambda-proxy function of AWS Lambda.  
When building multiple endpoints with AWS Lambda, authentication, response processing, and error handling can be applied across functions in each function.  

### Process
Lamprox defines a handler with multiple `Process`.  
`Process` is a function as shown below.  

```
interface Process<T, U, E> {
  (ambience: ProcessAmbience<T, E>): Promise<U | undefined>
}

interface ProcessAmbience<T, E> {
  /** Variables that pssed lambda function. */
  lambda: {
    event: APIGatewayEvent
    context: Context
    callback: ProxyCallback
  }
  /** Result that preceding process. */
  result?: T
  /** Shared variables accross that processes. */
  environments: E
}
```

### Processor
`Processor` is a class that collects processes and executes them in order.  
`Processor` holds the processes before, main, after, response, onError and executes it as a handler.  

```
/** Preparing before main process. */
type BeforeProcess<T, E> = Process<undefined, T, E>
/** Main process for request. */
type MainProcess<T, U, E> = Process<T, U, E>
/** After process. */
type AfterProcess<U, E> = Process<U, U, E>
/** Process that creating proxy result. */
type ResponseProcess<U, E> = Process<U, ProxyResult, E>
/** Process that called when error occured. */
type OnErrorProcess<E> = Process<Error, ProxyResult, E>

interface IProcessor<T, U, E> {
  before: BeforeProcess<T, E>
  main: MainProcess<T, U, E>
  after: AfterProcess<U, E>
  response: ResponseProcess<U, E>
  onError: OnErrorProcess<E>

  toHandler: () => LambdaProxyHandler
}
```

### Functions
Generally, it is not necessary to directly generate a processor.  
Lamprox provides several functions for creating handler.  

#### `lamprox()`
Create simple lambda proxy handler.  
You can create a handler for lambda-proxy by simply writing a method to generate the response body.  

```
lamprox: <U>(main: MainProcess<undefined, U, undefined>) => LambdaProxyHandler
```

#### `buildHandler()`
Create lambda function with various processes - befire, after, response, onError - and enviroments.  
Enviroments is value shared across processes.  

```
buildHandler: <T, U, E>(parmas: LambdaProxyHandlerBuilder.Params<T, U, E>) => LambdaProxyHandler
```

#### `prepareHandlerBuilder()`
`prepareHandlerBuilder()` is a function for creating buildHandler function.  
Assuming that there are many Lambda functions, you can generate a buildHandler function that defines a common process.  

```
prepareHandlerBuilder: <T, U, E>(preparedOptions?: ProcessorOptions<T, U, E>) => LambdaProxyHandlerBuilder<T, U, E>
```

### Utilities
Lamprox contains [node-lambda-utilities](https://github.com/AKIRA-MIYAKE/node-lambda-utilities), but provides some utility functions for lambda-proxy.  

#### `generateDummyAPIGatewayEvent()`
This is a function for generating a dummy APIGatewayEvent.  
You can test the handler by using it together with `invokeHandler()` of node-lambda-utilities.  

```
generateDummyAPIGatewayEvent: (params?: GenerateDummyAPIGatewayEvent.Params) => APIGatewayEvent
```

#### `generateProcessAmbience()`
A function that generates `ProcessAmbience` which is an argument when `Process` is executed.  
By using this, it is possible to test each `Process`.  

```
generateProcessAmbience: <T, E>(params: GenerateProcessAmbience.Params<T, E>) => ProcessAmbience<T, E>
```
