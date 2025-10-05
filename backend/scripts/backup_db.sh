#!/bin/bash
# Script: backup_db.sh
# Fungsi: Backup database SQLite/PostgreSQL
# Usage: ./backup_db.sh [backup_dir]

set -e

BACKUP_DIR=${1:-./db_backups}
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

# Jika menggunakan SQLite
db_file="./database.sqlite"
if [ -f "$db_file" ]; then
  cp "$db_file" "$BACKUP_DIR/backup_$DATE.sqlite"
  echo "SQLite database backed up to $BACKUP_DIR/backup_$DATE.sqlite"
  exit 0
fi

# Jika menggunakan PostgreSQL
if command -v pg_dump > /dev/null; then
  DB_NAME=${DB_NAME:-siloam_db}
  DB_USER=${DB_USER:-postgres}
  DB_HOST=${DB_HOST:-localhost}
  DB_PORT=${DB_PORT:-5432}
  PGPASSWORD=${DB_PASSWORD:-password} pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" > "$BACKUP_DIR/backup_$DATE.sql"
  echo "PostgreSQL database backed up to $BACKUP_DIR/backup_$DATE.sql"
  exit 0
fi

echo "No supported database found or pg_dump not installed."
exit 1
