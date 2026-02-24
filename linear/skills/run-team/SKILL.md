---
name: run-team
description: |
    未着手の全 Issue に対して Worker を編成し、並列実行します。
    Trigger: run team, execute all, dispatch, チーム実行, 全Issue実行
model: sonnet
---

## 概要
あなたは **Orchestrator** として、全 Issue の実行を統括します。
各 Issue には **Worker** エージェントを割り当て、Task ツールで起動します。
自分では実装せず、タスク分解・配分・結果統合に徹してください。

## 制約
- 並列 Worker 数は **最大 4** とする。Issue が 5 以上ある場合はバッチに分けて順次実行する
- 各 Worker が同一ファイルを編集しないよう、Issue の粒度で作業領域が分離されていることを確認する

## 手順

### 1. チーム解決
`mcp__linear__list_teams` でチーム一覧を取得する。
- 1つなら自動選択
- 複数なら引数にチーム名があればそれを使用、なければユーザーに選択させる

### 2. ステータス事前取得
`mcp__linear__list_issue_statuses` でチームのステータス一覧を取得し、以下を特定する:
- `started` type → 進行中ステータス名（見つからなければ名前に "Progress"/"Active" を含むもの）
- `completed` type → 完了ステータス名（見つからなければ名前に "Done"/"Complete" を含むもの）
- どちらも見つからない場合はステータス一覧を表示してユーザーに選択させる

### 3. Issue 一覧取得
`mcp__linear__list_issues` で未着手（state type が `unstarted` または `backlog`）の Issue を取得する。
対象が無ければ `plan-issues` スキルを案内して終了。

### 4. Worker 一覧表示
以下のフォーマットで Worker 構成を表示する:

```
## Workers
| # | Issue | Identifier | Status |
|---|-------|------------|--------|
| 1 | <Issue-1 title> | TEAM-1 | Pending |
| 2 | <Issue-2 title> | TEAM-2 | Pending |
```

### 5. 実行準備
各 Issue に対して:
1. `mcp__linear__update_issue` でステータスを started type のステータスに更新し、`assignee` を "me" に設定
2. Issue の identifier とタイトルからブランチ名を生成（例: `team-123-add-login-page`、slash 不可）
3. `git worktree add <path> -b <branch>` で worktree を作成
   - path は `../<branch-name>` とする

### 6. Worker 起動
各 Issue に対して `Task` ツールで `linear:issue-executor` エージェントを起動する。
依存関係のない Issue は **並列実行**（1つのメッセージで複数 Task を起動）する。
依存関係がある場合は先行 Issue 完了後に後続を起動する。
先行 Issue が失敗した場合、その Issue に依存する後続 Issue は **スキップ** し、理由を記録する。

Task のプロンプトには以下を含める:
```
## 目的
<Issue title> を実装し、PR を作成する。

## Issue
- タイトル: <title>
- 説明: <description>
- Identifier: <identifier>

## 作業環境
- 作業ディレクトリ: <worktree-path の絶対パス>
- ブランチ: <branch-name>
- ベースブランチ: <base-branch>

## 期待する出力
- 実装内容の概要
- 変更ファイル一覧
- テスト結果
- PR URL

## タスク境界
- 上記 Issue のスコープ内のみ変更すること
- 他の Issue の領域には触れないこと
```

### 7. 結果回収とステータス更新
各 Worker の完了後:
- **成功**: `mcp__linear__update_issue` でステータスを completed type のステータスに更新
- **失敗**: ステータスは started のまま残し、失敗理由を記録。この Issue に依存する後続 Issue もスキップ扱いとする

### 8. 結果報告
全 Worker 完了後:
1. Worker 一覧表を結果で更新して表示
2. `board` スキルでボードを表示
3. 各 PR の URL をまとめて表示

### 9. クリーンアップ
全 worktree を `git worktree remove <path>` で削除する（成功・失敗問わず）。
