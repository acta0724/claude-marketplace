#!/bin/bash
# Migration test script
# This script tests the users table migration

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Migration Test Script ===${NC}"
echo ""

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql command not found. Please install PostgreSQL.${NC}"
    exit 1
fi

# Configuration (override with environment variables)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-test_db}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"

# Check database connection
echo -e "${YELLOW}Checking database connection...${NC}"
if [ -n "$DB_PASSWORD" ]; then
    export PGPASSWORD="$DB_PASSWORD"
fi

if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to database${NC}"
    echo "Please ensure PostgreSQL is running and database '$DB_NAME' exists."
    echo "You can create it with: createdb -U $DB_USER $DB_NAME"
    exit 1
fi

echo -e "${GREEN}✓ Database connection successful${NC}"
echo ""

# Run up migration
echo -e "${YELLOW}Running up migration...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/migrations/001_create_users_table.sql"
echo -e "${GREEN}✓ Up migration completed${NC}"
echo ""

# Verify table exists
echo -e "${YELLOW}Verifying table creation...${NC}"
TABLE_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users'")
if [ "$TABLE_EXISTS" -eq "1" ]; then
    echo -e "${GREEN}✓ Users table exists${NC}"
else
    echo -e "${RED}✗ Users table not found${NC}"
    exit 1
fi

# Verify schema
echo -e "${YELLOW}Verifying schema...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\d users"
echo ""

# Test UNIQUE constraint on email
echo -e "${YELLOW}Testing UNIQUE constraint on email...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "INSERT INTO users (email, password_hash) VALUES ('test@example.com', 'hash1')"
echo -e "${GREEN}✓ First insert successful${NC}"

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "INSERT INTO users (email, password_hash) VALUES ('test@example.com', 'hash2')" 2>&1 | grep -q "duplicate key"; then
    echo -e "${GREEN}✓ UNIQUE constraint working (duplicate insert blocked)${NC}"
else
    echo -e "${RED}✗ UNIQUE constraint not working${NC}"
    exit 1
fi
echo ""

# Run down migration
echo -e "${YELLOW}Running down migration (rollback)...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/migrations/001_create_users_table.down.sql"
echo -e "${GREEN}✓ Down migration completed${NC}"
echo ""

# Verify table is dropped
echo -e "${YELLOW}Verifying table deletion...${NC}"
TABLE_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users'")
if [ "$TABLE_EXISTS" -eq "0" ]; then
    echo -e "${GREEN}✓ Users table successfully dropped${NC}"
else
    echo -e "${RED}✗ Users table still exists${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=== All tests passed! ===${NC}"
