import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class GroupService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly teamService: TeamService
    ) {}

    async createGroup(userId: number, groupName: string, teams: number[]){
        
        // check whether all teams exist or not
        for(let teamId of teams){
            const team = await this.databaseService.team.findUnique({
                where:{
                    teamId: teamId
                }
            })
            if(!team){
                throw new BadRequestException("team not found")
            }
        }

        // create group
        const group = await this.databaseService.group.create({
            data:{
                groupName: groupName,
                userId: userId
            }
        })
        if (!group) {
            throw new Error("group not created")
        }

        // add teams to the group
        for(let teamId of teams){
            await this.databaseService.groupTeam.create({
                data:{
                    teamId: teamId,
                    groupId: group.groupId
                }
            })
        }

        return group;
    }

    async deleteGroup(userId: number, groupId: number){
        
        const group = await this.databaseService.group.findUnique({
            where:{
                groupId: groupId
            }
        })

        if(!group){
            throw new BadRequestException("the group is not found")
        }
        if(group.userId != userId){
            throw new ForbiddenException("this group is not create by you")
        }

        return await this.databaseService.group.delete({
            where:{
                userId: userId,
                groupId: groupId
            }
        })
    }

    async getAllGroupInfo(userId: number){
        let groups = await this.databaseService.group.findMany({
            where:{
                userId: userId
            }
        })

        let groups_with_teams = []
        for(let group of groups){
            let teams_database_format = await this.databaseService.groupTeam.findMany({
                select:{
                    teamId: true
                },
                where:{
                    groupId: group.groupId
                }
            })
            let teams = []
            for(let team of teams_database_format){
                teams.push(team.teamId)
            }
            groups_with_teams.push({
                groupId: group.groupId,
                groupName: group.groupName,
                teams: teams
            })
        }
        return groups_with_teams
    }

    async getGroupInfo(userId: number, groupId: number){
        const group = await this.databaseService.group.findUnique({
            where:{
                groupId: groupId
            }
        })

        if(!group){
            throw new BadRequestException("the group is not found")
        }
        if(group.userId != userId){
            throw new ForbiddenException("this group is not create by you")
        }

        let teams_database_format = await this.databaseService.groupTeam.findMany({
            select:{
                teamId: true
            },
            where:{
                groupId: groupId
            }
        })
        let teams = []
        for(let team of teams_database_format){
            teams.push(team.teamId)
        }
        return {
            groupId: group.groupId,
            groupName: group.groupName,
            teams: teams
        }
    }

    async getGroupContest(userId: number, groupId: number){
        const group = await this.databaseService.group.findUnique({
            where:{
                groupId: groupId
            }
        })

        if(!group){
            throw new BadRequestException("the group is not found")
        }
        if(group.userId != userId){
            throw new ForbiddenException("this group is not create by you")
        }
        
        let contestSet = new Set<number>()
        const groupTeams = await this.databaseService.groupTeam.findMany({
            where:{
                groupId: groupId
            }
        })
        for (let groupTeam of groupTeams){
            const res = await this.teamService.getTeamContest(userId, groupTeam.teamId)
            const contests = res.contests
            for(let contest of contests){
                contestSet.add(contest)
            }
        }
        
        let contestIds = Array.from(contestSet)
        let contests = []
        for(let contestId of contestIds){
            const contest = await this.databaseService.contest.findUnique({
                select:{
                    contestId: true,
                    contestName: true
                },
                where:{
                    contestId: contestId
                }
            })
            contests.push(contest)
        }
        return {
            contests: contests
        }
    }
}
