---
name: process-commit
description: |
  PRを作成する前の分割commitが必要な時に自律的に呼び出す必要があるスキルです。
  Trigger: need split commit, prepare commit, organize commit
model: haiku
---

`git-sequential-stage`はhunk単位の部分的なステージングを実行するためのツールです。
`git-sequential-stage`を用いて大きな変更を論理的な単位に分割してコミットしてください。

```bash
# hunk番号を指定して部分的にステージング
git-sequential-stage -patch="path/to/changes.patch" -hunk="src/main.go:1,3,5"

# ファイル全体をステージング（ワイルドカード使用）
git-sequential-stage -patch="path/to/changes.patch" -hunk="src/logger.go:*"

# 複数ファイルの場合（ワイルドカードと番号指定の混在も可能）
git-sequential-stage -patch="path/to/changes.patch" \
  -hunk="src/main.go:1,3" \
  -hunk="src/utils.go:*" \
  -hunk="docs/README.md:*"
```

## 実行手順

### Step 0: リポジトリルートに移動
### Step 1: 差分を取得

```bash
# .claude/tmp ディレクトリの作成と権限設定
mkdir -p .claude/tmp
chmod 700 .claude/tmp

git ls-files --others --exclude-standard | while IFS= read -r file; do
  git add -N "$file"
done

# より安定した位置特定のため（一時ファイルのアクセス権限を制限）
git diff HEAD > .claude/tmp/current_changes.patch
chmod 600 .claude/tmp/current_changes.patch
```

### Step 2: 分析

hunk単位で変更を分析し、最初のコミットに含めるhunkを決定してください
- hunkの内容を読み取る: 各hunkが何を変更しているか理解
- 意味的グループ化: 同じ目的の変更（バグ修正、リファクタリング等）をグループ化
- コミット計画: どのhunkをどのコミットに含めるか決定

```bash
# 全体のhunk数
grep -c "^@@" .claude/tmp/current_changes.patch

# 各ファイルのhunk数（シェルインジェクション対策）
git diff HEAD --name-only | while IFS= read -r file; do
  printf "%s: " "$file"
  git diff HEAD "$file" | grep -c "^@@"
done
```

### Step 3: 自動ステージング

選択したhunkを`git-sequential-stage`で自動的にステージングしてください

```bash
git-sequential-stage -patch=".claude/tmp/current_changes.patch" -hunk="src/calculator.py:1,3,5"
git-sequential-stage -patch=".claude/tmp/current_changes.patch" -hunk="tests/test_calculator.py:*"

git-sequential-stage -patch=".claude/tmp/current_changes.patch" \
  -hunk="src/calculator.py:1,3,5" \
  -hunk="src/utils.py:2" \
  -hunk="docs/CHANGELOG.md:*"

git commit -m "$COMMIT_MSG"
```

### Step 4: 繰り返し
### Step 5: 最終確認

### Step 6: クリーンアップ

```bash
# 一時ファイルの削除（スキリプト終了時に確実に削除）
trap 'rm -f .claude/tmp/current_changes.patch' EXIT

# または、処理完了後に明示的に削除
rm -f .claude/tmp/current_changes.patch
```

#### ワイルドカード使用の判断基準

- 新規ファイルの追加
- すべての変更が同じ目的（例：ファイル全体のリファクタリング、ドキュメント更新）
- 「hunkを数えるのが面倒」という理由で使用するものではない。
