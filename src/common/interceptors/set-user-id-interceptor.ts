import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SetUserIdInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, $next: CallHandler): Observable<any> {
    const request: any = _context.switchToHttp().getRequest(); //instead of any you could also define a super-class for all DTOs that require the `userId`-property

    const method = request.method;

    if (method == 'GET') {
      request.query.userId = request?.user?.userId;
    } else {
      request.body.userId = request?.user?.userId;
    }

    return $next.handle();
  }
}
