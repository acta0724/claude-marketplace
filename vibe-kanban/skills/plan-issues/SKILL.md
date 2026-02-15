---
name: plan-issues
description: |
    要件を分析し、実装可能なIssueに分解して登録します。
    Trigger: plan, decompose, 要件分解, issue作成
argument-hint: <requirements>
model: sonnet
---

要件を以下の観点で Issue に分解してください:
- 1 Issue = 1 PR で完結する粒度
- 依存関係を考慮した実装順序
- 各 Issue に明確な完了条件を設定

分解結果をユーザーに提示し、承認後 `mcp__vibe_kanban__create_issue` で登録してください。
登録完了後、`board` スキルでボードを表示すること。
ボード表示後、`run-team` スキルで全 Issue の一括実行が可能であることを案内すること。
