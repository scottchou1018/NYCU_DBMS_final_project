import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ContestService {
    constructor(private readonly databaseService: DatabaseService){}
    

    async getContest(contestId: number){
        const contest = await this.databaseService.contest.findUnique({
            where:{
                contestId: contestId
            }
        })
        if(!contest){
            throw new BadRequestException('the contestId not found')
        }
        return contest
    }

    /**
     * if the contest haven't existed in database, then it will create one
     * then it will return the contest data in the database
     * @param contestId the contest id in codeforces
     * @param contestName the name of the contest
     */
    async checkOrCreateContest(contestId: number, contestName: string){
        let contest = await this.databaseService.contest.findUnique({
            where: {
                contestId: contestId
            }
        })
        if(!contest){
            contest = await this.databaseService.contest.create({
                data:{
                    contestId: contestId,
                    contestName: contestName
                }
            })
        }
        return contest
    }
}
