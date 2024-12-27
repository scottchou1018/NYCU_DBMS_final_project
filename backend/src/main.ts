import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from'express-session'
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(Session({
    secret: process.env.SESSION_SECRET,
    resave: false,  
    saveUninitialized: false,
    cookie:{
      // maxAge: configService.get('session').maxAge, //ms
      maxAge: 1000000,
      httpOnly: true,
      secure: false,
    }
  }))
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(3000);
}
bootstrap();
