declare type Storage = {
    getItem: (key: string) => any;
    setItem: (key: string, data: string) => any;
    removeItem: (key: string) => any;
};
declare type ProviderOpts = {
    peers: [];
    Gun: any;
    sea: any;
    keyFieldName: string;
    storage: Storage;
    [key: string]: any;
};
declare const GunProvider: ({ peers, Gun, sea, keyFieldName, storage, ...props }: ProviderOpts) => any;
declare function useAuth(): any;
export { GunProvider, useAuth };
