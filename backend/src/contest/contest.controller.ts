import { Controller, Get, Param } from '@nestjs/common';
import { ContestService } from './contest.service';

@Controller('contest')
export class ContestController {
    constructor(private readonly contestService: ContestService){}

    @Get(':contestId')
    getContest(@Param('contestId') contestId: string){
        return this.contestService.getContest(+contestId)
    }
}
