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
- 引数の Identifier（例: TEAM-123）からチームを推測できればそれを使用
- 複数ならユーザーに選択させる

### 2. Issue 特定
引数がある場合はその Issue を特定する。
無い場合は `mcp__linear__list_issues` で進行中（state type が `started`）の Issue を一覧表示し、ユーザーに選択させる。

### 3. ステータス更新
`mcp__linear__list_issue_statuses` でチームのステータス一覧を取得し、type が `completed` のステータスを特定する。
見つからない場合は名前に "Done" または "Complete" を含むステータスを探し、それでも見つからなければ一覧を表示してユーザーに選択させる。
`mcp__linear__update_issue` で `state` を特定したステータス名に更新する。

### 4. worktree クリーンアップ
Issue の identifier からブランチ名を推測し、対応する worktree が存在すれば `git worktree remove <path>` で削除する。
worktree が見つからない場合はスキップする。
