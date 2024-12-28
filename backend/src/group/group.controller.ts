import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';
import { DatabaseService } from 'src/database/database.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/createGroupDto';
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
    @Patch(':groupId')
    updateGroup(@Req()req, @Param('groupId') groupId: string, @Body() body: UpdateGroupDto){
        return this.groupService.updateGroup(req.user.userId, +groupId, body);
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
