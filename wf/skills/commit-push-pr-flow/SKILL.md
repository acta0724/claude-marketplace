---
name: commit-push-pr-flow
description: |
    タスク完了後に自律的に実行する必要があるフロースキルです。
    Trigger: task completed, ready to submit code
model: haiku
---

Commit, push, and open a pr

## 手順

### 1. verification-loop
verification-loop を実行し、全て PASS であることを確認すること。

### 2. process-commit
process-commit を実行し、変更を論理的な単位に分割してコミットする。
ただし以下の場合はスキップしてよい:
- 変更ファイルが 1-2 個で、全て同一目的の変更である場合
- 既にコミット済みで未コミットの変更がない場合

### 3. push & PR
- create branch(if current branch in default) and pr
- following pr template
- description in japanese
- 提出後は gh pr view --web で差分を共有して完了してください

### 4. review-flow
完了後 review-flow を呼び出します
