---
title: "Amazon Bedrock AgentCore Paymentsとは？AIエージェント決済の権限設計"
shortTitle: "AgentCore Paymentsの権限設計"
description: "Amazon Bedrock AgentCore Paymentsは、Payment Sessionの有効期限と支出上限を超える支払いを署名前に止めます。AWSは支払い条件の設定と支払いの実行を別のIAMロールに分けるモデルを用意しており、導入側はそのロールを誰に割り当てるかを設計します。"
pubDate: 2026-09-29
tags: ["AIエージェント", "AgentCore Payments", "x402", "AP2"]
category: "ニュース解説"
readingTime: "6分"
heroImage: "/blog/2026-09-29-agentcore-payments-authorization-eyecatch.webp"
heroAlt: "「Amazon Bedrock AgentCore Payments AIエージェント決済の権限設計」の文字と、点と線のネットワークを配したタイトル画像"
featured: false
breaking: false
draft: false
---
AIエージェントに決済を任せる前に、誰が支出上限を決め、どの仕組みで超過を止めるかを明確にしておく必要があります。Amazon Bedrock AgentCore Paymentsは、モデルへの指示ではなく、決済処理を行うインフラで支払いを制御します。本記事の内容は2026年9月29日時点の公式情報に基づきます。

## AgentCore Paymentsは上限を超えた支払いを署名前に止める

AWSは2026年8月18日、Amazon Bedrock AgentCore Paymentsの一般提供（GA）を開始しました。2026年5月からプレビューとして提供されていたサービスです。[AWSの公式発表](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-payments-is-now-generally-available-enabling-agents-to-transact-safely-and-autonomously-at-scale/)によると、AIエージェントは有料API、MCPサーバー、デジタルコンテンツへの支払いをAgentCore経由で処理できます。

支払いの条件をひとまとまりで管理する仕組みをPayment Sessionと呼びます。AgentCore Paymentsは支払いのたびに条件を確認し、上限超過や期限切れなら支払いを拒否します。

[対応リージョン](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html)は米国、欧州、シンガポール、シドニーで、2026年9月時点では東京リージョンに対応していません。

## 支払いはPayment Session単位で制御する

処理は5段階です。

1. アプリケーションのバックエンドが、有効期限と、必要に応じて支出上限を指定してPayment Sessionを作成する
2. エージェントが有料APIへアクセスし、`HTTP 402 Payment Required`を受け取る
3. エージェントの支払い処理が`ProcessPayment`を呼び出す
4. AgentCore Paymentsがセッションの条件を確認し、接続先のウォレットを使って支払いに署名する
5. エージェントが支払い証明を添えて同じAPIをもう一度呼び出す

[公式ドキュメント](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-concepts.html)では、Payment Sessionの有効期限は必ず設定し、支出上限（`maxSpendAmount`と通貨）は任意で指定する項目です。上限を指定しないセッションでは金額による制限がかからないため、運用のルールで上限の指定を必須にする必要があります。

2026年9月時点で対応している決済方式は、HTTP 402を使う[x402](/blog/what-is-x402/)と、MPP（Machine Payments Protocol）です。署名とプロトコルごとの差の多くはAgentCore Paymentsが吸収しますが、支払い証明をヘッダー（x402は`X-PAYMENT`、MPPは`Authorization`）に付けて再送する処理はエージェント側に残ります。

## AWSは支払い条件の設定と支払いの実行を別のロールに分けている

[AWSのIAMロールの説明](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-iam-roles.html)では、AgentCore Paymentsの権限を5つに分けるモデルが示されています。

- 管理者（ControlPlaneRole）: Payment Manager、接続先の決済事業者、認証情報を管理する
- 開発者（ManagementRole）: ウォレットとPayment Sessionを管理する。`ProcessPayment`は明示的に拒否（Deny）される
- 支払いの実行（ProcessPaymentRole）: エージェントに代わって`ProcessPayment`を実行する
- サービスロール（ResourceRetrievalRole）: AgentCore Paymentsが実行時に認証情報を取得するために使う
- AWS Marketplaceの購読（Coinbaseを使う場合のみ、管理者に付与する管理ポリシー）

AWSはこの分離の理由を、1つの認証情報が漏れただけで「上限のないセッションを作り、そのセッションで支払う」ことができないようにするためと説明しています。セッションを作成する権限と`ProcessPayment`を同じロールに含めないよう、明示的に注意を促しています。

プレビュー期間中の2026年6月に[AWSが紹介したAmpersendの事例](https://aws.amazon.com/blogs/machine-learning/building-pay-per-intelligence-for-ai-agents-how-ampersend-uses-amazon-bedrock-agentcore-payments/)は、このモデルを実際に適用した例です。エージェントに付与するロールは`ProcessPayment`の実行に限定しており、予算の変更やウォレットキーへのアクセスはできません。支払いは、エージェントからAmpersendへ、Ampersendからモデル提供者への2段階です。

Ampersendの見積もりでは、ウォレット管理、署名、支出制御を自前で用意すると3〜4か月かかります。AgentCore Paymentsとの統合にかかった期間は2週間未満でした。あくまで同社の事例なので、導入期間の一般的な目安にはできません。

## AP2は許可内容、AgentCoreは支払い条件を扱う

Googleが発表したAgent Payments Protocol（AP2）は、ユーザーが何を許可したかを署名付きの「Mandate」として記録する仕様です。2026年4月に公開されたv0.2以降の[用語集](https://github.com/google-agentic-commerce/AP2/blob/main/docs/glossary.md)では、Mandateを購入手続きの完了を許可するCheckout Mandateと、支払いを許可するPayment Mandateに整理しています。条件だけを決めた段階のものをOpen Mandate、具体的な取引に結び付いたものをClosed Mandateと呼びます。

AP2の仕様策定は、2026年4月にGoogleから[FIDO Allianceへ提供](https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/)され、同団体のPayments Technical Working Groupで進められています。

AP2が記録するのは「誰が何を許可したか」です。AgentCore Paymentsは、Payment Sessionの条件に従って支払いを実行または拒否します。両者は扱う対象が異なるため、一方がもう一方を置き換えるものではなく、組み合わせて使うものと考えられます。

## 導入前に決めること

AWSの標準ロールを前提にすると、導入側で決める項目は次の6点です。

- 管理者、開発者、支払い実行の各ロールを、社内のどの担当者やシステムに割り当てるか
- Payment Sessionを作るとき、支出上限の指定を必須にするか。上限額と有効期限を誰が決めるか
- エンドユーザーがエージェント用の残高に入金し、支出を許可する導線をどう用意するか
- 決済事業者の認証情報（AgentCore Identity経由でAWS Secrets Managerに保管される）を、誰がどう更新・失効するか
- 再試行や重複支払いをどう検知するか（参考: [エージェント間決済が実は完了していない](/blog/2026-08-15-x402-facilitator-usenix-security/)）
- A2Aでタスクを委譲する権限と、決済を許可する権限をどう分けるか

支払い時の上限チェックはAgentCore Paymentsに任せられます。ただし、どのロールを誰に渡すか、上限をどう決めるか、異常をどう監視するかは導入側で決めます。

## 参照した一次情報

- [Amazon Bedrock AgentCore payments is now generally available（AWS）](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-payments-is-now-generally-available-enabling-agents-to-transact-safely-and-autonomously-at-scale/)
- [Core concepts for AgentCore payments（AWS）](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-concepts.html)
- [IAM roles for AgentCore payments（AWS）](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-iam-roles.html)
- [Supported AWS Regions（AWS）](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html)
- [Building pay-per-intelligence for AI agents（AWS）](https://aws.amazon.com/blogs/machine-learning/building-pay-per-intelligence-for-ai-agents-how-ampersend-uses-amazon-bedrock-agentcore-payments/)
- [AP2 Glossary（Google）](https://github.com/google-agentic-commerce/AP2/blob/main/docs/glossary.md)
- [FIDO Alliance to Develop Standards for Trusted AI Agent Interactions（FIDO Alliance）](https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/)
