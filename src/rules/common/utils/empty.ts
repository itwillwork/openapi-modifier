export const isNonNil = <V>(v: V): v is NonNullable<V> => {
    return v !== undefined && v !== null;
};