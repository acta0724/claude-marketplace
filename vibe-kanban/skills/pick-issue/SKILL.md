---
name: pick-issue
description: |
    Issueを選択してworkspace sessionを開始し、worktreeを作成します。
    Trigger: pick, start issue, take issue, issue着手
argument-hint: [issue-title-or-id]
model: haiku
---

## Description
vibe-kanban の Issue を選択し、workspace session を開始して作業環境を構築します。

## Process

### Step 1: Issue 選択
引数が指定されている場合はそれを使用します。
指定がない場合:
1. `mcp__vibe_kanban__list_organizations` → `mcp__vibe_kanban__list_projects` → `mcp__vibe_kanban__list_issues` でIssue一覧を取得
2. Todo / Backlog ステータスの Issue をユーザーに提示し選択させる

### Step 2: Issue ステータス更新
`mcp__vibe_kanban__update_issue` で選択した Issue のステータスを "In Progress" に更新

### Step 3: Workspace Session 開始
`mcp__vibe_kanban__list_repos` でリポジトリ一覧を取得し、`mcp__vibe_kanban__start_workspace_session` で workspace session を開始:
- title: Issue のタイトル
- executor: "CLAUDE_CODE"
- repos: 対象リポジトリの repo_id と base_branch
- issue_id: 選択した Issue の ID

### Step 4: Worktree 作成
`wf:worktree` スキルを呼び出して worktree を作成します。
ブランチ名は Issue タイトルから適切に生成してください。

## Output
```
Issue: #ID - Title
Status: In Progress
Branch: branch-name
Workspace: Ready
```

作業を開始してください。
