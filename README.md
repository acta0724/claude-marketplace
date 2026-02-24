# acta-marketplace

Claude Code 用のプラグインマーケットプレイス。

## インストール

```bash
/plugin marketplace add acta0724/claude-marketplace
/plugin install wf@acta-marketplace
/plugin install linear@acta-marketplace
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

### linear (v1.0.0)

Linear MCP と連携したプロジェクト・Issue 管理ツール。

#### スキル

| スキル | 説明 | トリガー |
|--------|------|----------|
| `board` | Issue 一覧をステータス別に表示 | `board`, `ボード` |
| `plan-issues` | 要件を分析し Issue に分解・登録 | `plan`, `要件分解` |
| `pick-issue` | Issue を選択して作業開始 | `pick`, `issue着手` |
| `close-issue` | Issue を完了ステータスに更新 | `close issue`, `issue完了` |
| `run-team` | 全 Issue を Worker で並列実行 | `run team`, `チーム実行` |

#### エージェント

| エージェント | 説明 |
|-------------|------|
| `issue-executor` | Issue の実装・テスト・PR 作成を自律実行（PR タイトルに Identifier 付与） |

#### 特徴
- チームのステータスを動的に解決（type ベース: started, completed）
- Issue Identifier（TEAM-123 形式）をブランチ名・PR タイトルに活用
- priority, blockedBy による依存関係管理

#### ワークフロー

```
plan-issues → board → run-team (Orchestrator)
                         ├── Worker-1 → Issue-1 実装 → PR (TEAM-1: ...)
                         ├── Worker-2 → Issue-2 実装 → PR (TEAM-2: ...)
                         └── Worker-N → Issue-N 実装 → PR (TEAM-N: ...)
                      → board (結果確認)
```

手動実行の場合:
```
plan-issues → board → pick-issue → (wf で実装) → close-issue
```
