#!/bin/bash
# Simple migration runner script

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/migrations"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-postgres}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"

if [ -n "$DB_PASSWORD" ]; then
    export PGPASSWORD="$DB_PASSWORD"
fi

usage() {
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  up [migration]    Run migrations (all or specific)"
    echo "  down [migration]  Rollback migrations (all or specific)"
    echo "  status            Show migration status"
    echo ""
    echo "Environment variables:"
    echo "  DB_HOST           Database host (default: localhost)"
    echo "  DB_PORT           Database port (default: 5432)"
    echo "  DB_NAME           Database name (default: postgres)"
    echo "  DB_USER           Database user (default: postgres)"
    echo "  DB_PASSWORD       Database password"
    echo ""
    echo "Examples:"
    echo "  $0 up                              # Run all migrations"
    echo "  $0 up 001_create_users_table       # Run specific migration"
    echo "  $0 down 001_create_users_table     # Rollback specific migration"
    exit 1
}

check_connection() {
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}Error: psql not found. Please install PostgreSQL client.${NC}"
        exit 1
    fi

    if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" &> /dev/null; then
        echo -e "${RED}Error: Cannot connect to database${NC}"
        exit 1
    fi
}

run_up() {
    local migration="$1"

    if [ -z "$migration" ]; then
        # Run all migrations
        echo -e "${YELLOW}Running all up migrations...${NC}"
        for file in "$MIGRATIONS_DIR"/*.sql; do
            if [[ ! "$file" =~ \.down\.sql$ ]]; then
                echo -e "${YELLOW}Running $(basename "$file")...${NC}"
                psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
                echo -e "${GREEN}✓ Completed$(basename "$file")${NC}"
            fi
        done
    else
        # Run specific migration
        local file="$MIGRATIONS_DIR/${migration}.sql"
        if [ ! -f "$file" ]; then
            echo -e "${RED}Error: Migration file not found: $file${NC}"
            exit 1
        fi
        echo -e "${YELLOW}Running $migration...${NC}"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
        echo -e "${GREEN}✓ Completed $migration${NC}"
    fi
}

run_down() {
    local migration="$1"

    if [ -z "$migration" ]; then
        # Rollback all migrations (in reverse order)
        echo -e "${YELLOW}Rolling back all migrations...${NC}"
        for file in $(ls -r "$MIGRATIONS_DIR"/*.down.sql); do
            echo -e "${YELLOW}Running $(basename "$file")...${NC}"
            psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
            echo -e "${GREEN}✓ Completed $(basename "$file")${NC}"
        done
    else
        # Rollback specific migration
        local file="$MIGRATIONS_DIR/${migration}.down.sql"
        if [ ! -f "$file" ]; then
            echo -e "${RED}Error: Migration file not found: $file${NC}"
            exit 1
        fi
        echo -e "${YELLOW}Rolling back $migration...${NC}"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
        echo -e "${GREEN}✓ Completed $migration rollback${NC}"
    fi
}

show_status() {
    echo -e "${YELLOW}Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}${NC}"
    echo ""
    echo "Available migrations:"
    for file in "$MIGRATIONS_DIR"/*.sql; do
        if [[ ! "$file" =~ \.down\.sql$ ]]; then
            echo "  - $(basename "$file" .sql)"
        fi
    done
    echo ""
    echo "Tables in database:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
}

# Main
if [ $# -eq 0 ]; then
    usage
fi

check_connection

case "$1" in
    up)
        run_up "$2"
        ;;
    down)
        run_down "$2"
        ;;
    status)
        show_status
        ;;
    *)
        usage
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
