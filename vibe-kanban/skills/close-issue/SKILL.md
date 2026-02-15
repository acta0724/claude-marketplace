---
name: close-issue
description: |
    IssueをDoneに更新します。PR完了後に自動的に呼び出されます。
    Trigger: close issue, done, issue完了
argument-hint: [issue-title-or-id]
model: haiku
---

引数または "In Progress" の Issue を特定し、`mcp__vibe_kanban__update_issue` でステータスを "Done" に更新してください。
