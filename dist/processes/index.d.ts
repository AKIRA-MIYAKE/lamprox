import { BeforeProcess, AfterProcess, ResponseProcess, OnErrorProcess } from '../types';
export declare const getDefaultBeforeProcess: <T, E>() => BeforeProcess<T, E>;
export declare const getDefaultAfterProcess: <U, E>() => AfterProcess<U, E>;
export declare const getDefaultResponseProcess: <U, E>() => ResponseProcess<U, E>;
export declare const getDefaultOnErrorProcess: <E>() => OnErrorProcess<E>;
