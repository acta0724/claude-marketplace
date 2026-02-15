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

### 引数バリデーション
`$1` はPR URLまたはブランチ名として使用されるため、シェルインジェクション防止のために以下を検証すること：

```bash
# PR URL形式 または ブランチ名形式のみ許可
if [[ "$1" =~ ^https://github\.com/[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+/pull/[0-9]+$ ]]; then
  : # 有効なPR URL
elif [[ "$1" =~ ^[a-zA-Z0-9/_.-]+$ ]]; then
  : # 有効なブランチ名
else
  echo "Error: 無効な引数です。PR URLまたはブランチ名を指定してください" >&2
  exit 1
fi
```

`gh wt co "$1"` で対象のworktreeに切り替えます（引数は必ずダブルクォートで囲むこと）。
もしも異なるリポジトリにいる場合は先に ~/ghq/github.com/{owner}/{repo} に移動してください。

## Process
parallelに以下のsubagentsを実行します
- QA subagent を使用して実際のユースケースを想定した動作確認を行います。
- deslop subagent を使用して不要なコードを除去し、pushします
- fixci subagent を使用してCIの問題を修正し、pushします

## Output
以下の項目を報告し、ペアプロセッションを開始してください。
- codemap: コードの解説
- try: 動作確認手順、Shell+Expect
- session: コード理解を促進する幾つかの代理質問
    - 〇〇のような入力があった場合、どのような挙動になりますか？
    - この処理のパフォーマンスが気になりますが、どの程度の負荷がかかりますか？
