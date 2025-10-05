#!/bin/bash
# Script: restore_db.sh
# Fungsi: Restore database SQLite/PostgreSQL dari backup
# Usage: ./restore_db.sh [backup_file]

set -e

BACKUP_FILE=${1}
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 [backup_file]"
  exit 1
fi

# Jika menggunakan SQLite
if [[ "$BACKUP_FILE" == *.sqlite ]]; then
  cp "$BACKUP_FILE" ./database.sqlite
  echo "SQLite database restored from $BACKUP_FILE"
  exit 0
fi

# Jika menggunakan PostgreSQL
if [[ "$BACKUP_FILE" == *.sql ]]; then
  if command -v psql > /dev/null; then
    DB_NAME=${DB_NAME:-siloam_db}
    DB_USER=${DB_USER:-postgres}
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-5432}
    PGPASSWORD=${DB_PASSWORD:-password} psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" < "$BACKUP_FILE"
    echo "PostgreSQL database restored from $BACKUP_FILE"
    exit 0
  fi
fi

echo "No supported database found or psql not installed."
exit 1
