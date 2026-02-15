# acta-marketplace

Claude Code 用のプラグインマーケットプレイス。

## インストール

```bash
/plugin marketplace add acta0724/claude-marketplace
/plugin install wf@acta-marketplace
/plugin install vibe-kanban@acta-marketplace
```

## プラグイン

### wf (v1.2.0)

Git/GitHub のワークフロー自動化ツール。

#### スキル

| スキル | 説明 | トリガー |
|--------|------|----------|
| `worktree` | Git worktree を作成 | Plan 完了後 |
| `process-commit` | 変更を hunk 単位で分割コミット | コミット整理時 |
| `commit-push-pr-flow` | コミット → プッシュ → PR 作成 | タスク完了後 |
| `review-flow` | PR のペアプロレビュー | PR 作成後 |
| `verification-loop` | ビルド・テスト・lint の品質チェック | 実装完了後、PR 作成前 |
| `security-review` | セキュリティ観点のコードレビュー | セキュリティ確認時 |
| `current-pr` | 現在の PR を引き継ぐ | PR 引き継ぎ時 |
| `strategic-compact` | 戦略的にコンテキストをコンパクト化 | コンテキスト肥大時 |

#### エージェント

| エージェント | 説明 |
|-------------|------|
| `qa` | ユースケース想定の動作確認 |
| `deslop` | 不要コード検出・除去 |
| `fixci` | CI 失敗の検出・修正 |
| `security-reviewer` | セキュリティ脆弱性の検出・報告 |

#### ワークフロー

```
worktree → 実装 → verification-loop → commit-push-pr-flow → review-flow
                                                                ├── qa
                                                                ├── deslop
                                                                └── fixci
```

### vibe-kanban (v1.0.0)

vibe-kanban MCP と連携したプロジェクト・Issue 管理ツール。

#### スキル

| スキル | 説明 | トリガー |
|--------|------|----------|
| `board` | Issue 一覧をステータス別に表示 | `board`, `issues`, `kanban`, `ボード` |
| `plan-issues` | 要件を分析し Issue に分解・登録 | `plan`, `decompose`, `要件分解`, `issue作成` |
| `pick-issue` | Issue を選択して作業開始 | `pick`, `start issue`, `take issue`, `issue着手` |
| `close-issue` | Issue を Done に更新 | `close issue`, `done`, `issue完了` |

#### ワークフロー

```
plan-issues → board → pick-issue → (wf で実装) → close-issue
```
