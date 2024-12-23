import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){}

    async validateUser(username: string, password: string){
        const user = await this.userService.findOne(await this.userService.findID(username))

        if(!user){
            return null;
        }

        let valid = await bcrypt.compare(password, user.password)
        if(!valid){
            return null
        }
        return user
    }
}
