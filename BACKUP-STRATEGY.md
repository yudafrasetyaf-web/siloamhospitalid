# 💾 Backup & Disaster Recovery Strategy

**ISO 27001 Compliance**: A.12.3.1, A.17.1.1, A.17.1.2  
**Date**: 2025-10-04

---

## 📋 Backup Policy

### **1. Database Backups**

**Frequency**: 
- Full backup: Daily at 02:00 AM
- Incremental: Every 6 hours
- Transaction logs: Every 15 minutes

**Retention**:
- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months
- Yearly backups: 7 years (healthcare compliance)

**Storage Locations**:
- Primary: AWS S3 (encrypted at rest)
- Secondary: Azure Blob Storage (geo-redundant)
- Tertiary: On-premise NAS (encrypted)

**Automation Script** (PostgreSQL):
```bash
#!/bin/bash
# File: backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="hospital_db"
DB_USER="hospital_admin"

# Full backup
pg_dump -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/full_$DATE.backup"

# Encrypt backup
gpg --encrypt --recipient backup@siloam.com "$BACKUP_DIR/full_$DATE.backup"

# Upload to S3
aws s3 cp "$BACKUP_DIR/full_$DATE.backup.gpg" s3://siloam-backups/database/

# Delete local backup older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: full_$DATE.backup.gpg"
```

**Cron Schedule**:
```cron
# Daily full backup at 2 AM
0 2 * * * /scripts/backup-database.sh

# Incremental every 6 hours
0 */6 * * * /scripts/backup-incremental.sh

# Transaction logs every 15 minutes
*/15 * * * * /scripts/backup-wal.sh
```

---

### **2. Application Code Backups**

**Method**: Git-based version control
- Repository: GitHub (private)
- Backup: GitLab mirror (hourly sync)
- Archive: Tar.gz weekly snapshots

**Script**:
```bash
#!/bin/bash
# Weekly code snapshot

DATE=$(date +%Y%m%d)
tar -czf "/backups/code/siloam-hospital-$DATE.tar.gz" /app
gpg --encrypt --recipient backup@siloam.com "/backups/code/siloam-hospital-$DATE.tar.gz"
aws s3 cp "/backups/code/siloam-hospital-$DATE.tar.gz.gpg" s3://siloam-backups/code/
```

---

### **3. File Storage Backups**

**Frequency**: Continuous replication + daily snapshots

**Script**:
```bash
#!/bin/bash
# Backup uploaded files (medical images, documents)

rsync -avz --delete /app/uploads/ backup-server:/backups/uploads/
aws s3 sync /app/uploads/ s3://siloam-medical-files/ --storage-class GLACIER
```

---

## 🔄 Disaster Recovery Plan

### **Recovery Time Objective (RTO)**: 4 hours
### **Recovery Point Objective (RPO)**: 15 minutes

### **Step-by-Step Recovery Procedure**

#### **Scenario 1: Database Corruption**

1. **Stop application**:
   ```bash
   systemctl stop siloam-backend
   ```

2. **Download latest backup**:
   ```bash
   aws s3 cp s3://siloam-backups/database/full_YYYYMMDD.backup.gpg .
   gpg --decrypt full_YYYYMMDD.backup.gpg > full_YYYYMMDD.backup
   ```

3. **Restore database**:
   ```bash
   dropdb hospital_db
   createdb hospital_db
   pg_restore -U hospital_admin -d hospital_db full_YYYYMMDD.backup
   ```

4. **Apply transaction logs** (if available):
   ```bash
   pg_waldump -p /backups/wal/ | psql -d hospital_db
   ```

5. **Verify data integrity**:
   ```bash
   psql -d hospital_db -c "SELECT COUNT(*) FROM users;"
   psql -d hospital_db -c "SELECT COUNT(*) FROM appointments;"
   ```

6. **Restart application**:
   ```bash
   systemctl start siloam-backend
   ```

#### **Scenario 2: Complete Server Failure**

1. **Provision new server** (via Infrastructure as Code):
   ```bash
   terraform apply -var="environment=disaster-recovery"
   ```

2. **Deploy application**:
   ```bash
   git clone https://github.com/siloam/hospital-system.git
   cd hospital-system
   docker-compose up -d
   ```

3. **Restore database** (see Scenario 1)

4. **Restore file uploads**:
   ```bash
   aws s3 sync s3://siloam-medical-files/ /app/uploads/
   ```

5. **Update DNS** (failover to DR server):
   ```bash
   aws route53 change-resource-record-sets --hosted-zone-id Z123 --change-batch file://dns-update.json
   ```

6. **Verify all services**:
   ```bash
   curl https://api.siloamhospital.com/health
   ```

---

## ✅ Testing & Validation

### **Monthly Backup Tests**
- Restore random backup to staging environment
- Verify data integrity
- Document recovery time
- Update procedures if needed

### **Quarterly Disaster Recovery Drills**
- Full failover to DR site
- Test all recovery procedures
- Update runbooks
- Train team members

---

## 📊 Monitoring & Alerts

**Backup Monitoring**:
```bash
# Check if backup completed successfully
if [ ! -f "/backups/postgres/full_$(date +%Y%m%d)*.backup" ]; then
  send_alert "Database backup failed on $(date)"
fi
```

**Alerts**:
- Backup failure: Immediate PagerDuty alert
- Backup size anomaly: Email to DevOps
- Encryption failure: Critical Slack notification
- S3 upload failure: Auto-retry + alert

---

## 🔐 Security

**Encryption**:
- At-rest: AES-256
- In-transit: TLS 1.3
- Backup files: GPG encryption

**Access Control**:
- Backups accessible only to: DevOps, DBA, Security team
- MFA required for S3 access
- Audit logging for all backup operations

---

## 📝 Compliance Checklist

- [x] Daily backups automated
- [x] Encrypted backups
- [x] Off-site storage (3-2-1 rule)
- [x] Tested recovery procedures
- [x] Documented RTO/RPO
- [x] Access controls implemented
- [x] Audit logging enabled
- [x] Retention policy enforced
- [x] Quarterly DR drills scheduled

---

**Owner**: DevOps Team  
**Review Frequency**: Quarterly  
**Last Updated**: 2025-10-04
