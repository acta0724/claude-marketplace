---
name: review-flow
description: |
    PR作成後に自律的に実行する必要があるフロースキルです。
    Trigger: review, pr created, pr open
argument-hint: [url]
model: opus
---

## Description
PR $1 について理解しPR authorの身になってペアプロセッションを開始します。
レビュワーにわかりやすいように解説をしてください。

## Setup
"gh wt co $1" で対象のworktreeに切り替えます。
もしも異なるリポジトリにいる場合は先に ~/ghq/github.com/{owner}/{repo} に移動してください。

## Process
parallelに以下のsubagentsを実行します
- **code-reviewer** subagent を使用してコード品質・パフォーマンス観点のレビューを行います。
- **security-reviewer** subagent を使用してセキュリティ観点のレビューを行います。
- **QA** subagent を使用して実際のユースケースを想定した動作確認を行います。
- **deslop** subagent を使用して不要なコードを除去し、pushします
- **fixci** subagent を使用してCIの問題を修正し、pushします

## Output

### Review Summary
code-reviewer と security-reviewer の結果を統合し、以下のサマリを出力する:

```
## Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 0     | pass   |
| MEDIUM   | 0     | -      |
| LOW      | 0     | -      |

Verdict: APPROVE / WARNING / BLOCK
```

### Pair Programming Session
以下の項目を報告し、ペアプロセッションを開始してください。
- codemap: コードの解説
- try: 動作確認手順、Shell+Expect
- session: コード理解を促進する幾つかの代理質問
    - 〇〇のような入力があった場合、どのような挙動になりますか？
    - この処理のパフォーマンスが気になりますが、どの程度の負荷がかかりますか？
