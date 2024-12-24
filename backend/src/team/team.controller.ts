import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';
import { DatabaseService } from 'src/database/database.service';
import { CreateTeamDto } from './dto/createTeamDto';
import { TeamService } from './team.service';

@UsePipes(ValidationPipe)
@Controller('team')
export class TeamController {
    constructor(
        private readonly teamService: TeamService
    ){}
    
    @UseGuards(LoginedGuard)
    @Post()
    createTeam(@Req() req, @Body() body: CreateTeamDto){
       return this.teamService.createTeam(req.user.userId, body.teamName, body.members);
    }

    @UseGuards(LoginedGuard)
    @Delete(':teamId')
    deleteTeam(@Req()req, @Param('teamId') teamId: string){
        return this.teamService.deleteTeam(req.user.userId, +teamId);
    }

    @UseGuards(LoginedGuard)
    @Get(':teamId')
    getTeamInfo(@Req() req, @Param('teamId') teamId: string){
        return this.teamService.getTeamInfo(req.user.userId, +teamId);
    }
    
    @UseGuards(LoginedGuard)
    @Get()
    getAllTeamInfo(@Req() req){
        return this.teamService.getAllTeamInfo(req.user.userId);
    }
}
