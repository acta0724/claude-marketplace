---
name: run-team
description: |
    Todoの全Issueに対してエージェントチームを編成し、並列実行します。
    Trigger: run team, execute all, dispatch, チーム実行, 全Issue実行
model: sonnet
---

## 概要
あなたは **監督者（Supervisor）** として、全 Issue の実行を統括します。
各 Issue には **実行者（Executor）** エージェントを割り当て、Task ツールで起動します。

## 手順

### 1. Issue 一覧取得
`mcp__vibe_kanban__list_issues` で Todo/Backlog の Issue を取得する。
対象が無ければ `plan-issues` スキルを案内して終了。

### 2. リポジトリ情報取得
`mcp__vibe_kanban__list_repos` でリポジトリ情報を取得する。

### 3. チーム編成表示
以下のフォーマットでチーム構成を表示する:

```
## Agent Team
| Role | Issue | Status |
|------|-------|--------|
| Supervisor | 全体統括 | Active |
| Executor-1 | <Issue-1 title> | Pending |
| Executor-2 | <Issue-2 title> | Pending |
```

### 4. 実行準備
各 Issue に対して:
1. `mcp__vibe_kanban__update_issue` でステータスを "In Progress" に更新
2. ブランチ名を生成（Issue タイトルからケバブケース、slash 不可）
3. `git worktree add <path> -b <branch>` で worktree を作成
   - path は `../<branch-name>` とする

### 5. Executor 起動
各 Issue に対して `Task` ツールで `vibe-kanban:issue-executor` エージェントを起動する。
依存関係のない Issue は **並列実行**（1つのメッセージで複数 Task を起動）する。
依存関係がある場合は先行 Issue 完了後に後続を起動する。

Task のプロンプトには以下を含める:
```
## Issue
- タイトル: <title>
- 説明: <description>

## 作業環境
- 作業ディレクトリ: <worktree-path の絶対パス>
- ブランチ: <branch-name>
- ベースブランチ: <base-branch>

上記 Issue を実装してください。
```

### 6. 結果回収とステータス更新
各 Executor の完了後:
- **成功**: `mcp__vibe_kanban__update_issue` でステータスを "Done" に更新
- **失敗**: ステータスは "In Progress" のまま残し、失敗理由を記録

### 7. 結果報告
全 Executor 完了後:
1. チーム構成表を結果で更新して表示
2. `board` スキルでボードを表示
3. 各 PR の URL をまとめて表示

### 8. クリーンアップ
完了した worktree を `git worktree remove <path>` で削除する。
