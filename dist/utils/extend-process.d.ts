import { Process } from '../interface';
export declare const extendProcess: <T, U, E>(parent: Process<T, U, E>, ex: Process<U, U, E>) => Process<T, U, E>;
