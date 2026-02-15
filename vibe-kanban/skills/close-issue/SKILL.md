---
name: close-issue
description: |
    IssueをDoneに更新します。PR完了後に自動的に呼び出されます。
    Trigger: close issue, done, issue完了
argument-hint: [issue-title-or-id]
model: haiku
---

## Description
PR マージ後や作業完了時に Issue のステータスを Done に更新します。

## Process

### Step 1: Issue 特定
引数が指定されている場合はそれを使用します。
指定がない場合:
1. `mcp__vibe_kanban__list_organizations` → `mcp__vibe_kanban__list_projects` → `mcp__vibe_kanban__list_issues` でIssue一覧を取得
2. "In Progress" ステータスの Issue を特定（1つなら自動選択、複数ならユーザーに選択させる）

### Step 2: ステータス更新
`mcp__vibe_kanban__update_issue` で Issue のステータスを "Done" に更新

## Output
```
Issue: #ID - Title
Status: Done
```
