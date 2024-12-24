import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport"
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(private readonly userService: UserService) {
        super()
    }

    serializeUser(user: User, done: (err, user: number) => void) {
        done(null, user.userId);
    }
    async deserializeUser(userId: number, done: (err, user: User) => void) {
        let userDB = await this.userService.findOne(userId)
        if(!userDB){
            return done(new HttpException('user not found', HttpStatus.BAD_REQUEST), null)
        }else{
            return done(null, userDB)
        }
    }
}