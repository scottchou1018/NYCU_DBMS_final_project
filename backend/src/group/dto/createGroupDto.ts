import { empty } from "@prisma/client/runtime/library";
import { IsArray, IsInt, IsNotEmpty, IsString, ArrayMinSize, IsOptional } from "class-validator";


export class CreateGroupDto{

    @IsString()
    @IsNotEmpty()
    public readonly groupName: string;

    @IsArray()
    @IsInt({each: true})
    @ArrayMinSize(1)
    public readonly teams: number[];
}

export class UpdateGroupDto{

    @IsOptional()
    @IsString()
    public readonly groupName?: string;

    @IsOptional()
    @IsArray()
    @IsInt({each: true})
    @ArrayMinSize(1)
    public readonly teams?: number[];
}