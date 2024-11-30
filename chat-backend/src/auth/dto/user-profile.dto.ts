import { IsString } from "class-validator";

export class UserProfileDto {
  @IsString()
  username: string;
}