import { BadRequestException, Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    createUser(@Body() createUserDto: Prisma.UserCreateInput){

        return this.userService.create(createUserDto);
    }

    @UseGuards(LoginedGuard)
    @Get('/group')
    getGroups(@Req() req){
        return this.userService.findGroups(req.user.userId)
    }
}
