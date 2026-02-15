---
name: board
description: |
    プロジェクトのIssue一覧をステータス別に表示します。
    Trigger: board, issues, kanban, ボード
model: haiku
---

## Description
vibe-kanban MCP を使用してプロジェクトのIssue一覧をカンバンボード形式で表示します。

## Process

1. `mcp__vibe_kanban__list_organizations` で組織一覧を取得
2. `mcp__vibe_kanban__list_projects` でプロジェクト一覧を取得
3. 対象プロジェクトの `project_id` を特定（複数ある場合はユーザーに選択させる）
4. `mcp__vibe_kanban__list_issues` でIssue一覧を取得

## Output

ステータス別にグループ化して表示してください。

```
## PROJECT_NAME Board

### Backlog
- #ID: Title

### Todo
- #ID: Title

### In Progress
- #ID: Title

### Done
- #ID: Title
```

Issue が無い場合は `plan-issues` スキルを案内してください。
