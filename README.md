# acta-marketplace

Claude Code 用のプラグインマーケットプレイス。

## インストール

```bash
/plugin marketplace add acta0724/claude-marketplace
/plugin install wf@acta-marketplace
```

## プラグイン

### wf

Git/GitHub のワークフロー自動化ツール。

| スキル | 説明 | トリガー |
|--------|------|----------|
| `worktree` | Git worktree を作成 | Plan 完了後 |
| `process-commit` | 変更を hunk 単位で分割コミット | コミット整理時 |
| `commit-push-pr-flow` | コミット → プッシュ → PR 作成 | タスク完了後 |
| `review-flow` | PR のペアプロレビュー | PR 作成後 |

### ワークフローの流れ

```
worktree → process-commit → commit-push-pr-flow → review-flow
```
