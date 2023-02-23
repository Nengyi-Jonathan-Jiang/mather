export function cast<U, T = any>(value: T) : U {
    return value as unknown as U;
}
export function log<T>(value: T) : T {
    console.log(value);
    return value;
}