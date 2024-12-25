import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';
import { CFInterface } from 'src/utils/CFInterface.service';

@Injectable()
export class SchedulerService {
    constructor(
        private readonly cfInterface: CFInterface,
        private readonly databaseService: DatabaseService
    ) {}

    @Cron('*/20 * * * * *')
    async teamSubmissionHandle() {
        const teams = await this.databaseService.team.findMany();
        for (const teamId of teams.map(team => team.teamId)) {
            await this.cfInterface.updateTeamSubmission(teamId);
        }

    }
}
