/**
 * Advisor-Advisee Matching Audit Helper
 *
 * Integrates advisor matching events into the central CLUTCHER audit trail
 * by delegating to ArchiveLogService instead of logging to console only.
 *
 * Usage: inject AdvisorMatchingAuditHelper where advisor assignment logic runs,
 * then call logAdvisorAssigned() / logAdvisorRemoved() after the DB operation.
 */
import { Injectable } from '@nestjs/common';
import { ArchiveLogService } from 'src/archive-logs/archive-log.service';
import { AuditAction } from 'src/enums';

@Injectable()
export class AdvisorMatchingAuditHelper {
  constructor(private readonly archiveLogService: ArchiveLogService) {}

  /**
   * Log an ASSIGN_ADVISER event.
   *
   * @param actorId    - ID of the user who performed the assignment
   * @param actorRole  - Role of the actor (e.g. 'admin', 'coordinator')
   * @param advisorId  - ID of the adviser entity being assigned
   * @param adviseeId  - ID of the student/project being assigned to
   * @param assignmentId - ID of the resulting AdviserAssignment record
   * @param metadata   - Any extra context (reason, etc.)
   */
  async logAdvisorAssigned(
    actorId: number,
    actorRole: string,
    advisorId: number,
    adviseeId: number | string,
    assignmentId?: number,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    await this.archiveLogService.create({
      entityType: 'AdviserAssignment',
      entityId: assignmentId !== undefined ? String(assignmentId) : String(advisorId),
      action: AuditAction.ASSIGN_ADVISER,
      userRole: actorRole,
      changedById: actorId,
      newValues: {
        advisorId,
        adviseeId,
        ...metadata,
      },
    });
  }

  /**
   * Log a REMOVE_ADVISER event.
   *
   * @param actorId      - ID of the user who removed the assignment
   * @param actorRole    - Role of the actor
   * @param advisorId    - ID of the adviser being removed
   * @param adviseeId    - ID of the student/project
   * @param assignmentId - ID of the AdviserAssignment record that was removed
   * @param metadata     - Any extra context (reason, etc.)
   */
  async logAdvisorRemoved(
    actorId: number,
    actorRole: string,
    advisorId: number,
    adviseeId: number | string,
    assignmentId?: number,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    await this.archiveLogService.create({
      entityType: 'AdviserAssignment',
      entityId: assignmentId !== undefined ? String(assignmentId) : String(advisorId),
      action: AuditAction.REMOVE_ADVISER,
      userRole: actorRole,
      changedById: actorId,
      oldValues: {
        advisorId,
        adviseeId,
        ...metadata,
      },
    });
  }
}
