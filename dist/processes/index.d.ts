import { BeforeProcess, OnSuccessProcess, OnFailureProcess, AfterProcess } from '../interface';
/**
 * Default processes that pre-set to processor.
 */
export declare module Processes {
    const getBeforeProcess: <T, E>() => BeforeProcess<T, E>;
    const getOnSuccessProcess: <U, E>() => OnSuccessProcess<U, E>;
    const getOnFailureProcess: <E>() => OnFailureProcess<E>;
    const getAfterProcess: <E>() => AfterProcess<E>;
}
