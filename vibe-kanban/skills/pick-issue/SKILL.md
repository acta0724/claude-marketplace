---
name: pick-issue
description: |
    Issueを選択してworkspace sessionを開始し、worktreeを作成します。
    Trigger: pick, start issue, take issue, issue着手
argument-hint: [issue-title-or-id]
model: haiku
---

引数または Issue 一覧から Todo/Backlog の Issue を選択してください。

1. `mcp__vibe_kanban__update_issue` でステータスを "In Progress" に更新
2. `mcp__vibe_kanban__start_workspace_session` で workspace session を開始（executor: "CLAUDE_CODE"）
3. `wf:worktree` スキルでブランチ名を生成し worktree を作成

作業を開始してください。
