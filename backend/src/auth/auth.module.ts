import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { LocalStrategy } from './utils/LocalStrategy';
import { UserModule } from 'src/user/user.module';
import { SessionSerializer } from './utils/SessionSerializer';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy, SessionSerializer]
})
export class AuthModule {}
