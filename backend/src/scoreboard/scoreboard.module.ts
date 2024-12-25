import { Module } from '@nestjs/common';
import { ScoreboardService } from './scoreboard.service';
import { ScoreboardController } from './scoreboard.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ScoreboardService],
  controllers: [ScoreboardController]
})
export class ScoreboardModule {}
