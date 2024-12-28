import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { TeamModule } from './team/team.module';
import { ContestModule } from './contest/contest.module';
import { ScoreboardModule } from './scoreboard/scoreboard.module';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { GroupService } from './group/group.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CFInterface } from './utils/CFInterface.service';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    GroupModule, 
    TeamModule, 
    ContestModule, 
    ScoreboardModule, 
    AuthModule, 
    ScheduleModule.forRoot(), 
    UtilsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({
      session: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, UserService, GroupService, SchedulerService, CFInterface],
})
export class AppModule {}
