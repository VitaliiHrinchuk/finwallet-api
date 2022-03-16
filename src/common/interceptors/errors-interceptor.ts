import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { AccessDeniedException, EntityNotFoundException, ValidationException } from "../exceptions";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle()
      .pipe(catchError(error => {
        if (error instanceof ValidationException) {
          throw new BadRequestException(error.message ? error.message : error.toArray());
        } else if (error instanceof EntityNotFoundException) {
          throw new NotFoundException(error.message);
        } else if (error instanceof AccessDeniedException) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }));
  }
}
