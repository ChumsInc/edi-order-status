export interface AppStorage {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
    delete: (key: string) => void;
}
export interface StorageKeys {
    [key: string]: string;
}
export declare const appStorage: AppStorage;
export declare const STORAGE_KEYS: {
    ROWS_PER_PAGE: string;
    AUTO_REFRESH: string;
};
