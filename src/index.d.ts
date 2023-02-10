export type StorageHook<V> = [V, (value: V) => void];

export declare function useLocalStorage<V>(
    key: string,
    defaultValue: V,
): StorageHook<V>;

export declare function useLocalStorage<V = undefined>(
    key: string,
): StorageHook<V | undefined>;

export declare function useSessionStorage<V>(
    key: string,
    defaultValue: V,
): StorageHook<V>;

export declare function useSessionStorage<V = undefined>(
    key: string,
): StorageHook<V | undefined>;
