/**
 * AuditAction — centralized enum for all audit log action strings.
 * Used by AuditLogInterceptor and ArchiveLogService to ensure type-safe,
 * consistent action identifiers across the CLUTCHER audit trail.
 */
export enum AuditAction {
  // --- Authentication ---
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',

  // --- Manuscript ---
  CREATE_MANUSCRIPT = 'CREATE_MANUSCRIPT',
  UPLOAD_MANUSCRIPT = 'UPLOAD_MANUSCRIPT',
  UPDATE_MANUSCRIPT = 'UPDATE_MANUSCRIPT',
  DELETE_MANUSCRIPT = 'DELETE_MANUSCRIPT',

  // --- Defense Schedule ---
  CREATE_DEFENSE_SCHEDULE = 'CREATE_DEFENSE_SCHEDULE',
  UPDATE_DEFENSE_SCHEDULE = 'UPDATE_DEFENSE_SCHEDULE',
  DELETE_DEFENSE_SCHEDULE = 'DELETE_DEFENSE_SCHEDULE',

  // --- Adviser Assignment ---
  ASSIGN_ADVISER = 'ASSIGN_ADVISER',
  REMOVE_ADVISER = 'REMOVE_ADVISER',

  // --- Panel Assignment ---
  ASSIGN_PANELIST = 'ASSIGN_PANELIST',
  REMOVE_PANELIST = 'REMOVE_PANELIST',

  // --- Milestone ---
  APPROVE_MILESTONE = 'APPROVE_MILESTONE',
  REJECT_MILESTONE = 'REJECT_MILESTONE',

  // --- Administrative ---
  ADMIN_ACTION = 'ADMIN_ACTION',
}
