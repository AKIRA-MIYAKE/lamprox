import { prepareHandlerBuilder } from '../prepare-handler-builder'
import { LambdaProxyHandlerBuilder, LambdaProxyHandler, ProcessorOptions } from '../../types'

export const buildHandler: <T, U, E>(parmas: LambdaProxyHandlerBuilder.Params<T, U, E>) => LambdaProxyHandler
= <T, U, E>(params: LambdaProxyHandlerBuilder.Params<T, U, E>) => prepareHandlerBuilder<T, U, E>()(params)
