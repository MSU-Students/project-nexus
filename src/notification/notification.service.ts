import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

export interface NotificationPayload {
    to: string[];           // email addresses
    phones?: string[];      // PH phone numbers e.g. ['09171234567']
    subject: string;
    html: string;
    text?: string;
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private transporter: nodemailer.Transporter;

    constructor(private config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.config.get<string>('MAIL_HOST'),
            port: this.config.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
                user: this.config.get<string>('MAIL_USER'),
                pass: this.config.get<string>('MAIL_PASS'),
            },
        });
    }

    async sendEmail(payload: NotificationPayload): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: this.config.get<string>('MAIL_FROM'),
                to: payload.to.join(', '),
                subject: payload.subject,
                html: payload.html,
                text: payload.text,
            });
            this.logger.log(`Email sent to: ${payload.to.join(', ')}`);
        } catch (err) {
            this.logger.error(`Failed to send email: ${err.message}`);
        }
    }

    async sendSms(phones: string[], message: string): Promise<void> {
        const apiKey = this.config.get<string>('SEMAPHORE_API_KEY');
        const senderName = this.config.get<string>('SEMAPHORE_SENDER_NAME', 'NEXUS');

        for (const number of phones) {
            try {
                await axios.post('https://api.semaphore.co/api/v4/messages', {
                    apikey: apiKey,
                    number,
                    message,
                    sendername: senderName,
                });
                this.logger.log(`SMS sent to: ${number}`);
            } catch (err) {
                this.logger.error(`Failed to send SMS to ${number}: ${err.message}`);
            }
        }
    }

    async notify(payload: NotificationPayload): Promise<void> {
        await this.sendEmail(payload);
        if (payload.phones && payload.phones.length > 0) {
            await this.sendSms(payload.phones, payload.text ?? payload.subject);
        }
    }
}