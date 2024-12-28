import { Controller, Delete, Get, Post, Request, UseGuards, Req, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './utils/guards/LocalGuard';

@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {

    
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(){
        return true;
    }

    @Get('status')
    async checkLoginStatus(@Request() req, @Res() res: Response) {
      if (req.isAuthenticated()) {
        return res.json({
          status: 'success',
          userId: req.session.passport.user
        });
      }
      return res.json({
        status: 'error',
        message: 'Not logged in'
      });
    }

    @Delete('logout')
    async logout(@Request() req){
        req.logout((err) => {
            if(err){
                throw err
            }
        });
        return 'logout succeeded'
    }
}
