import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [DatabaseModule, TeamModule],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
