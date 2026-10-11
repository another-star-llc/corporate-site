---
title: "A2A決済の規格・採用判断：仲介モデルと取引基盤の設計"
shortTitle: "A2A決済の規格・採用判断"
description: "AP2、x402、MPP、UCP、ACPを一つの購入例で比較。10％の仲介モデルを題材に、規格・決済製品・自社基盤の役割と、限定実証から始める導入条件を整理します。"
pubDate: 2026-10-11
tags: ["A2A", "AP2", "x402", "MPP", "エージェント決済"]
category: "技術解説"
readingTime: "25分"
heroImage: "/blog/a2a-agent-payments-adoption-eyecatch.webp"
heroAlt: "買い手と提供側のエージェントを仲介基盤でつなぎ、注文・支払い・成果物を照合する構成"
featured: false
breaking: false
draft: false
---

**取引基盤と限定実証には、今から着手できる。規格は、実際の買い手と接続先に合わせて選ぶ。** A2A決済を採用するうえでの提案は、この順序です。

エージェント間の仕事を有償で仲介するには、依頼を伝え、支払いを受け付けるだけでは足りません。利用者が何を承認したか、誰にいくら配るか、成果物を受け取れたか、失敗時に何を戻すかを、一件の取引として追う必要があります。AP2、x402、MPP、UCP、ACPはその一部を共通化しますが、どれか一つで全工程が完成するわけではありません。

この記事は、有償のエージェント連携を設計・採用する開発者とアーキテクトに向けた判断資料です。「競合3社の調査レポートを10ドルで買う」という例で規格と製品を比較し、仲介者が持つべき機能、将来の多段取引に必要な制御、最初の実証条件までをつなげます。A2A自体の基礎は[「A2Aとは？」](/blog/what-is-a2a/)、x402の基本フローは[「x402とは？」](/blog/what-is-x402/)も参照してください。

> **情報基準：2026年10月。** Another Starの仲介・決済モデルは設計提案であり、現在提供中の決済機能ではありません。人物・商品・価格と仲介料10％は説明用の仮定です。税・決済費用は省略しています。公開仕様・製品条件と、設計提案・将来シナリオを区別して記述します。

## 10ドルの取引を、請求・資金・成果の流れに分ける

利用者が自分のエージェントへ「競合3社を調べて。予算は10ドルまで」と依頼したとします。Another Starの仲介エージェントが外部の調査エージェントを選び、10ドルのレポートを購入する。提供事業者は、売上の10％を仲介料にする条件へ合意済みです。

このモデルでは、利用者が払う総額は10ドルです。その売上のうち1ドルが仲介者、9ドルが提供事業者の取り分になります。仲介料1ドルは追加請求でも、そのまま純利益でもありません。決済費用、返金、運用費を差し引いた採算は、別に検証する必要があります。

![利用者の10ドルの支払いを決済基盤で処理し、仲介者1ドルと提供事業者9ドルに配分する。成果物の納品と検収は資金の流れと別に確認する](/blog/a2a-agent-payments-transaction.svg)

*10％は提案上の配分例。資金処理は対応する決済基盤が実行し、仲介者は注文・配分・成果の対応を記録します。*

### 同じ購入を六つの工程で追う

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="購入の六工程。横にスクロールできます">

| 工程 | 起きること | 仲介者が確認すること |
| --- | --- | --- |
| ① 依頼・見積 | 外部事業者が商品、価格、成果条件を提示する | 元見積と利用者の依頼が対応しているか |
| ② 決済要求 | 外部の請求を基に、利用者へ購入条件を提示する | 金額、支払先、通貨、注文の版が固定されているか |
| ③ 承認・支払情報 | 利用者または代理エージェントが承認し、支払資格を渡す | 目的、予算、期限、支払先が承認範囲内か |
| ④ 支払処理・結果 | 決済基盤が検証・課金・精算を行う | 署名の有効性だけでなく、実際の処理結果を確認できるか |
| ⑤ 売上配分 | 契約に従い、仲介料1ドルと事業者分9ドルを扱う | 未払、配分済み、返金・回収を照合できるか |
| ⑥ 成果確認・回復 | レポートを受け取り、必要なら再履行や返金を行う | 支払成功と成果の合格を別々に判定できるか |

</div>

この六工程は責任を分けるための整理です。配分・納品・検収の実行順序は、契約と決済方式によって変わります。

外部事業者宛ての請求をそのまま転送しても、仲介料が自動的に生まれるわけではありません。元見積、仲介契約、利用者への注文、支払先、配分先を結び付け、選んだ決済製品に配分を設定します。利用者から誰が代金を受け付け、誰が返金責任を持つかも、この段階で決める事項です。[Stripe Connectのapplication fee](https://docs.stripe.com/connect/marketplace/tasks/app-fees)などは、この配分を実装する製品機能の一例です。

また、仲介者自身がレポートの材料となる企業データを2ドルで仕入れるなら、それは「レポート販売10ドル」と別の取引です。売上、仲介料、仕入れを混ぜず、それぞれの注文と支払結果を記録します。

## 規格は、同じ取引のどこを共通化するかで選ぶ

A2Aはエージェント間の依頼・タスク・成果物を扱います。そこに購入の承認、支払要求、決済結果、商品・注文の交換を加える規格が重なります。名前の似た規格を一列に並べるより、先ほどの六工程のどこへ置くかを決めると、採用条件が明確になります。

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="エージェント決済規格の役割比較。横にスクロールできます">

| 規格 | 主に共通化するもの | 仲介者に残る判断・実装 |
| --- | --- | --- |
| A2A | 依頼、Taskの状態、Artifactとしての成果物 | 料金条件、支払いの接続、成果の合否 |
| AP2 | 購入・支払の承認、資格、検証、署名付きの結果証跡 | 自社の予算管理、売上配分、成果の検収、回復 |
| x402 | 有料資源に対する支払要求、支払情報、検証・精算の接続 | 方式選定、仲介料、注文との照合、品質判断 |
| MPP | 共通の支払要求と、対応する支払方法への接続 | method・製品の選定、配分、検収・返金方針 |
| UCP | 商品、購入条件、支払情報、注文・履行情報 | 仲介契約、売上配分、調査タスクなどの独自検収 |
| ACP | 買い手AIと店舗の購入手続き・注文の接続 | 同上。必要な販路・取引先への適合判断 |
| A2A x402拡張 | A2AのTaskと、支払い待ち・提出・完了などの状態の関連付け | 決済処理、仲介料、仕事と資金の照合 |

</div>

この表は仕様の担当範囲を示したものです。汎用メッセージで別の情報を運べないという意味でも、対応製品が取引全体を保証するという意味でもありません。以下では、採用判断に影響する境界を確認します。

### AP2：承認から支払結果の証拠までをつなぐ

AP2は、単に購入の許可を出すだけの規格ではありません。署名付きの承認証書であるMandate、支払資格、検証、結果のReceiptを通じて、購入内容と支払いを結び付けます。役割にはShopping Agentのほか、支払資格を提供するCredential Provider、支払処理を担うMerchant Payment Processorなどがあります。ここでのMerchant Payment Processorという役割名と、別規格のMPPを混同しないようにします。[AP2 Specification v0.2](https://ap2-protocol.org/ap2/specification/)

一方、**Shopping Agentから別のShopping AgentへMandateを再委任することは、v0.2の範囲外**です。仲介者への支払いと提供事業者への配分を実装するために、利用者のカード権限をそのまま外部エージェントへ渡す設計を前提にする必要はありません。

FIDO Allianceでは、GoogleのAP2とMastercardのVerifiable Intentを基に標準化が進められています。ただし、本稿では統合初版の具体的な時期を確認できていません。予定の完成時期を前提にせず、内部の承認・予算・証跡を設計し、外部との交換は相手と対応版を限定して検証するのが現実的です。[FIDOの2026年4月28日発表](https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/)

### x402とMPP：買い手が払える経路を選ぶ

x402の典型的なHTTPフローでは、売り手が`402 Payment Required`で条件を示し、買い手が`PAYMENT-SIGNATURE`を付けて要求を再送します。売り手はfacilitatorなどへ検証・精算を依頼し、資源と支払結果を返します。ただし、実行順序や決済方式には選択肢があり、すべてを一律の前払いとみなすべきではありません。[x402公式リポジトリ](https://github.com/x402-foundation/x402)

MPPは、支払要求のchallengeから、選択したmethodの資格・処理・Receiptへつなぐ仕組みです。2026年10月時点で参照するHTTP Payment Authenticationは、**2026年9月9日付のInternet-Draft -01であり、RFCやIETF承認済み標準ではありません**。カード対応や配分機能はmethod・製品ごとに異なります。[IETF Datatracker](https://datatracker.ietf.org/doc/draft-httpauth-payment/)

両者でHTTP 402を使っていても、通信形式がそのまま互換になるわけではありません。選択の起点は「相手がどの方式、資産、ネットワーク、支払資格を利用できるか」です。x402全体が設計上カードを排除しないことと、ある製品のx402受付がstablecoinに限られることも、分けて評価します。

### UCPとACP：商品・注文としてつなぐ相手がいるときに追加する

UCPとACPは、商品を選び、金額や受取条件をそろえ、支払情報を渡して注文を作る商取引の接続を扱います。調査エージェントへの有償Taskと同じ概念ではありませんが、必要な相手が商品・注文として取引するなら採用候補になります。

UCPの2026-08-25版にはA2A Bindingがあり、AP2拡張も任意で利用できます。そのため「UCPはA2Aと無関係」と切り分けるのは不正確です。また、UCPの**Split Paymentsは、買い手が一回の購入に複数の支払手段を使う機能**です。仲介者と提供事業者へ売上を分配する機能とは異なります。[UCP A2A Binding](https://ucp.dev/2026-08-25/specification/shopping/checkout/a2a/)、[Split Payments Extension](https://ucp.dev/2026-08-25/specification/payment/extensions/split-payments/)

ACPはOpenAIとStripeが共同で運営するbetaの仕様で、公開版として2026-04-17版を参照できます。UCPと用途を無理に二分するより、必要な販路や店舗が対応している側を選ぶ方が実装範囲を定めやすくなります。[ACP公式リポジトリ](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)

### A2Aの支払い状態と、仕事の完了を分ける

A2A x402拡張v0.1は、Taskへ支払い待ちや支払情報の提出、完了・失敗などを関連付けます。仕様は、支払いが完了していても主なArtifactの生成が続いている場合、Taskは`working`であり得ると説明しています。**支払完了は、そのまま仕事の完了や成果の合格を意味しません。**[A2A x402拡張仕様v0.1](https://github.com/google-agentic-commerce/a2a-x402/blob/main/spec/v0.1/spec.md)

この拡張の例は`x402Version: 1`です。x402本体のV2と一律に互換だとみなさず、相手と拡張・方式・版を合わせる必要があります。AP2のFAQもA2A x402との連携を案内していますが、それは全実装で統合や相互運用が完成したことを示すものではありません。[AP2 FAQ](https://ap2-protocol.org/faq/)

### 普及の証拠は、数えた対象まで読む

仕様の公開、製品への接続、実際の商取引は、それぞれ別の進展です。代表的な数字も、同じ尺度の採用ランキングにはできません。

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="普及を示す数字とその限界。横にスクロールできます">

| 公表された数字 | 示していること | そこからは分からないこと |
| --- | --- | --- |
| x402：約1億960万件・約1,500万ドル | Visa掲載の調整後集計。Artemisのオンチェーンデータに基づき、2026年4月21日までを対象 | 独立したAI利用者数、継続顧客数、10月時点の最新利用量 |
| UCP：数十万のブランド・小売 | Googleが2026年9月16日に公表したdirect checkoutの対応範囲 | 実売上がある店舗数、A2A Taskの実行件数 |
| AP2：60超の協力組織 | 発表時の支持・協業の広がり | 本番の決済件数や稼働事業者数 |

</div>

x402の上記集計は、識別されたwash取引やテスト活動を除いた値です。別の学術研究はBase上の異なる期間・母集団を分析し、関連者内取引などの混在を指摘しています。母集団と手法の異なる数値を足し引きして実需を推定することはできません。[Visaの調査](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up)、[How Agentic Is Agentic Commerce?](https://arxiv.org/abs/2607.12575)

UCPの対応範囲とAP2の協力組織数も、それぞれ[Googleの発表](https://blog.google/products-and-platforms/products/shopping/google-shopping-updates-holiday-shopping/)、[Google CloudのAP2発表](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)が示す対象に限って読みます。横断的な利用統計が見つからない規格についても、それだけで「使われていない」とは判断できません。

## 支払支援、代金受付、売上配分を製品ごとに確認する

規格が接続方法を定めても、実際に資金を動かすのは対応する決済製品・決済網です。製品選定では、買い手の支払いを助ける機能、売り手として代金を受け取る機能、仲介料を配分する機能を、自社構成のどこへ置くか確認します。

### Stripe：Machine paymentsとConnectを組み合わせる

StripeのMachine paymentsは、MPPでカードのShared Payment Token（SPT）とstablecoin、x402でstablecoinを受け付けます。SPTは、利用条件や期限を付けてエージェントへ支払資格を渡す仕組みです。2026年10月時点の製品条件は次の通りです。[Stripe Machine payments](https://docs.stripe.com/payments/machine)

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="Stripeの機械決済条件。横にスクロールできます">

| 経路 | 対応する支払手段 | 最低額・精算条件 |
| --- | --- | --- |
| MPPのカード経路 | SPTを通じたカード | 最低0.50 USD |
| MPPのstablecoin経路 | TempoのUSDC.e、SolanaのUSDC | 最低0.01 USDC |
| x402のstablecoin経路 | BaseのUSDC | 最低0.01 USDC |
| MPP sessions | 小さな利用量を計量してまとめて精算 | 1セント未満で計量可能。最低精算額は0.01 USDC |

</div>

10ドルの成果物購入と、0.001ドルのデータ利用を1,000回繰り返す取引では、適した経路が異なります。後者は利用を都度記録し、合計1ドルで精算する設計も考えられます。少額・高頻度だからといって、すべての呼び出しで外部送金を行う必要はありません。

**日本での利用判断では、SPTとstablecoinの条件を混ぜないことが重要です。** SPTの公開対象国一覧に日本は掲載されていません。一方、Stripeは米国外の事業者に対し、アカウントIDを添えて30以上の国でstablecoin受付の利用を申請する経路を案内しています。日本の事業者が承認されるかは個別確認が必要です。通常の有人カード受付と、SPTによる代理購入も同じ地域条件ではありません。[SPTの提供地域](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens.md?agent-seller=seller)、[Machine paymentsの提供条件](https://docs.stripe.com/payments/machine)

買い手側のLink Agent Walletは、人の承認を経てエージェントの支払いを支援する製品です。支払いを行う顧客は米国・カナダが対象で、事業者・販売者の所在を同じ条件で制限しているわけではありません。ウォレットという名称だけでstablecoin専用と考えるのも誤りです。[Link Agent Wallet](https://docs.stripe.com/agentic-commerce/agents/link-agent-wallet)

10％の仲介料を扱うには、代金受付に加え、Connectなどの配分機能を設定します。返金時はさらに注意が必要です。Stripeでは、支払いを返金してもapplication feeは既定で自動返還されず、関連するtransferも自動的には戻りません。利用者への返金、事業者分の回収・相殺、仲介料の返還判断を、元の注文に結び付けて追います。[Connectの返金・紛争処理](https://docs.stripe.com/connect/marketplace/tasks/refunds-disputes)

### Tempo：同一tokenの原子的な配分を使う場合

Tempo chargeの`methodDetails.splits`フィールドは、同じ通貨tokenを複数の宛先へ原子的に配分するための仕組みです。10ドル相当を仲介者1・事業者9へ配る経路の候補になりますが、**すべてのMPP methodに共通する機能ではありません**。成果の検収、後日送金、返金まで自動化するものでもありません。[Tempo Charge draftのSplit Payments](https://paymentauth.org/draft-tempo-charge-00.html)

### AWS：仲介者が外部サービスを買う側の候補

Amazon Bedrock AgentCore paymentsは2026年8月18日に一般提供され、x402やMPPへの対応を案内しています。仲介者が外部データやツールを買う場合、ウォレットと予算を使って支払情報を生成する候補です。[AWSの一般提供発表](https://aws.amazon.com/about-aws/whats-new/2026/08/bedrock-agentcore-payments-ga/)

ただし、`ProcessPayment`の`PROOF_GENERATED`は支払証明の生成を示し、着金完了とは異なります。買い手側の支払支援を採用しても、仲介者への集金、売上配分、成果の検収は別に必要です。[AWS Process a payment](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-process-payment.html)


## 自社で持つのは、取引・予算・証跡・配分・回復

ここからは外部規格の機能一覧ではなく、仲介プラットフォームへの設計提案です。AIには相手の選定や条件調整を提案させ、支出は共有状態と決まったルールを通して実行します。規格ごとの接続処理を交換できるようにしながら、一件の取引を追う中核を自社で持ちます。

![A2A・AP2・x402・MPP・UCP・ACPの接続層の下に、注文、予算、台帳、検収、回復を持つ取引基盤を置き、決済事業者の処理結果を照合する構成](/blog/a2a-agent-payments-architecture.svg)

*機能の配置は設計提案です。各規格や決済製品が、この構成全体を提供することを意味しません。*

### 一件の注文を、支払いから返金まで追う

最小構成でも、元見積、仲介注文、利用者の承認、支払試行、成果物、配分、返金の対応が必要です。たとえば見積`Q1`から注文`O1`を作り、返金`R1`も`O1`へ結び付けます。送信を再試行した場合は、同じ業務操作であることを識別できるIDを使います。

1. **注文を固定する。** 商品、金額、通貨、支払先、成果条件と、その版を保持する。内容が変わった場合は承認の取り直しを判断する。
2. **許可と予算を検査する。** 目的、相手、金額、期限、失効状態を確認し、発注前に共有予算を予約する。
3. **実行要求と結果を記録する。** 課金や送金の要求を残し、外部処理の通知・照会結果から状態を更新する。
4. **成果を検収する。** 支払いの成功とは別に、レポートが合意した条件を満たしたか判定する。
5. **配分と回復を照合する。** 入金10ドル、仲介料1ドル、事業者分9ドル、返金・回収の処理結果を対応付ける。

仕事には「受注・実行・納品・検収」の状態があり、資金には「要求・処理中・確定・返金」の状態があります。LLMが「支払済み」と書いたことも、相手が「納品済み」と署名したことも、それだけで両方を完了にはできません。署名は対応する鍵による署名を、ハッシュは内容の一致を確認する材料であり、成果の正しさや品質の保証は別です。

### 再試行と不明状態を、二重課金につなげない

外部決済は、自社データベースの更新と同時には確定しません。そこで、取引状態の更新と送信予定イベントを同じデータベース取引で保存するTransactional Outboxや、同じ操作の再実行を識別する冪等性キーが候補になります。[AWSのTransactional Outbox解説](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)、[Stripeの冪等なリクエスト](https://docs.stripe.com/api/idempotent_requests)

ただし、これらを採用するだけで外部資金の処理まで「必ず一回」を保証できるわけではありません。応答が失われたときは、すぐ新しい送金を作るのではなく、元の操作の結果を照会・照合する必要があります。通知の重複、順序の逆転、タイムアウト、精算結果の不明状態を、通常の運用として扱います。

途中で仕事が失敗した場合も、消費済みのデータや確定した送金を履歴ごと消すことはできません。未実行分の取消、予約解除、返金、代替実行を別の操作として追加し、元の取引へ関連付けます。Sagaのような補償の考え方が参考になりますが、資金不足や契約条件により補償自体が完了しない可能性も管理します。[AWSのSaga解説](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html)

### 予算予約、資金拘束、後日送金は別の制御

自社台帳で10ドルを予約しても、決済事業者が利用者の資金を拘束したことにはなりません。カードの枠確保と売上確定を分けられるかは、手段や有効期限の条件次第です。相手が即時支払いしか受け付けない場合、内部予約だけで送金を保留することもできません。[Stripeの支払枠確保](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)

事業者への「後日支払い」も二つに分かれます。仲介者の未払台帳へ9ドルを計上して後日transferする場合と、事業者の決済残高へ配分したうえで銀行口座へのpayoutを待つ場合です。待っている場所と責任が異なります。Stripeのmanual payoutはエスクローサービスではありません。[Stripe Manual payouts](https://docs.stripe.com/connect/manual-payouts)

### 将来の取引網を想定すると、六つの制御が必要になる

将来は、専門作業、データ、計算資源、物理サービスを売買するエージェントが企業をまたいで連携し、ある取引の売り手が別の取引の買い手になる可能性があります。設計事業者が得た売上で計算を購入し、物流事業者が配送のために経路データを購入するような構図です。

『Virtual Agent Economies』や『Intelligent AI Delegation』は、こうした経済や委任を考えるための構想・枠組みを提示しています。ここで描く市場配置や到来時期が実証されたわけではありません。以下は、その将来像から自社の実装へ落とした設計上の論点です。[Virtual Agent Economies](https://arxiv.org/abs/2509.10147)、[Intelligent AI Delegation](https://arxiv.org/abs/2602.11865)

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="将来の取引で起きる問題と制御。横にスクロールできます">

| 取引の変化 | 起きる問題の例 | 備える制御 |
| --- | --- | --- |
| 並行して発注する | 残り10ドルを二者が見て、それぞれ6ドルを使う | 残高確認と予約を原子的に行う。先の6ドルを予約したら残り4ドルにする |
| 相手・委任先が変わる | 再委任の途中で用途・期限・上限が失われる | 元の許可を超えない権限、失効、責任主体、再委任の深さを支出時に確認する |
| 小口の購入を繰り返す | 交渉・検証・送金費用がサービス価値を上回る | 利用量の計測と外部精算を分け、合意した閾値・期間で集約する |
| 仕事が分岐し、組み替わる | 一部が失敗しても、消費済みのデータは戻らない | 親子取引と依存関係を持ち、部分ごとに中止・補償・再実行する |
| 人が毎回の成果を見なくなる | 正しく署名された、不十分な成果を受け取る | テスト、独立評価、人の裁定を成果に応じて使い分ける |
| 売上を当てに取引が連鎖する | 未入金や同じ誤判断が、他社への支出へ波及する | 現金と受取予定を分け、未精算額・相手別集中・発注頻度に上限を置く |

</div>

交渉が速くなっても、生産・配送、成果の検証、資金決済が同じ速度になるとは限りません。「何をいくらで買うか」「どれだけ利用したか」「成果を受け取れたか」「いつ精算するか」を別々に記録して結び付ける構成が必要です。AP2などの現行規格が、上表の多段制御をすべて実装するという意味ではありません。

## 1社・1商品・1経路で、返金まで通して判断する

最初に検証するのは、一件の取引を最後まで追えることです。対象事業者、商品、支払経路を限定し、集金、10％配分、納品、検収、返金を通します。買い手が人なら、通常の有人カード決済から収益モデルを試すこともできます。

買い手がエージェントの場合は、その買い手が払える方式から選びます。カードの代理利用が必要でSPTの対象国・資格条件が合うならMPP、対応ウォレットを持つならx402またはMPPの必要方式を検証します。

カードでウォレット残高を購入してstablecoinで支払う経路は、売り手がカード売上を受け取る経路とは異なります。資金源と売り手の受取手段を区別します。購入の証拠を相互検証する相手がいればAP2、商品・注文で接続する相手がいればUCPやACPを加える、という順序です。

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="段階的な導入計画。横にスクロールできます">

| 段階 | 実装・検証する範囲 | 次へ進む判断材料 |
| --- | --- | --- |
| 1社・1商品・1経路 | 注文ID、予算、課金、配分、検収、返金、手動停止 | 再送や結果不明時も、二重課金と配分漏れを防げる |
| 複数社・従量利用 | 親子取引、利用計測、相手別上限、段階精算、部分失敗 | 失敗した範囲を止め、補償と再実行を追える |
| 多段委任・複数市場 | 権限の連鎖、動的な再配分、合意範囲での集約精算 | 深い取引網でも予算・権限・未精算額を制約できる |

</div>

### 本番移行前に確認すること

- [ ] 買い手、仲介者、提供事業者の地域・口座・支払資格が、選んだ経路の条件を満たす。
- [ ] 見積から注文、承認、支払先、成果条件までが対応し、金額変更時の再承認を判断できる。
- [ ] 再送、通知遅延、重複通知、結果不明でも、同じ取引を二重に課金しない。
- [ ] 予算超過、失効した権限、許可範囲外の支払先への要求を拒否できる。
- [ ] 入金10ドル、仲介料1ドル、事業者分9ドルを照合し、返金時の回収・相殺も追える。
- [ ] 未納品、品質未達、部分成功のときに、再履行・返金・負担者を決めて実行できる。
- [ ] 決済費用と回復費用を差し引いた仲介粗利を測定できる。

評価指標は、決済成功率だけでは足りません。二重課金、未照合入金、返金所要時間、検収不合格、回復に要した費用を合わせて見ます。10％という仲介料が受け入れられるかも、規格の普及とは別の検証です。

仲介者が提供する価値は、相手の選定、条件の整合、成果確認、支払管理、失敗対応にあります。まずその価値と採算を限定実証で確かめ、実際の接続需要と運用実績に合わせて規格と自律性を広げることを提案します。

*仕様と製品条件は変化します。実装着手時と本番移行時に、AP2・MPP等の対象版、SPTとstablecoinの提供地域、配分・返金の条件を再確認してください。FIDOでの統合仕様の公開時期は、本稿では未確認です。*

## 参照した一次情報

本文のリンクに加え、設計・採用時に参照する主な仕様と製品文書をまとめます。研究論文は将来像や課題を考える材料であり、市場の到来時期・規模を実証する資料としては扱っていません。

- [A2A Protocol Specification（A2A）](https://a2a-protocol.org/latest/specification/)
- [AP2 Specification v0.2・役割と再委任の範囲（AP2）](https://ap2-protocol.org/ap2/specification/)
- [AP2 FAQ・x402との関係（AP2）](https://ap2-protocol.org/faq/)
- [Agentic AI標準化作業の発足（FIDO Alliance）](https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/)
- [x402の仕様と実装（x402 Foundation）](https://github.com/x402-foundation/x402)
- [HTTP Payment Authentication draft -01（IETF Datatracker）](https://datatracker.ietf.org/doc/draft-httpauth-payment/)
- [Tempo ChargeとSplit Payments（paymentauth.org）](https://paymentauth.org/draft-tempo-charge-00.html)
- [UCP Checkout A2A Binding・2026-08-25版（UCP）](https://ucp.dev/2026-08-25/specification/shopping/checkout/a2a/)
- [UCP Split Payments Extension（UCP）](https://ucp.dev/2026-08-25/specification/payment/extensions/split-payments/)
- [ACPの仕様と運営（ACP）](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)
- [A2A x402拡張v0.1（Google Agentic Commerce）](https://github.com/google-agentic-commerce/a2a-x402/blob/main/spec/v0.1/spec.md)
- [Machine payments・最低額と提供地域（Stripe）](https://docs.stripe.com/payments/machine)
- [SPTの提供条件（Stripe）](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens.md?agent-seller=seller)
- [Link Agent Wallet（Stripe）](https://docs.stripe.com/agentic-commerce/agents/link-agent-wallet)
- [Connectの返金と紛争処理（Stripe）](https://docs.stripe.com/connect/marketplace/tasks/refunds-disputes)
- [Manual payouts（Stripe）](https://docs.stripe.com/connect/manual-payouts)
- [AgentCore payments一般提供（AWS）](https://aws.amazon.com/about-aws/whats-new/2026/08/bedrock-agentcore-payments-ga/)
- [Agentic payments from the ground up（Visa）](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up)
- [How Agentic Is Agentic Commerce?（arXiv）](https://arxiv.org/abs/2607.12575)
- [Virtual Agent Economies（arXiv）](https://arxiv.org/abs/2509.10147)
- [Intelligent AI Delegation（arXiv）](https://arxiv.org/abs/2602.11865)
