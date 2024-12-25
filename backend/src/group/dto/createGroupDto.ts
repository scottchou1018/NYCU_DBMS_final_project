import { IsArray, IsInt, IsNotEmpty, IsString, ArrayMinSize } from "class-validator";


export class CreateGroupDto{

    @IsString()
    @IsNotEmpty()
    public readonly groupName: string;

    @IsArray()
    @IsInt({each: true})
    @ArrayMinSize(1)
    public readonly teams: number[];
}