import { UserSafeDataDto } from "../../user/dtos/userSafeData.dto";

export class TodoAndUserDto {
    readonly title: string;
    readonly date: Date;
    readonly done: boolean;
    readonly user: UserSafeDataDto;
}