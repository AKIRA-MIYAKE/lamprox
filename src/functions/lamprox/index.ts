import { buildHandler } from '../build-handler'
import { LambdaProxyHandler, MainProcess } from '../../types'

export const lamprox: <U>(main: MainProcess<undefined, U, undefined>) => LambdaProxyHandler
= <U>(main: MainProcess<undefined, U, undefined>) => buildHandler<undefined, U, undefined>({ main: main, environments: undefined })
