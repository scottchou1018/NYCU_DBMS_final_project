import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { get } from 'http';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ScoreboardService {
    constructor(private readonly databaseService: DatabaseService){}
    
    async getScoreboardOfGroup(userId: number, groupId: number, contestId: number){
        const group = await this.databaseService.group.findUnique({
            where:{
                groupId: groupId
            }
        })

        if(!group){
            throw new BadRequestException("the group doesn't exist")
        }
        if(group.userId != userId){
            throw new ForbiddenException(`the group ${groupId} doesn't belong to you`)
        }

        const contest = await this.databaseService.contest.findUnique({
            where:{
                contestId: contestId
            }
        })

        if(!contest){
            throw new BadRequestException("the contest doesn't exist");
        }

        const teams = await this.databaseService.groupTeam.findMany({
            select:{
                team: true
            },
            where: {
                groupId: groupId
            }
        })
        let num_of_team = teams.length
        let participated : boolean[] = new Array<boolean>(num_of_team)
        let first_participation = null

        let teamRank = []
        for(let i = 0; i < num_of_team; i++){
            let participation = await this.databaseService.participation.findFirst({
                where:{
                    teamId: teams[i].team.teamId,
                    contestId: contestId
                }
            })

            if(participation){
                if(!first_participation){
                    first_participation = participation;
                }
                participated[i] = true

                teamRank.push({
                    teamId: teams[i].team.teamId,
                    teamName: teams[i].team.teamName,
                    ACcount: participation.ACcount,
                    penalty: participation.totalPenalty,
                    problemStatus: await this.getProblemResult(participation, contest.problemIndices)
                })
            }
        }
        if(teamRank.length == 0){
            throw new BadRequestException(`there is no team in group ${groupId} which participate in contest ${contestId}`)
        }

        teamRank.sort((a, b) => {
            if(a.ACcount != b.ACcount){
                if(a.ACcount > b.ACcount){
                    return -1
                }else{
                    return 1
                }
            }
            if(a.penalty != b.penalty){
                if(a.penalty < b.penalty){
                    return -1
                }else{
                    return 1
                }
            }
            if(a.teamName == b.teamName)
                return 0
            if(a.teamName > b.teamName)
                return 1
            return -1
        })
        
        return {
            "contestName": contest.contestName,
            "problems": contest.problemIndices,
            "ranks": teamRank
        }
    }
    
    async getProblemResult(participation, problemIndices: string){
        let problemResults = await this.databaseService.problemResult.findMany({
            where:{
                teamId: participation.teamId,
                contestId: participation.contestId
            }
        })

        let resultFormat = {}
        for(let problemResult of problemResults){
            resultFormat[problemResult.problemIndex] = {
                "status": problemResult.status,
                "penalty": problemResult.penalty,
                "triesCount": problemResult.triesCount
            }
        }

        for(let problemIndex of problemIndices){
            if(!resultFormat[problemIndex]){
                resultFormat[problemIndex] = {
                    "status": "UNATTEMPTED",
                    "penalty": 0,
                    "triesCount": 0
                }
            }
        }
        return resultFormat
    }
}
