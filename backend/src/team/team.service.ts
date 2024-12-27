import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CFInterface } from 'src/utils/CFInterface.service';

@Injectable()
export class TeamService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly cfInterface: CFInterface
    ){}

    async createTeam(userId: number, teamName: string, members: string[]){
         /*
        todo: 
            1. verify whether codeforces handles exist or not
            2. add team submission update
         */

        for(let handle of members){
            let exist = await this.cfInterface.checkHandleExist(handle)
            if(!exist){
                throw new BadRequestException("the handle: " + handle + " does not exist")
            }
        }

        const team = await this.databaseService.team.create({
            data:{
                teamName: teamName,
                userId: userId
            }
        })

        // add CFuser to the team
        for(let handle of members){
            let CFuser = await this.databaseService.cFuser.create({
                data:{
                    handle: handle,
                    lastSubmissionId: 0,
                    teamId: team.teamId
                }
            })
        }
        await this.cfInterface.updateTeamSubmission(team.teamId)
        return team;
    }


    
    async deleteTeam(userId: number, teamId: number){
        
        const team = await this.databaseService.team.findUnique({
            where:{
                teamId: teamId
            }
        })

        if(!team){
            throw new BadRequestException("the team is not found")
        }
        if(team.userId != userId){
            throw new ForbiddenException("this team is not create by you")
        }

        return await this.databaseService.team.delete({
            where:{
                userId: userId,
                teamId: teamId
            }
        })
    }
    

    async getAllTeamInfo(userId: number){
        let teams = await this.databaseService.team.findMany({
            where:{
                userId: userId
            }
        })

        let teams_with_member = []
        for(let team of teams){
            let members_database_format = await this.databaseService.cFuser.findMany({
                select:{
                    handle: true
                },
                where:{
                    teamId: team.teamId
                }
            })

            teams_with_member.push({
                teamId: team.teamId,
                teamName: team.teamName,
                members: this.membersFormatTransform(members_database_format)
            })
        }
        return teams_with_member
    }

    async getTeamInfo(userId: number, teamId: number){
        const team = await this.databaseService.team.findUnique({
            where:{
                teamId: teamId
            }
        })
        if(!team){
            throw new BadRequestException("the team is not found")
        }
        if(team.userId != userId){
            throw new ForbiddenException("this team is not create by you")
        }

        let members_database_format = await this.databaseService.cFuser.findMany({
            select:{
                handle: true
            },
            where:{
                teamId: teamId
            }
        })

        return {
            "teamName": team.teamName,
            "members": this.membersFormatTransform(members_database_format)
        };

    }

    async getTeamContest(userId: number, teamId: number){
        const team = await this.databaseService.team.findUnique({
            where:{
                teamId: teamId
            }
        })

        if(!team){
            throw new BadRequestException("the team is not found")
        }
        if(team.userId != userId){
            throw new ForbiddenException("this team is not create by you")
        }

        const contests = await this.databaseService.participation.findMany({
            where:{
                teamId: teamId
            },
            select:{
                contestId: true
            }
        })

        const contestIds = []
        for(let contest of contests){
            contestIds.push(contest.contestId)
        }

        return {
            "contests": contestIds
        };
    }

    // transform the members database format to return format
    membersFormatTransform(members_database_format){
        let return_format = []
        for(let member of members_database_format){
            return_format.push(member.handle)
        }
        return return_format
    }


}
