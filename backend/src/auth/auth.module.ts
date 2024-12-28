import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { LocalStrategy } from './utils/LocalStrategy';
import { UserModule } from 'src/user/user.module';
import { SessionSerializer } from './utils/SessionSerializer';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [DatabaseModule, UserModule, PassportModule.register({session: true})],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy, SessionSerializer]
})
export class AuthModule {}
