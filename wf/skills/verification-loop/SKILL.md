---
name: verification-loop
description: |
    実装完了後、PR作成前に自律的に実行する必要があるフロースキルです。
    Trigger: implementation done, before pr, verify, check quality
model: haiku
---

## Description
実装完了後にビルド・テスト・lint等の品質チェックを一括実行し、PR作成前の品質を担保します。

## Verification Phases

### Phase 1: ビルド確認
プロジェクトの構成を確認し、適切なビルドコマンドを実行してください。
- package.json, Makefile, pyproject.toml, go.mod, Cargo.toml 等から判断

ビルドが失敗した場合は修正してから次に進むこと。

### Phase 2: 型チェック
プロジェクトに型チェックツールがあれば実行してください。

### Phase 3: lint チェック
プロジェクトのリンター設定を確認し実行してください。

### Phase 4: テスト
プロジェクトのテストを実行してください。
- カバレッジが取得できる場合は報告する
- 失敗したテストがあれば修正する

### Phase 5: セキュリティ確認
変更差分に以下が含まれていないか確認してください。
- ハードコードされたシークレット（APIキー、トークン等）
- デバッグ用の出力文
- コメントアウトされたコード

### Phase 6: 差分レビュー
```bash
git diff --stat
```
変更されたファイルを確認し、意図しない変更がないか確認してください。

## Output

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL]
Lint:      [PASS/FAIL]
Tests:     [PASS/FAIL] (X/Y passed)
Security:  [PASS/FAIL]
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
```

全て PASS の場合は commit-push-pr-flow に進んでください。
