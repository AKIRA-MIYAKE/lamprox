import { LambdaFunction, MainProcess, ProcessorOptions, ProcessorSettings } from '../interface';
export declare const createLambdaFunction: <T, U, E>(main: MainProcess<T, U, E>, environments: E, options?: ProcessorOptions<T, U, E>, settings?: ProcessorSettings) => LambdaFunction;
