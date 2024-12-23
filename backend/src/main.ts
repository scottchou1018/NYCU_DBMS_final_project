import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from'express-session'
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(Session({
    secret: process.env.SESSION_SECRET,
    resave: false,  
    saveUninitialized:false,
    cookie:{
      // maxAge: configService.get('session').maxAge, //ms
      maxAge: 1000000,
      httpOnly: true,
      secure: false
    }
  }))
  
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
