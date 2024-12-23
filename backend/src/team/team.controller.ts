import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';
import { DatabaseService } from 'src/database/database.service';
import { CreateTeamDto } from './dto/createTeamDto';

@UsePipes(ValidationPipe)
@Controller('team')
export class TeamController {
    constructor(private readonly databaseService: DatabaseService){}
    
    @UseGuards(LoginedGuard)
    @Post()
    createTeam(@Req() req, @Body() body: CreateTeamDto){
        /*
        todo: 
            verify whether codeforces handles exist or not
        */
        const userId: number = req.user.userId
        
    }
}
