export declare class StateService {
    private static instance;
    private state;
    private listeners;
    constructor();
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    delete(key: string): boolean;
    getAll(): Record<string, any>;
    clear(): void;
    size(): number;
    update(key: string, updater: (current: any) => any): void;
    increment(key: string, amount?: number): number;
    decrement(key: string, amount?: number): number;
    push(key: string, value: any): void;
    remove(key: string, value: any): void;
    setProperty(key: string, property: string, value: any): void;
    removeProperty(key: string, property: string): void;
    subscribe(key: string, callback: (value: any) => void): () => void;
    private notifyListeners;
    getKeys(pattern?: string): string[];
    setMultiple(updates: Record<string, any>): void;
    getMultiple(keys: string[]): Record<string, any>;
    backup(): string;
    restore(backup: string): void;
}
