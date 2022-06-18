export const isClient = typeof window !== 'undefined'

const toString = Object.prototype.toString
export const isString = (val: unknown): val is string => toString.call(val) === '[object String]'