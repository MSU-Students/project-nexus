import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { ArchiveLogService } from './archive-log.service';
import { Request } from 'express';
import { AuditAction } from 'src/enums';

import { Manuscript } from 'src/entities/manuscript.entity';
import { DefenseSchedule } from 'src/entities/defense-schedule.entity';
import { AdviserAssignment } from 'src/entities/adviser-assignment.entity';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';
import { ProjectMilestone } from 'src/entities/project-milestone.entity';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly archiveLogService: ArchiveLogService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const { method, url, body, params } = request;

    // Extract user details from the request (populated by AuthGuard)
    let userId: number | undefined = request['user']?.sub ?? request['user']?.id;
    let userRole: string | undefined = request['user']?.roles?.[0] ?? request['user']?.role;

    const ipAddress = request.ip || (request.headers['x-forwarded-for'] as string) || '';
    const deviceInfo = request.headers['user-agent'] || '';

    let entityType: string | undefined;
    let entityId: string | number | undefined;
    let action: string | undefined;
    let oldValues: any = null;

    const cleanUrl = url.split('?')[0];

    // --- BEFORE CONTROLLER EXECUTION ---
    // Fetch the pre-existing state for update or delete operations
    try {
      const getRawIdStr = (): string => {
        if (!params || !params.id) {
          return cleanUrl.split('/').pop() || '';
        }
        return Array.isArray(params.id) ? params.id[0] : params.id;
      };

      const rawIdStr = getRawIdStr();

      if (cleanUrl.match(/^\/defense-schedules\/\d+$/)) {
        const id = parseInt(rawIdStr || '0', 10);
        entityType = 'DefenseSchedule';
        entityId = id;
        if (method === 'PATCH' || method === 'PUT') {
          action = AuditAction.UPDATE_DEFENSE_SCHEDULE;
          oldValues = await this.entityManager.findOne(DefenseSchedule, { where: { id } });
        } else if (method === 'DELETE') {
          action = AuditAction.DELETE_DEFENSE_SCHEDULE;
          oldValues = await this.entityManager.findOne(DefenseSchedule, { where: { id } });
        }
      } else if (cleanUrl.match(/^\/manuscripts\/[0-9a-fA-F-]{36}$/)) {
        const id = rawIdStr;
        entityType = 'Manuscript';
        entityId = id;
        if (method === 'DELETE') {
          action = AuditAction.DELETE_MANUSCRIPT;
          oldValues = await this.entityManager.findOne(Manuscript, { where: { id } });
        } else if (method === 'PATCH' || method === 'PUT') {
          // Capture pre-update snapshot for UPDATE_MANUSCRIPT
          action = AuditAction.UPDATE_MANUSCRIPT;
          oldValues = await this.entityManager.findOne(Manuscript, { where: { id } });
        }
      } else if (cleanUrl.match(/^\/assignments\/\d+$/)) {
        const id = parseInt(rawIdStr || '0', 10);
        entityType = 'AdviserAssignment';
        entityId = id;
        if (method === 'DELETE') {
          action = AuditAction.REMOVE_ADVISER;
          oldValues = await this.entityManager.findOne(AdviserAssignment, { where: { id } });
        }
      } else if (cleanUrl === '/panel-assignments' && method === 'DELETE') {
        entityType = 'PanelAssignment';
        const scheduleId = body?.scheduleId;
        const facultyId = body?.facultyId;
        if (scheduleId && facultyId) {
          const record = await this.entityManager.findOne(PanelAssignment, {
            where: { schedule: { id: scheduleId }, faculty: { id: facultyId } },
          });
          if (record) {
            entityId = record.id;
            action = AuditAction.REMOVE_PANELIST;
            oldValues = record;
          }
        }
      } else if (cleanUrl.match(/^\/milestones\/\d+\/(approve|reject)$/)) {
        const parts = cleanUrl.split('/');
        const id = parseInt(parts[parts.length - 2], 10);
        entityType = 'ProjectMilestone';
        entityId = id;
        action = cleanUrl.endsWith('approve')
          ? AuditAction.APPROVE_MILESTONE
          : AuditAction.REJECT_MILESTONE;
        oldValues = await this.entityManager.findOne(ProjectMilestone, { where: { id } });
      }
    } catch (err) {
      console.error('AuditLogInterceptor pre-query error:', err);
    }

    // --- AFTER CONTROLLER EXECUTION ---
    return next.handle().pipe(
      tap(async (response) => {
        try {
          let newValues: any = null;

          // LOGIN action: decode JWT from response
          if (cleanUrl === '/auth/login' && method === 'POST' && response?.access_token) {
            try {
              const decoded: any = this.jwtService.decode(response.access_token);
              if (decoded) {
                userId = decoded.sub;
                userRole = decoded.roles?.[0] || decoded.role;
                entityType = 'User';
                entityId = decoded.sub;
                action = AuditAction.LOGIN;
                newValues = { email: decoded.email };
              }
            } catch (jwtErr) {
              console.error('AuditLogInterceptor login JWT decode error:', jwtErr);
            }
          }

          // LOGOUT action
          else if (cleanUrl === '/auth/logout' && method === 'POST') {
            action = AuditAction.LOGOUT;
            entityType = 'User';
            entityId = userId;
          }

          // MANUSCRIPT Create / Upload
          else if (cleanUrl === '/manuscripts' && method === 'POST' && response) {
            entityType = 'Manuscript';
            entityId = response.id;
            action = AuditAction.CREATE_MANUSCRIPT;
            newValues = response;
          } else if (cleanUrl === '/manuscripts/upload' && method === 'POST' && response) {
            entityType = 'Manuscript';
            entityId = response.id;
            action = AuditAction.UPLOAD_MANUSCRIPT;
            newValues = response;
          }

          // MANUSCRIPT Update — newValues from the controller response
          else if (
            cleanUrl.match(/^\/manuscripts\/[0-9a-fA-F-]{36}$/) &&
            (method === 'PATCH' || method === 'PUT') &&
            response
          ) {
            // action & oldValues already set in the pre-execution block above
            newValues = response;
          }

          // DEFENSE SCHEDULE Create / Update
          else if (cleanUrl === '/defense-schedules' && method === 'POST' && response) {
            entityType = 'DefenseSchedule';
            entityId = response.id;
            action = AuditAction.CREATE_DEFENSE_SCHEDULE;
            newValues = response;
          } else if (
            cleanUrl.match(/^\/defense-schedules\/\d+$/) &&
            (method === 'PATCH' || method === 'PUT') &&
            response
          ) {
            newValues = response;
          }

          // ADVISOR ASSIGNMENT Assign
          else if (cleanUrl === '/assignments' && method === 'POST' && response) {
            entityType = 'AdviserAssignment';
            entityId = response.id;
            action = AuditAction.ASSIGN_ADVISER;
            newValues = response;
          }

          // PANEL ASSIGNMENT Assign
          else if (cleanUrl === '/panel-assignments' && method === 'POST' && response) {
            entityType = 'PanelAssignment';
            entityId = response.id;
            action = AuditAction.ASSIGN_PANELIST;
            newValues = response;
          }

          // MILESTONE Approve/Reject
          else if (cleanUrl.match(/^\/milestones\/\d+\/(approve|reject)$/) && response) {
            newValues = response;
          }

          // Write audit log if action matches
          if (action && entityType) {
            await this.archiveLogService.create({
              entityType,
              entityId: entityId !== undefined ? String(entityId) : '0',
              action,
              userRole,
              ipAddress,
              deviceInfo,
              changedById: userId,
              oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : undefined,
              newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : undefined,
            });
          }
        } catch (logErr) {
          console.error('AuditLogInterceptor logging post-execution error:', logErr);
        }
      }),
    );
  }
}
