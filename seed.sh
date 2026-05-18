#!/usr/bin/env bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SEED_FILE="$ROOT_DIR/database/seed/001_seed.sql"

DB_CONTAINER="matchme-postgres"
DB_NAME="matchme"
DB_USER="matchme_user"

if [ ! -f "$SEED_FILE" ]; then
  echo "Seed file not found:"
  echo "$SEED_FILE"
  exit 1
fi

echo "Starting PostgreSQL..."
cd "$ROOT_DIR"
docker compose up -d postgres

echo "Waiting for PostgreSQL..."
for i in {1..30}; do
  if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
    echo "PostgreSQL is ready"
    break
  fi

  if [ "$i" -eq 30 ]; then
    echo "PostgreSQL did not become ready"
    exit 1
  fi

  sleep 1
done

echo "Reloading fictitious seed users..."
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$SEED_FILE"

echo ""
echo "Seed reload complete."
echo "Loaded 150 fictitious users:"
echo "- Emails: seed001@matchme.test through seed150@matchme.test"
echo "- Password for all seed users: password123"
echo ""
echo "Quick checks:"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT city, COUNT(*) FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'seed%@matchme.test') GROUP BY city ORDER BY COUNT(*) DESC, city;"
