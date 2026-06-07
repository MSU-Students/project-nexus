import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ name: 'user_role', nullable: true })
  userRole?: string;

  @Column()
  action: string;

  @Column({ name: 'affected_module' })
  affectedModule: string;

  @Column({ name: 'affected_table', nullable: true })
  affectedTable?: string;

  @Column({ name: 'affected_record_id', nullable: true })
  affectedRecordId?: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: any;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'device_info', nullable: true })
  deviceInfo?: string;

  @CreateDateColumn({ name: 'timestamp', type: 'timestamptz' })
  timestamp: Date;
}
