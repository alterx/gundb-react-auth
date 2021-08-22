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
    gunOpts: any;
    [key: string]: any;
};
declare const GunProvider: ({ peers, Gun, sea, keyFieldName, storage, gunOpts, ...props }: ProviderOpts) => any;
declare function useAuth(): any;
export { GunProvider, useAuth };
