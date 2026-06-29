import { Request, Response } from '@nestjs/common';

type AuditAction = 'ADVISOR_ASSIGNED' | 'ADVISOR_REMOVED';

interface AuditLogEntry {
  actorId: string;
  targetId: string;
  action: AuditAction;
  metadata: Record<string, any>;
  timestamp: string;
}

const logMatchingActivity = async (
  actorId: string,
  targetId: string,
  action: AuditAction,
  metadata: Record<string, any> = {},
): Promise<void> => {
  const log: AuditLogEntry = {
    actorId,
    targetId,
    action,
    metadata,
    timestamp: new Date().toISOString(),
  };

  console.log('[AUDIT_LOG]:', JSON.stringify(log, null, 2));
};

export const assignAdvisor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { advisorId, adviseeId } = req.body;

    const actorId = req.user?.id || 'SYSTEM';

    await logMatchingActivity(actorId, advisorId, 'ADVISOR_ASSIGNED', {
      adviseeId,
      reason: 'Standard assignment',
    });

    res.status(200).json({
      success: true,
      message: 'Advisor assigned successfully and activity logged.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign advisor or perform audit logging.',
    });
  }
};
