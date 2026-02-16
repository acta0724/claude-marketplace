# Database Migrations

## Overview

このディレクトリには、データベーススキーマのマイグレーションファイルが含まれています。

## Structure

```
db/
├── migrations/
│   ├── 001_create_users_table.sql      # Up migration
│   └── 001_create_users_table.down.sql # Down migration (rollback)
└── README.md
```

## Migrations

### 001_create_users_table

User テーブルを作成します。

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | ユーザーID（自動採番） |
| email | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

#### Indexes

- `idx_users_email`: email カラムのインデックス（検索パフォーマンス向上）

#### Constraints

- `email` に UNIQUE 制約により、重複登録を防止

## Usage

### PostgreSQL の場合

#### マイグレーション実行

```bash
psql -U <username> -d <database> -f db/migrations/001_create_users_table.sql
```

#### ロールバック

```bash
psql -U <username> -d <database> -f db/migrations/001_create_users_table.down.sql
```

### Migration Tools

実際のプロジェクトでは以下のようなマイグレーションツールの使用を推奨します:

- [golang-migrate/migrate](https://github.com/golang-migrate/migrate) (Go)
- [Flyway](https://flywaydb.org/) (Java/JVM)
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate) (Node.js)
- [Alembic](https://alembic.sqlalchemy.org/) (Python)

## Testing

マイグレーションをテストする場合:

1. Up マイグレーションを実行
2. スキーマが正しく作成されたことを確認
3. Down マイグレーションでロールバック
4. テーブルが削除されたことを確認

```sql
-- テーブル存在確認
SELECT table_name FROM information_schema.tables WHERE table_name = 'users';

-- スキーマ確認
\d users

-- UNIQUE 制約のテスト
INSERT INTO users (email, password_hash) VALUES ('test@example.com', 'hash1');
INSERT INTO users (email, password_hash) VALUES ('test@example.com', 'hash2'); -- エラーになるはず
```
