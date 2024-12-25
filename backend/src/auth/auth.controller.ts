import { Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './utils/guards/LocalGuard';

@Controller('auth')
export class AuthController {

    
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(){
        return true;
    }

    @Delete('logout')
    logout(@Request() req){
        req.logout((err) => {
            if(err){
                throw err
            }
        });
        return 'logout succeeded'
    }
}
