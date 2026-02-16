---
name: pick-issue
description: |
    Linear Issue を選択してステータスを更新し、worktree を作成します。
    Trigger: pick, start issue, take issue, issue着手
argument-hint: [issue-identifier-or-title]
model: haiku
---

引数または Issue 一覧から未着手の Issue を選択して作業を開始します。

## 手順

### 1. チーム解決
`mcp__linear__list_teams` でチーム一覧を取得する。
- 1つなら自動選択
- 引数の Identifier（例: TEAM-123）からチームを推測できればそれを使用
- 複数ならユーザーに選択させる

### 2. Issue 選択
引数がある場合はその Issue を特定する。
無い場合は `mcp__linear__list_issues` で未着手（state type が `unstarted` または `backlog`）の Issue を一覧表示し、ユーザーに選択させる。

### 3. ステータス更新
`mcp__linear__list_issue_statuses` でチームのステータス一覧を取得し、type が `started` のステータスを特定する。
見つからない場合は名前に "Progress" または "Active" を含むステータスを探し、それでも見つからなければ一覧を表示してユーザーに選択させる。
`mcp__linear__update_issue` で:
- `state` を特定したステータス名に更新
- `assignee` を "me" に設定

### 4. worktree 作成
Issue の identifier（例: TEAM-123）からブランチ名を生成する:
- 形式: `<identifier-lowercase>-<title-kebab-case>`（例: `team-123-add-login-page`）
- slash は使用不可

`wf:worktree` スキルでブランチ名を指定して worktree を作成する。

作業を開始してください。
