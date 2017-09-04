/// <reference types="http-errors" />
import { HttpError } from 'http-errors';
export declare function isHttpError(error: Error): error is HttpError;
