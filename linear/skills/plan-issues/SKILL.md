---
name: plan-issues
description: |
    要件を分析し、実装可能な Issue に分解して Linear に登録します。
    Trigger: plan, decompose, 要件分解, issue作成
argument-hint: <requirements>
model: sonnet
---

要件を以下の観点で Issue に分解してください:
- 1 Issue = 1 PR で完結する粒度
- 依存関係を考慮した実装順序
- 各 Issue に明確な完了条件を設定

## 手順

### 1. チーム解決
`mcp__linear__list_teams` でチーム一覧を取得する。
- 1つなら自動選択
- 複数ならユーザーに選択させる

### 2. プロジェクト紐付け（オプション）
`mcp__linear__list_projects` でプロジェクト一覧を取得し、該当するプロジェクトがあれば紐付ける。

### 3. 要件分解
ユーザーの要件を分析し、Issue に分解する。各 Issue には以下を含める:
- タイトル（簡潔で明確）
- 説明（完了条件を含む）
- priority（1=Urgent, 2=High, 3=Normal, 4=Low）
- 依存関係（blockedBy）

### 4. ユーザー承認
分解結果をユーザーに提示し、承認を得る。

### 5. Issue 登録
承認後、`mcp__linear__create_issue` で登録する。`team` パラメータは必須。
依存関係がある場合は `blockedBy` で指定する。

### 6. 完了後の案内
登録完了後、`board` スキルでボードを表示すること。
ボード表示後、`run-team` スキルで全 Issue の一括実行が可能であることを案内すること。
