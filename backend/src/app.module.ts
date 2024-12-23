import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { TeamModule } from './team/team.module';
import { ContestModule } from './contest/contest.module';
import { ScoreboardModule } from './scoreboard/scoreboard.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [UserModule, GroupModule, TeamModule, ContestModule, ScoreboardModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
