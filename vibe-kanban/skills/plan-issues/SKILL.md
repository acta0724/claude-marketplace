---
name: plan-issues
description: |
    要件を分析し、実装可能なIssueに分解して登録します。
    Trigger: plan, decompose, 要件分解, issue作成
argument-hint: <requirements>
model: sonnet
---

## Description
ユーザーの要件を分析し、実装可能な粒度の Issue に分解して vibe-kanban に登録します。

## Process

### Step 1: 要件の理解
引数またはユーザーの入力から要件を把握します。
不明点があればユーザーに質問してください。

### Step 2: Issue 分解
要件を以下の観点で分解してください:
- 1 Issue = 1 PR で完結する粒度
- 依存関係を考慮した実装順序
- 各 Issue に明確な完了条件を設定

### Step 3: ユーザー確認
分解結果をユーザーに提示し、承認を得てください。

```
## Issue Plan

1. **Issue タイトル**
   説明: ...
   完了条件: ...

2. **Issue タイトル**
   説明: ...
   完了条件: ...
```

### Step 4: Issue 登録
承認後、`mcp__vibe_kanban__list_organizations` → `mcp__vibe_kanban__list_projects` でプロジェクトを特定し、`mcp__vibe_kanban__create_issue` で各 Issue を登録します。
- title: Issue タイトル
- description: 説明と完了条件を含む
- project_id: 対象プロジェクトの ID

### Step 5: ボード表示
登録完了後、`board` スキルと同じ形式で最新のボードを表示してください。

## Output
```
Created X issues in PROJECT_NAME

## Board
### Backlog
- #ID: Title
- #ID: Title
...
```
