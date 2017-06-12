import { Future } from 'monapt';
import { Process, ProcessAmbience } from '../interface';
export declare const processToFuture: <T, U, E>(ambience: ProcessAmbience<T, E>, process: Process<T, U, E>) => Future<ProcessAmbience<U, E>>;
