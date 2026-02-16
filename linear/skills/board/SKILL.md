---
name: board
description: |
    Linear プロジェクトの Issue 一覧をステータス別に表示します。
    Trigger: board, issues, kanban, ボード
argument-hint: [team-name]
model: haiku
---

Linear MCP で Issue 一覧を取得し、ステータス別にグループ化して表示してください。

## 手順

### 1. チーム解決
`mcp__linear__list_teams` でチーム一覧を取得する。
- 1つなら自動選択
- 複数なら引数にチーム名があればそれを使用、なければユーザーに選択させる

### 2. Issue 取得
`mcp__linear__list_issues` で選択したチームの Issue を取得する（`includeArchived: false`）。

### 3. 表示
ステータス別にグループ化し、以下のフォーマットで表示する:

```
## 📋 <Team Name> Board

### <Status Name>
| Identifier | Title | Priority | Assignee |
|------------|-------|----------|----------|
| TEAM-1 | ... | High | ... |
```

Priority は数値を表示名に変換する: 1=Urgent, 2=High, 3=Normal, 4=Low, 0=None

### 4. 案内
- Issue が無い場合は `plan-issues` スキルを案内すること
- Todo/Backlog の Issue がある場合は `run-team` スキルで一括実行できることを案内すること
