#!/bin/bash
# SQL syntax validation script (without database connection)

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== SQL Syntax Validation ===${NC}"
echo ""

MIGRATIONS_DIR="$(dirname "$0")/migrations"

# Check for common SQL syntax issues
validate_file() {
    local file="$1"
    local basename=$(basename "$file")

    echo -e "${YELLOW}Validating $basename...${NC}"

    # Check if file is empty
    if [ ! -s "$file" ]; then
        echo -e "${RED}✗ File is empty${NC}"
        return 1
    fi

    # Check for SQL keywords
    if ! grep -q -i "CREATE\|DROP\|ALTER\|INSERT\|UPDATE\|DELETE\|SELECT" "$file"; then
        echo -e "${RED}✗ No SQL statements found${NC}"
        return 1
    fi

    # Check for unterminated statements (basic check)
    local content=$(cat "$file")
    if [[ "$content" =~ CREATE[[:space:]]+TABLE ]] && ! grep -q ";" "$file"; then
        echo -e "${RED}✗ Missing semicolon terminator${NC}"
        return 1
    fi

    echo -e "${GREEN}✓ Basic syntax validation passed${NC}"
    return 0
}

# Validate schema requirements
validate_users_table() {
    local file="$MIGRATIONS_DIR/001_create_users_table.sql"

    echo -e "${YELLOW}Validating users table schema...${NC}"

    # Check required columns
    local required_columns=("id" "email" "password_hash" "created_at" "updated_at")
    for col in "${required_columns[@]}"; do
        if ! grep -q "$col" "$file"; then
            echo -e "${RED}✗ Missing required column: $col${NC}"
            return 1
        fi
    done
    echo -e "${GREEN}✓ All required columns present${NC}"

    # Check UNIQUE constraint on email
    if ! grep -q -i "email.*UNIQUE\|UNIQUE.*email" "$file"; then
        echo -e "${RED}✗ Missing UNIQUE constraint on email${NC}"
        return 1
    fi
    echo -e "${GREEN}✓ UNIQUE constraint on email found${NC}"

    # Check PRIMARY KEY
    if ! grep -q -i "PRIMARY KEY" "$file"; then
        echo -e "${RED}✗ Missing PRIMARY KEY${NC}"
        return 1
    fi
    echo -e "${GREEN}✓ PRIMARY KEY found${NC}"

    return 0
}

# Validate all migration files
for file in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$file" ]; then
        validate_file "$file" || exit 1
        echo ""
    fi
done

# Validate specific requirements
validate_users_table || exit 1

echo ""
echo -e "${GREEN}=== All validations passed! ===${NC}"
echo ""
echo "Note: This script performs basic syntax validation only."
echo "For complete testing, run the migrations against a PostgreSQL database."
