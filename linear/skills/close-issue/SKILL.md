---
name: close-issue
description: |
    Linear Issue を完了ステータスに更新します。PR完了後に呼び出されます。
    Trigger: close issue, done, issue完了
argument-hint: [issue-identifier-or-title]
model: haiku
---

引数または進行中の Issue を特定し、完了ステータスに更新します。

## 手順

### 1. チーム解決
`mcp__linear__list_teams` でチーム一覧を取得する。
- 1つなら自動選択
- 複数ならユーザーに選択させる

### 2. Issue 特定
引数がある場合はその Issue を特定する。
無い場合は `mcp__linear__list_issues` で進行中（state type が `started`）の Issue を一覧表示し、ユーザーに選択させる。

### 3. ステータス更新
`mcp__linear__list_issue_statuses` でチームのステータス一覧を取得し、type が `completed` のステータスを特定する。
`mcp__linear__update_issue` で `state` を completed type のステータス名に更新する。
