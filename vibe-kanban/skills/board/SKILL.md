---
name: board
description: |
    プロジェクトのIssue一覧をステータス別に表示します。
    Trigger: board, issues, kanban, ボード
model: haiku
---

vibe-kanban MCP でプロジェクトのIssue一覧を取得し、ステータス別にグループ化して表示してください。

Issue が無い場合は `plan-issues` スキルを案内すること。
Todo の Issue がある場合は `run-team` スキルで一括実行できることを案内すること。
