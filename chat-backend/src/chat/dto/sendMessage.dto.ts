import { IsInt, IsString } from "class-validator";

export class SendMessageDto {
  /* @IsInt()
  senderId: number; */

  @IsString()
  content: string; 
}
