export class LoginDto {
    readonly tokens: {
        jwtToken: string,
        refreshToken: string,
    };
    readonly expiresIn: number;
}