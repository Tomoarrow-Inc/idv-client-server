export interface TokenResponse {
    accessToken: string;
    expiresIn: number;
    scope?: string;
    tokenType: string;
}
export declare function instanceOfTokenResponse(value: object): boolean;
export declare function TokenResponseFromJSON(json: any): TokenResponse;
export declare function TokenResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): TokenResponse;
export declare function TokenResponseToJSON(value?: TokenResponse | null): any;
