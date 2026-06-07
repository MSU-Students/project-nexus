import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AUDIT_EVENT_KEY, AuditEventOptions } from 'src/decorators/audit-event.decorator';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = this.reflector.getAllAndOverride<AuditEventOptions>(
      AUDIT_EVENT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!meta) {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '';
    const deviceInfo = req.headers['user-agent'] || '';

    return next.handle().pipe(
      tap(async (response) => {
        try {
          let userId: number | undefined;
          let username: string | undefined;
          let userRole: string | undefined;

          // If user is authenticated, req.user is populated by AuthGuard
          const reqUser = (req as any).user;
          if (reqUser) {
            userId = reqUser.sub || reqUser.id;
            username = reqUser.username;
            userRole = reqUser.roles && reqUser.roles.length > 0 ? reqUser.roles[0] : undefined;
          }

          // Handle successful login where token is returned
          if (meta.action === 'LOGIN' && response && response.access_token) {
            try {
              const decoded = this.jwtService.decode(response.access_token) as any;
              if (decoded) {
                userId = decoded.sub || decoded.id;
                username = decoded.username;
                userRole = decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : undefined;
              }
            } catch (err) {
              // Ignore decoding errors
            }
          }

          // Determine affected record ID
          let affectedRecordId: string | undefined;
          if (req.params && req.params.id) {
            affectedRecordId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          }
          if (!affectedRecordId && response && response.id) {
            affectedRecordId = String(response.id);
          }

          // Sanitize details to avoid logging passwords
          const details = { ...req.body };
          if (details.password) {
            details.password = '********';
          }

          await this.auditService.logAction({
            userId,
            username,
            userRole,
            action: meta.action,
            affectedModule: meta.module,
            affectedTable: meta.table,
            affectedRecordId,
            details,
            ipAddress,
            deviceInfo,
          });
        } catch (err) {
          // Prevent audit logging failures from breaking main flow
          console.error('Audit log insertion failed:', err);
        }
      }),
      catchError((err) => {
        // Log failed login attempts
        if (meta.action === 'LOGIN') {
          try {
            const attemptedUsername = req.body?.username;
            const details = { ...req.body };
            if (details.password) {
              details.password = '********';
            }
            // Fire-and-forget logging
            this.auditService.logAction({
              username: attemptedUsername,
              action: 'LOGIN_FAILED',
              affectedModule: meta.module,
              affectedTable: meta.table,
              details,
              ipAddress,
              deviceInfo,
            }).catch((e) => console.error('Failed to log failed login attempt:', e));
          } catch (e) {
            console.error('Failed to process failed login attempt log:', e);
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
