export class LoginDto {
    readonly jwtToken: string;
    readonly  refreshToken: string;
    readonly expiresIn: number;
}