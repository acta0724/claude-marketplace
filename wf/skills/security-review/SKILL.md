---
name: security-review
description: |
    PRやコード変更のセキュリティレビューを行います。
    Trigger: security review, security check, audit
argument-hint: [pr-url]
model: sonnet
---

## Description
コード変更に対してセキュリティ観点のレビューを行い、脆弱性を検出します。
security-reviewer エージェントを使用して実行します。

## Check Items

### CRITICAL（必ず確認）
- シークレット管理: APIキー、トークン、パスワードがハードコードされていないか
- インジェクション: SQL、コマンド、パストラバーサルの脆弱性がないか
  - シェルコマンドインジェクション特有の危険パターン:
    - `xargs ... sh -c` / `xargs ... bash -c` にユーザー入力やファイル名が渡される
    - `eval` でユーザー入力を含む文字列を実行している
    - シェル変数がクォートされていない（`$VAR` → `"$VAR"` にすべき）
    - `xargs` に `-0` なしで改行区切りのファイル名を渡している
    - 外部入力がホワイトリスト検証なしでシェルコマンドの引数に使用されている
    - `--` （end-of-options）なしで変数をgitコマンド等の引数に渡している
- 認証・認可: アクセス制御が正しく実装されているか

### HIGH（推奨）
- XSS: ユーザー入力がサニタイズされているか
- CSRF: 状態変更を伴う操作にCSRF対策があるか
- 入力バリデーション: 外部入力が検証されているか
- レート制限: APIエンドポイントにレート制限があるか

### MEDIUM（可能であれば）
- 機密データの露出: ログにセンシティブな情報が含まれていないか
- 依存関係: 既知の脆弱性を持つライブラリを使用していないか
- エラーメッセージ: 内部情報が漏洩するエラーメッセージがないか

## Process
1. 変更差分を取得する
2. security-reviewer エージェントにレビューを依頼する
3. 検出された問題を重要度別に報告する
4. CRITICAL の問題がある場合は修正を提案する

## Output
- 検出された問題の一覧（重要度別）
- 各問題の修正提案
- 全体の判定（APPROVE / WARNING / BLOCK）
  - APPROVE: CRITICAL/HIGH の問題なし
  - WARNING: HIGH の問題のみ
  - BLOCK: CRITICAL の問題あり
