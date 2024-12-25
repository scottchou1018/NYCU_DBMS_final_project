import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [TeamService],
  controllers: [TeamController],
  exports: [TeamService]
})
export class TeamModule {}
