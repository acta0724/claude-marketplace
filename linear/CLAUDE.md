# Linear Plugin

## ワークフロー

Linear を利用した開発では、必ず以下の Issue ワークフローに従うこと。直接コードを書き始めてはいけない。

```
plan-issues → board → pick-issue → 実装 → close-issue
```

### 複数 Issue の一括実行

Issue が複数ある場合は `run-team` スキルでエージェントチームを編成し並列実行すること。
1つずつ `pick-issue` で手動着手するより `run-team` を優先する。

## スキル一覧と発動タイミング

| スキル | いつ使うか |
|--------|-----------|
| `linear:plan-issues` | ユーザーから要件・タスクの指示を受けた時。まず Issue に分解する |
| `linear:board` | 現状確認、Issue 一覧の表示が必要な時 |
| `linear:pick-issue` | 単一 Issue に手動で着手する時 |
| `linear:run-team` | 未着手 Issue が複数ある時。エージェントチームで並列実行する |
| `linear:close-issue` | PR マージ後、Issue を完了にする時 |

## 原則

- **Issue 駆動**: すべての作業は Linear Issue に紐付ける
- **チーム優先**: 未着手 Issue が 2 つ以上あれば `run-team` を提案する
- **1 Issue = 1 PR**: Issue の粒度は PR 1 つで完結するサイズにする
- **ステータス管理**: Issue のステータスは必ずスキル経由で更新する
