import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';
import { DatabaseService } from 'src/database/database.service';
import { CreateGroupDto } from './dto/createGroupDto';
import { GroupService } from './group.service';


@UsePipes(ValidationPipe)
@Controller('group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService
    ){}

    @UseGuards(LoginedGuard)
    @Post()
    createGroup(@Req() req, @Body() body: CreateGroupDto){
       return this.groupService.createGroup(req.user.userId, body.groupName, body.teams);
    }

    @UseGuards(LoginedGuard)
    @Delete(':groupId')
    deleteGroup(@Req()req, @Param('groupId') groupId: string){
        return this.groupService.deleteGroup(req.user.userId, +groupId);
    }

    @UseGuards(LoginedGuard)
    @Get(':groupId')
    getGroupInfo(@Req() req, @Param('groupId') groupId: string){
        return this.groupService.getGroupInfo(req.user.userId, +groupId);
    }

    @UseGuards(LoginedGuard)
    @Get('contest/:groupId')
    getGroupContest(@Req() req, @Param('groupId') groupId: string){
        return this.groupService.getGroupContest(req.user.userId, +groupId);
    }

    @UseGuards(LoginedGuard)
    @Get()
    getAllGroupInfo(@Req() req){
        return this.groupService.getAllGroupInfo(req.user.userId);
    }
}
