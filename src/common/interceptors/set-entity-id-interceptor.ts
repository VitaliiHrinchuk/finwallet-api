import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SetEntityIdInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, $next: CallHandler): Observable<any> {
    const request: any = _context.switchToHttp().getRequest();
    console.log(request?.id);
    request.body.id = request?.params?.id;
    return $next.handle();
  }
}
