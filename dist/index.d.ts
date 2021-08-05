declare const GunProvider: ({ peers, Gun, sea, keyFieldName, ...props }: {
    [x: string]: any;
    peers: any;
    Gun: any;
    sea: any;
    keyFieldName?: string | undefined;
}) => any;
declare function useAuth(): any;
export { GunProvider, useAuth };
