import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoginedGuard implements CanActivate{
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        if(!req.isAuthenticated()){
            throw new UnauthorizedException("please login first")
        }
        return true
    }
}