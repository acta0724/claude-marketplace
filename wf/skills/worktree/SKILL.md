---
name: worktree
description: |
    Planが承認/完了した直後に自律的に呼び出す必要があるスキルです。
    Trigger: plan approved, plan completed, taskを開始します
model: haiku
---

## ブランチ名検証

branch名は以下の正規表現に従う必要があります: `^[a-zA-Z0-9_-]+$`
- 英数字、ハイフン、アンダースコアのみ使用可
- スラッシュ、空白、特殊文字は使用禁止

## 実装

以下のコマンドでgit worktreeを作成します。ブランチ名は入力値として渡されます：

```bash
# ブランチ名の検証
if ! [[ "$BRANCH_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
  echo "Error: ブランチ名は英数字、ハイフン、アンダースコアのみ使用可" >&2
  exit 1
fi

# worktreeを作成
gh wt add -b "$BRANCH_NAME" "../${PWD##*/}-${BRANCH_NAME}" main
```

## 完了後

実装後は commit-push-pr-flow を呼び出すこと
