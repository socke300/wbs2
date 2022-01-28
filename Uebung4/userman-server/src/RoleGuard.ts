import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Rights} from "./Model/Rights";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {

    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<Rights>('rights', context.getHandler());
        const request = context.switchToHttp().getRequest();
        if(request.session.user){
            return request.session.user.rights >= requiredRole;
        }else return false
    }
}