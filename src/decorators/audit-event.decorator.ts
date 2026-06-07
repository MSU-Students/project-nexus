import { SetMetadata } from '@nestjs/common';

export const AUDIT_EVENT_KEY = 'audit_event';

export interface AuditEventOptions {
  action: string;
  module: string;
  table?: string;
}

export const AuditEvent = (options: AuditEventOptions) => SetMetadata(AUDIT_EVENT_KEY, options);
