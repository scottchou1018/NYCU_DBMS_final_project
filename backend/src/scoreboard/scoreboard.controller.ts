import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';
import { ScoreboardService } from './scoreboard.service';

@Controller('scoreboard')
export class ScoreboardController {
    constructor(private readonly scoreboardService: ScoreboardService){}

    @UseGuards(LoginedGuard)
    @Get()
    getScoreboardOfGroup(@Req() req, @Query('groupId') groupId: string, @Query('contestId') contestId: string){
        return this.scoreboardService.getScoreboardOfGroup(req.user.userId, +groupId, +contestId)
    }
}
