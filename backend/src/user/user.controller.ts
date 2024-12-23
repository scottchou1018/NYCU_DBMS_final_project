import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    createUser(@Body() createUserDto: Prisma.UserCreateInput){

        return this.userService.create(createUserDto);
    }

}
