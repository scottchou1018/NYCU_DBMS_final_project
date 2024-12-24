import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateTeamDto{
    
    @IsString()
    @IsNotEmpty()
    public readonly teamName: string;

    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1)
    public readonly members: string[];
}