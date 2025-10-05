import nodemailer from 'nodemailer';
import logger from './logger';

export interface AlertConfig {
  email: {
    enabled: boolean;
    recipients: string[];
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };
  webhook: {
    enabled: boolean;
    url: string;
    secret: string;
  };
  slack: {
    enabled: boolean;
    webhookUrl: string;
    channel: string;
  };
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'security' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  metadata?: any;
  resolved?: boolean;
  resolvedAt?: Date;
}

class AlertingService {
  private config: AlertConfig;
  private alerts: Map<string, Alert> = new Map();
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.config = {
      email: {
        enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
        recipients: (process.env.ALERT_EMAIL_RECIPIENTS || '').split(','),
        smtp: {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
          }
        }
      },
      webhook: {
        enabled: process.env.ALERT_WEBHOOK_ENABLED === 'true',
        url: process.env.ALERT_WEBHOOK_URL || '',
        secret: process.env.ALERT_WEBHOOK_SECRET || ''
      },
      slack: {
        enabled: process.env.ALERT_SLACK_ENABLED === 'true',
        webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
        channel: process.env.SLACK_CHANNEL || '#alerts'
      }
    };

    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter(): void {
    if (this.config.email.enabled && this.config.email.smtp.auth.user) {
      this.emailTransporter = nodemailer.createTransporter(this.config.email.smtp);
    }
  }

  // Create and send alert
  async createAlert(
    type: Alert['type'],
    severity: Alert['severity'],
    title: string,
    message: string,
    metadata?: any
  ): Promise<string> {
    const alert: Alert = {
      id: this.generateAlertId(),
      type,
      severity,
      title,
      message,
      timestamp: new Date(),
      metadata,
      resolved: false
    };

    this.alerts.set(alert.id, alert);

    // Log the alert
    logger.error(`ALERT [${severity.toUpperCase()}] ${title}: ${message}`, {
      alertId: alert.id,
      type,
      severity,
      metadata
    });

    // Send notifications
    await this.sendNotifications(alert);

    return alert.id;
  }

  // Resolve alert
  async resolveAlert(alertId: string, resolutionMessage?: string): Promise<boolean> {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.resolved = true;
    alert.resolvedAt = new Date();

    logger.info(`Alert resolved: ${alertId}`, {
      alertId,
      title: alert.title,
      resolutionMessage
    });

    // Send resolution notification
    await this.sendResolutionNotification(alert, resolutionMessage);

    return true;
  }

  // Get all alerts
  getAlerts(filter?: { type?: Alert['type']; severity?: Alert['severity']; resolved?: boolean }): Alert[] {
    let alerts = Array.from(this.alerts.values());

    if (filter) {
      if (filter.type) {
        alerts = alerts.filter(alert => alert.type === filter.type);
      }
      if (filter.severity) {
        alerts = alerts.filter(alert => alert.severity === filter.severity);
      }
      if (filter.resolved !== undefined) {
        alerts = alerts.filter(alert => alert.resolved === filter.resolved);
      }
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get alert by ID
  getAlert(alertId: string): Alert | undefined {
    return this.alerts.get(alertId);
  }

  // Send notifications
  private async sendNotifications(alert: Alert): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.config.email.enabled) {
      promises.push(this.sendEmailAlert(alert));
    }

    if (this.config.webhook.enabled) {
      promises.push(this.sendWebhookAlert(alert));
    }

    if (this.config.slack.enabled) {
      promises.push(this.sendSlackAlert(alert));
    }

    await Promise.allSettled(promises);
  }

  // Send email alert
  private async sendEmailAlert(alert: Alert): Promise<void> {
    if (!this.emailTransporter || this.config.email.recipients.length === 0) {
      return;
    }

    try {
      const severityEmoji = this.getSeverityEmoji(alert.severity);
      const htmlContent = this.generateEmailHtml(alert);

      await this.emailTransporter.sendMail({
        from: this.config.email.smtp.auth.user,
        to: this.config.email.recipients.join(', '),
        subject: `${severityEmoji} [${alert.severity.toUpperCase()}] ${alert.title}`,
        html: htmlContent
      });

      logger.info('Email alert sent successfully', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send email alert', { alertId: alert.id, error });
    }
  }

  // Send webhook alert
  private async sendWebhookAlert(alert: Alert): Promise<void> {
    if (!this.config.webhook.url) {
      return;
    }

    try {
      const response = await fetch(this.config.webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.webhook.secret}`
        },
        body: JSON.stringify({
          alertId: alert.id,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          timestamp: alert.timestamp,
          metadata: alert.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`);
      }

      logger.info('Webhook alert sent successfully', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send webhook alert', { alertId: alert.id, error });
    }
  }

  // Send Slack alert
  private async sendSlackAlert(alert: Alert): Promise<void> {
    if (!this.config.slack.webhookUrl) {
      return;
    }

    try {
      const severityEmoji = this.getSeverityEmoji(alert.severity);
      const color = this.getSeverityColor(alert.severity);

      const payload = {
        channel: this.config.slack.channel,
        username: 'Siloam Hospital System',
        icon_emoji: ':hospital:',
        attachments: [{
          color,
          title: `${severityEmoji} ${alert.title}`,
          text: alert.message,
          fields: [
            {
              title: 'Type',
              value: alert.type,
              short: true
            },
            {
              title: 'Severity',
              value: alert.severity.toUpperCase(),
              short: true
            },
            {
              title: 'Timestamp',
              value: alert.timestamp.toISOString(),
              short: true
            }
          ],
          footer: 'Siloam Hospital Management System',
          ts: Math.floor(alert.timestamp.getTime() / 1000)
        }]
      };

      const response = await fetch(this.config.slack.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.status}`);
      }

      logger.info('Slack alert sent successfully', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send Slack alert', { alertId: alert.id, error });
    }
  }

  // Send resolution notification
  private async sendResolutionNotification(alert: Alert, resolutionMessage?: string): Promise<void> {
    if (alert.severity === 'critical' || alert.severity === 'high') {
      // Send resolution notifications for high/critical alerts
      const promises: Promise<void>[] = [];

      if (this.config.email.enabled) {
        promises.push(this.sendEmailResolution(alert, resolutionMessage));
      }

      if (this.config.slack.enabled) {
        promises.push(this.sendSlackResolution(alert, resolutionMessage));
      }

      await Promise.allSettled(promises);
    }
  }

  // Send email resolution
  private async sendEmailResolution(alert: Alert, resolutionMessage?: string): Promise<void> {
    if (!this.emailTransporter || this.config.email.recipients.length === 0) {
      return;
    }

    try {
      const htmlContent = `
        <h2>✅ Alert Resolved</h2>
        <p><strong>Alert ID:</strong> ${alert.id}</p>
        <p><strong>Title:</strong> ${alert.title}</p>
        <p><strong>Severity:</strong> ${alert.severity.toUpperCase()}</p>
        <p><strong>Resolved At:</strong> ${alert.resolvedAt?.toISOString()}</p>
        ${resolutionMessage ? `<p><strong>Resolution:</strong> ${resolutionMessage}</p>` : ''}
      `;

      await this.emailTransporter.sendMail({
        from: this.config.email.smtp.auth.user,
        to: this.config.email.recipients.join(', '),
        subject: `✅ RESOLVED: ${alert.title}`,
        html: htmlContent
      });

      logger.info('Resolution email sent successfully', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send resolution email', { alertId: alert.id, error });
    }
  }

  // Send Slack resolution
  private async sendSlackResolution(alert: Alert, resolutionMessage?: string): Promise<void> {
    if (!this.config.slack.webhookUrl) {
      return;
    }

    try {
      const payload = {
        channel: this.config.slack.channel,
        username: 'Siloam Hospital System',
        icon_emoji: ':white_check_mark:',
        attachments: [{
          color: 'good',
          title: `✅ Alert Resolved: ${alert.title}`,
          text: resolutionMessage || 'Alert has been resolved',
          fields: [
            {
              title: 'Alert ID',
              value: alert.id,
              short: true
            },
            {
              title: 'Severity',
              value: alert.severity.toUpperCase(),
              short: true
            },
            {
              title: 'Resolved At',
              value: alert.resolvedAt?.toISOString() || 'Unknown',
              short: true
            }
          ],
          footer: 'Siloam Hospital Management System',
          ts: Math.floor((alert.resolvedAt || new Date()).getTime() / 1000)
        }]
      };

      await fetch(this.config.slack.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      logger.info('Resolution Slack message sent successfully', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send resolution Slack message', { alertId: alert.id, error });
    }
  }

  // Helper methods
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSeverityEmoji(severity: Alert['severity']): string {
    const emojis = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return emojis[severity];
  }

  private getSeverityColor(severity: Alert['severity']): string {
    const colors = {
      low: 'good',
      medium: 'warning',
      high: 'danger',
      critical: 'danger'
    };
    return colors[severity];
  }

  private generateEmailHtml(alert: Alert): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
          .content { margin: 20px 0; }
          .metadata { background-color: #f1f3f4; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .footer { color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚨 System Alert</h1>
          <p><strong>Alert ID:</strong> ${alert.id}</p>
        </div>
        
        <div class="content">
          <h2>${alert.title}</h2>
          <p>${alert.message}</p>
          
          <div class="metadata">
            <p><strong>Type:</strong> ${alert.type}</p>
            <p><strong>Severity:</strong> ${alert.severity.toUpperCase()}</p>
            <p><strong>Timestamp:</strong> ${alert.timestamp.toISOString()}</p>
            ${alert.metadata ? `<p><strong>Additional Info:</strong> ${JSON.stringify(alert.metadata, null, 2)}</p>` : ''}
          </div>
        </div>
        
        <div class="footer">
          <p>This alert was generated by the Siloam Hospital Management System.</p>
          <p>Please investigate and resolve this issue promptly.</p>
        </div>
      </body>
      </html>
    `;
  }
}

// Create singleton instance
const alertingService = new AlertingService();

// Export convenience functions
export const createAlert = alertingService.createAlert.bind(alertingService);
export const resolveAlert = alertingService.resolveAlert.bind(alertingService);
export const getAlerts = alertingService.getAlerts.bind(alertingService);
export const getAlert = alertingService.getAlert.bind(alertingService);

export default alertingService;
