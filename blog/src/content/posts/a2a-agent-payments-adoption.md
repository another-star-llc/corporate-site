---
title: "エージェント間取引の現在地と、Another Starが目指す信頼基盤"
shortTitle: "エージェント間取引と信頼基盤"
description: "AIエージェントが仕事や資源を売買するとき、決済規格だけでは何が残るのか。AP2・x402・MPPなどの現在地から、Another Starが目指す取引の信頼基盤と、仲介モデルの検証課題を示します。"
pubDate: 2026-10-11
tags: ["A2A", "エージェント経済", "AP2", "x402", "MPP"]
category: "技術解説"
readingTime: "20分"
heroImage: "/blog/a2a-agent-payments-adoption-eyecatch.webp"
heroAlt: "買い手と提供側のエージェントの間で、相手の選定・取引管理・成果確認をつなぐAnother Starの製品構想"
featured: false
breaking: false
draft: false
---

AIエージェントが外部の専門エージェントへ仕事を頼み、必要なデータや計算資源を買う。その取引を支える決済規格と製品が整いつつあります。一方で、お金を払えることだけでは、安心して仕事を任せられるようにはなりません。誰に依頼するか、どこまで権限を渡すか、成果をどう確かめ、失敗時に誰が対応するかが残ります。

**Another Starが目指すのは、外部エージェントの発見・評価・連携を、取引の管理と成果確認へつなぐ信頼基盤です。** 決済サービスによる資金処理と組み合わせながら、依頼から支払い、納品、失敗対応までを追える製品へ発展させることを構想しています。

この方向性を考えるには、規格の発表や決済件数と、実際の取引需要を分けて見る必要があります。エージェント間取引の将来像、現在利用できる規格・製品、それでも残る課題を順に整理し、当社が担おうとしている範囲と事業として検証すべき条件を示します。

> **情報基準：2026年10月。** 以下の決済連携・取引管理は当社の製品構想です。提供済みの決済機能を示すものではありません。将来の市場像と、説明に用いる価格・仲介料10％は仮説として扱います。

## エージェントが、他のエージェントから仕事や資源を買う世界

「競合3社を調べて、レポートにまとめてほしい」。利用者のエージェントが、この仕事を外部の調査エージェントへ依頼するとします。調査側も、企業データの取得、外国語資料の翻訳、分析に必要な計算資源を、それぞれ別の事業者から購入するかもしれません。

ここでは、レポートを売るエージェントが、別の取引では買い手になります。専門作業、データ、計算資源の市場がつながり、一つの依頼の下に複数の取引が生まれる構図です。さらに生産・配送のような物理サービスへ接続すれば、企業をまたいで仕事を分担する範囲も広がります。

A2AはAgent-to-Agent、つまりエージェント間のやり取りを指します。A2Aプロトコルは依頼、仕事の単位と進捗を表すTask、成果物を表すArtifactなどを共通化します。本稿でいう「A2A決済」は、こうした有料の仕事に購入の承認や支払いを結び付ける仕組みを指し、A2A本体が一つの決済手段を指定しているわけではありません。[A2A公式仕様](https://a2a-protocol.org/latest/specification/)

### 相手を選ぶ判断と、支出の判断が連続する

この将来像では、エージェントが人から目的・予算・品質条件を受け取り、条件に合う提供先を探し、必要に応じて実行途中にも依頼先を変えます。自動送金や従量課金は現在もありますが、仕事の選定、条件交渉、再委任、成果確認までが企業間で連続すると、管理する対象が増えます。

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="エージェント間取引の将来像と管理上の問い。横にスクロールできます">

| 取引の変化 | 想定する例 | 管理上の問い |
| --- | --- | --- |
| 相手を動的に選ぶ | 調査中に、別のデータ事業者へ切り替える | その相手と、その用途で取引してよいか |
| 小口の購入を繰り返す | データ1回、翻訳1文書、計算の利用量に応じて払う | 何を計測し、いつ精算するか |
| 売り手が買い手にもなる | 設計の売上でシミュレーションを購入する | 売上と支出、使える資金を区別できるか |
| 仕事を再委任する | 専門作業を分け、一部を代替事業者へ引き継ぐ | 予算・権限・責任が途中で失われないか |

</div>

研究論文『Virtual Agent Economies』と『Intelligent AI Delegation』は、専門化したエージェントの経済や、委任・検証の枠組みを考える材料になります。ただし、これらは市場の到来時期や規模を実証したものではありません。上の売買例も、それらの論点を踏まえた説明用の将来シナリオです。[Virtual Agent Economies](https://arxiv.org/abs/2509.10147)、[Intelligent AI Delegation](https://arxiv.org/abs/2602.11865)

当社が注目しているのは、この取引網の中で専門的な仕事を仲介する役割です。他社のデータ市場や計算事業者ともつながる経済の一部として、自社が仲介する取引の信頼性を支えることを考えています。

## 決済の標準化と製品化は、どこまで進んでいるか

2026年10月時点では、購入承認、支払要求、商品・注文の交換を扱う複数の規格が公開され、StripeやAWSなどの製品にも接続が進んでいます。ただし、規格ごとに共通化する対象が異なり、実際の資金処理には対応製品・地域・支払手段の条件があります。

### 規格は、同じ取引の異なる部分を共通化する

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="主要規格の役割と制約。横にスクロールできます">

| 規格 | 主に扱うもの | 取引全体との関係 |
| --- | --- | --- |
| A2A | 依頼、仕事の状態、成果物 | 仕事の会話をつなぐ。決済情報は拡張などで接続する |
| AP2（Agent Payments Protocol） | 購入・支払の承認、支払資格、検証、結果の証跡 | 何を承認して払ったかを結び付ける。配分や成果の合否は別に扱う |
| x402 | 有料資源への支払要求、支払情報、検証・精算の接続 | 対応する決済方式で処理する。仲介料や返金の条件は方式ごとに確認する |
| MPP（Machine Payments Protocol） | 共通の支払要求と、選択した支払方法への接続 | カードやウォレットの対応範囲は、方法・製品ごとに異なる |
| UCP（Universal Commerce Protocol） | 商品、購入条件、支払情報、注文・履行情報 | 商品を購入する手続きを接続する。仲介売上の配分は別に設計する |
| ACP（Agentic Commerce Protocol） | 買い手AIと店舗の購入手続き・注文 | 必要な店舗や販路と接続する。独自の仕事の検収は別に設計する |
| A2A x402拡張 | 同じTaskへの支払い待ち・支払状態の関連付け | 仕事と支払いを対応付ける。支払完了と仕事の完了は独立する |

</div>

AP2のv0.2は、署名付きの承認証書であるMandateから、支払資格、検証、結果のReceiptまでを扱います。資格を提供するCredential Providerと、処理を担うMerchant Payment Processorなどの役割も定義されています。一方、**購入を代行するShopping Agentから、別のShopping AgentへMandateを再委任することは現行仕様の範囲外**です。将来の多段取引に必要な権限管理が、すべて標準化済みという意味ではありません。[AP2 Specification v0.2](https://ap2-protocol.org/ap2/specification/)

x402の典型的な流れでは、売り手がHTTPの`402 Payment Required`応答で条件を示し、買い手が支払情報を付けて要求を再送します。売り手は検証・精算を補助するfacilitatorなどを利用して処理します。MPPも支払要求から処理へつなぎますが、支払方法を表すmethodによって実行内容が変わります。参照するHTTP Payment Authenticationは2026年9月9日付のInternet-Draft -01であり、RFCやIETF承認済み標準ではありません。HTTP 402を使うという共通点だけで、両者をそのまま互換とは扱えません。[x402公式リポジトリ](https://github.com/x402-foundation/x402)、[IETF Datatracker](https://datatracker.ietf.org/doc/draft-httpauth-payment/)

UCPの2026-08-25版にはA2Aを使う接続仕様があり、AP2拡張も任意で利用できます。ACPはOpenAIとStripeが共同で運営するbeta仕様で、公開版として2026-04-17版を参照しています。両者は商取引の接続を扱い、仕事の内容で排他的に使い分けるものではありません。また、UCPのSplit Paymentsは、買い手が複数の支払手段を併用する機能です。仲介者と事業者への売上分配とは異なります。[UCP A2A Binding](https://ucp.dev/2026-08-25/specification/shopping/checkout/a2a/)、[UCP Split Payments](https://ucp.dev/2026-08-25/specification/payment/extensions/split-payments/)、[ACP公式リポジトリ](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)

標準化も進行中です。FIDO AllianceはGoogleのAP2とMastercardのVerifiable Intentを基にした作業を発表していますが、統合初版の具体的な公開時期は本稿では未確認です。A2A x402拡張もv0.1の掲載例は`x402Version: 1`であり、x402本体V2との一律互換を前提にはできません。[FIDOの発表](https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/)、[A2A x402拡張仕様](https://github.com/google-agentic-commerce/a2a-x402/blob/main/spec/v0.1/spec.md)

### 製品として払えることと、どこでも使えることは別

StripeのMachine paymentsは、MPPでカードのShared Payment Token（SPT）とステーブルコイン、x402でステーブルコインを受け付けます。SPTは利用条件や期限を付けて渡す支払資格です。ステーブルコインは法定通貨等への価値連動を目指す暗号資産であり、USDCやUSDC.eはここで利用される通貨、Base・Tempo・Solanaは対応するネットワークです。[Stripe Machine payments](https://docs.stripe.com/payments/machine)

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="決済製品の利用条件。横にスクロールできます">

| 経路 | Stripeの公開条件 | 事業上の確認点 |
| --- | --- | --- |
| MPPのSPTカード | 最低0.50 USD | 買い手・売り手の提供地域と資格条件 |
| MPPのステーブルコイン | TempoのUSDC.e、SolanaのUSDC。最低0.01 USDC | 資産・ネットワーク・口座の条件 |
| x402のステーブルコイン | BaseのUSDC。最低0.01 USDC | 対応ウォレットと受付条件 |
| MPP sessions | 1セント未満の計量が可能。最低精算額0.01 USDC | 小口の利用を計量し、まとめて精算する条件 |

</div>

10ドルのレポートと、1回0.001ドルのデータ利用では、適した支払経路が変わります。後者を1,000回利用して合計1ドルで精算する設計なら、呼び出しごとの外部送金を減らせます。利用記録と送金の頻度を分けることは、少額取引の採算に関わります。

**日本での利用可否も、製品ごとに確認が必要です。** SPTの公開対象国一覧に日本は掲載されていません。一方、Stripeは米国外の事業者に、30以上の国でステーブルコイン受付の利用を申請する経路を案内しています。日本事業者の承認可否は個別確認事項です。買い手側のLink Agent Walletは支払顧客が米国・カナダの対象であり、販売者の所在に同じ条件を課しているわけではありません。[SPTの提供地域](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens.md?agent-seller=seller)、[Machine paymentsの条件](https://docs.stripe.com/payments/machine)、[Link Agent Wallet](https://docs.stripe.com/agentic-commerce/agents/link-agent-wallet)

ウォレットは鍵・残高・支払資格を管理する入口であり、カードを扱う製品もあります。カードでウォレット残高を購入した後にステーブルコインで払う経路と、売り手がカード売上を受け取る経路も異なります。「カードか暗号資産か」という二択ではなく、利用者の資金源と事業者の受取方法を分けて見る必要があります。

AWSのAmazon Bedrock AgentCore paymentsは2026年8月18日に一般提供され、x402とMPPへの対応を案内しています。これはエージェントが外部サービスを買う側の支払支援として捉えられます。支払証明の生成を示す`PROOF_GENERATED`は着金完了と同義ではなく、集金・配分・成果確認まで一括で完成するものではありません。[AWS一般提供発表](https://aws.amazon.com/about-aws/whats-new/2026/08/bedrock-agentcore-payments-ga/)、[AWSの支払処理](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-process-payment.html)

### 普及の数字は、何を数えているかまで読む

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="普及を示す数字とその限界。横にスクロールできます">

| 公表された数字 | 示す対象 | その数字だけでは分からないこと |
| --- | --- | --- |
| x402：約1億960万件・約1,500万ドル | Visa掲載の調整後集計。Artemisのデータに基づく2026年4月21日までの値 | 独立したAI利用者数、継続顧客数、10月時点の最新利用量 |
| UCP：数十万のブランド・小売 | Googleが2026年9月16日に公表したdirect checkoutの対応範囲 | 実売上がある店舗数、エージェント間の仕事の件数 |
| AP2：60超の協力組織 | 発表時の支持・協業の広がり | 本番の決済件数や稼働事業者数 |

</div>

x402の集計は、識別された見せかけの取引やテスト活動を除いた値です。別の学術研究は、Base上の異なる期間・母集団を分析し、関連者内取引などの混在を指摘しています。両者の数字を足し引きして実需を算出することはできません。[Visaの調査](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up)、[How Agentic Is Agentic Commerce?](https://arxiv.org/abs/2607.12575)

UCPとAP2の数字も、それぞれ接続可能な範囲と協力組織数として読む必要があります。[GoogleのUCP発表](https://blog.google/products-and-platforms/products/shopping/google-shopping-updates-holiday-shopping/)、[Google CloudのAP2発表](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)

ここから言えるのは、機械が支払うための接続手段が製品化されていることです。独立した買い手が継続して仕事を購入する市場の大きさや、仲介事業の採算は、別に確かめる必要があります。

## 支払いが可能になっても、取引を成立させる仕事が残る

利用者が承認した10ドルを、正しい相手へ支払えた。それでも、調査レポートが届かなければ依頼は完了しません。届いていても、必要な出典や調査対象が欠けていれば、合意した成果を満たさないことがあります。

A2A x402拡張も、支払いが完了していても成果物の生成中ならTaskは作業中であり得ると説明しています。署名は対応する鍵による署名であることを確認しますが、レポートの内容や品質まで保証するものではありません。[A2A x402拡張仕様v0.1](https://github.com/google-agentic-commerce/a2a-x402/blob/main/spec/v0.1/spec.md)

### 既存製品を使っても、仕事と資金の対応付けが必要になる

配分や返金は、すべてを独自開発する領域ではありません。Stripe Connectにはプラットフォーム向けの仲介料・送金機能があります。Tempo chargeの`methodDetails.splits`は、同じ通貨トークンを複数宛先へ原子的に、つまり一体の処理として配分する仕組みです。ただし、全MPP方式の共通機能ではありません。[Stripe Connectの仲介料](https://docs.stripe.com/connect/marketplace/tasks/app-fees)、[Tempo Charge draft](https://paymentauth.org/draft-tempo-charge-00.html)

そのうえで、どの注文に対していくら配分し、成果未達なら誰が負担するかは、取引の条件と結び付ける必要があります。Stripeでは顧客へ返金しても、プラットフォーム手数料であるapplication feeは既定で自動返還されず、関連するtransferも自動的には戻りません。顧客への返金、事業者分の回収、仲介料の返還をそれぞれ追う必要があります。[Connectの返金・紛争処理](https://docs.stripe.com/connect/marketplace/tasks/refunds-disputes)

**規格に含まれない機能があることだけで、当社の事業機会や優位性が成立するわけではありません。** 決済事業者の機能や利用企業自身の実装でも担える部分があります。当社の仮説は、エージェントの選定・評価と、実行後の成果・支払状態を一貫して扱うことで、外部へ仕事を任せる負担を減らせるというものです。

### 取引が並行・多段になるほど、管理する状態が増える

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="多段取引で起きる問題と必要な制御。横にスクロールできます">

| 変化 | 起きる問題の例 | 必要になる制御 |
| --- | --- | --- |
| 並行して発注する | 残り10ドルを二者が見て、それぞれ6ドル使う | 発注前に共有予算を予約し、二者目の超過を止める |
| 再委任する | 引き継ぎの途中で用途・期限・上限が失われる | 元の許可を超えない権限と、責任主体を確認する |
| 小口取引を繰り返す | 交渉・検証・送金費用がサービス価値を上回る | 利用を計量し、合意した範囲で精算を集約する |
| 仕事が分岐する | 分析が失敗しても、購入済みデータは戻らない | 依存関係を記録し、未実行分の中止と実行済み分の補償を分ける |
| 人が毎回検収しなくなる | 署名された不十分な成果を受け取る | テスト・独立評価・人の裁定を成果に応じて組み合わせる |
| 売上を当てに支出する | 未入金や同じ誤判断が他社への発注に波及する | 使える資金と受取予定を分け、未精算額・集中・頻度を制限する |

</div>

これは将来の取引像から導いた設計上の論点であり、現行規格がすべて提供する機能ではありません。交渉が速くなっても、生産・配送・品質検証・資金決済は同じ速度では完了しません。何を買ったか、どれだけ利用したか、成果が合格したか、資金が確定したかを、別々に記録して対応付ける必要があります。

## Another Starが目指す、エージェント間取引の信頼基盤

Another Starは、[製品ページ](/product)で、登録エージェントの審査、信頼スコア、仲介実行、異常検知を一体で扱う方向性を示しています。有償取引への拡張で目指すのは、依頼前の評価を、実際の注文・成果・支払結果の管理へつなげることです。

利用者側には、条件に合う相手へ予算の範囲内で仕事を任せ、成果と支出を確認できること。提供事業者側には、自社のエージェントを見つけてもらい、注文条件と対価、失敗時の対応を追えること。この双方を支える仲介サービスとして、製品を設計する構想です。

### 10ドルの仕事を仲介するモデル

当社の仲介エージェントが、外部事業者の調査レポートを利用者へ提示し、10ドルの購入を仲介するとします。提供事業者が売上の10％を仲介料にする条件へ合意していれば、利用者の支払総額10ドルのうち、1ドルが当社、9ドルが提供事業者の取り分になります。

![利用者の10ドルを決済基盤で処理し、仲介者1ドルと提供事業者9ドルへ配分する。成果物の納品と検収は別に確認する](/blog/a2a-agent-payments-transaction.svg)

*価格・10％の料率はモデルを説明する仮定です。税・決済費用を省略しており、1ドルは純利益ではありません。*

外部事業者宛ての請求を転送するだけでは、当社の仲介料は生まれません。元見積と仲介契約から利用者向けの注文を作り、支払先・配分先・成果条件を対応付け、決済製品の配分機能へ接続します。当社が材料の企業データを2ドルで仕入れる場合も、それはレポート販売とは別の取引として記録します。

この収益モデルで対価を得ようとしているのは、相手の選定、条件の整合、成果確認、支払管理、失敗対応です。料率の受容性も、それらがどの程度の価値を生むかも、今後の検証対象です。当社が仲介しない他社間の取引から、自動的に手数料を得る構想ではありません。

### 当社が管理する状態と、外部の決済製品を分ける

設計の中心は、一件の仕事を注文から返金まで追える取引基盤です。規格への接続を追加・変更しても、注文、予算、成果、配分、回復の履歴が残る構成を考えています。

![必要な規格へ接続し、Another Starの取引基盤で注文・承認、予算・権限、台帳・配分、検収・回復を管理する。資金処理は決済製品へ接続する設計案](/blog/a2a-agent-payments-architecture.svg)

*当社の設計構想。各規格・決済製品が全体を提供することや、当社がすでに実装・提供していることを示す図ではありません。*

1. **注文と承認を結び付ける。** 元見積、商品、価格、支払先、成果条件を保持し、条件が変われば再承認を判断する。
2. **権限と予算を確認する。** 相手・用途・期限を検査し、並行発注でも予算を超えないように予約する。
3. **実行と成果を追う。** 支払成功と納品・検収を別々に管理し、合意した成果条件と照合する。
4. **配分と回復を追う。** 入金10ドル、仲介料1ドル、事業者分9ドル、返金・回収の結果を元の注文へ結び付ける。

AIには相手の選定や条件調整を提案させ、支出は共有された予算と決まったルールを通して実行する設計です。AIの「支払済み」という文章を、入金の証拠にはしません。決済製品の通知・照会結果を照合し、応答が不明な場合に新しい送金を重ねない仕組みが必要です。

実装では、状態更新と送信予定を一緒に保存するTransactional Outbox、同じ操作の再実行を識別する冪等性キー、失敗した処理を別の取消・返金で補うSagaなどが候補になります。ただし、これらだけで外部資金の処理が必ず一回になることや、すべての補償が成功することは保証できません。[AWSのOutbox解説](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)、[Stripeの冪等なリクエスト](https://docs.stripe.com/api/idempotent_requests)、[AWSのSaga解説](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html)

また、自社の予算予約と、決済事業者による資金拘束は別です。事業者への配分であるtransferと、銀行口座への出金であるpayoutも異なります。保留・取消・返金が可能な条件を決済経路ごとに確かめる必要があり、Stripeのmanual payoutをエスクローとみなすことはできません。[Stripeの支払枠確保](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)、[Manual payouts](https://docs.stripe.com/connect/manual-payouts)

## この方向性を、何で検証するか

当社が検証したいのは、外部エージェントへの有償依頼が継続的に発生し、その取引を仲介する価値が運用費用を上回るかです。規格の採用数や接続できるエージェント数だけでは、この問いへの答えになりません。

### 需要、仲介の価値、採算を分けて測る

<div class="blog-table-wrap" tabindex="0" role="region" aria-label="仲介事業の仮説と検証項目。横にスクロールできます">

| 検証する仮説 | 確認すること |
| --- | --- |
| 外部の仕事を買う需要がある | どの仕事に実際の支払いが発生し、同じ利用者が再購入するか |
| 選定・評価が役に立つ | 相手を探す手間、依頼条件の調整、成果不合格を減らせるか |
| 取引管理に対価が付く | 直接接続と比べ、支払・検収・失敗対応の負担が減るか |
| 提供事業者が参加を続ける | 受注と運用負担を踏まえて、仲介料を受け入れられるか |
| 取引ごとの採算が合う | 仲介料から決済・評価・監視・返金・人の対応費用を引いて利益が残るか |
| 自律性を広げても管理できる | 予算超過、二重課金、未照合入金、未精算額を抑えられるか |

</div>

仲介料10％の例なら、10ドルの取引から得る1ドルの範囲で、こうした費用を賄えるかを確かめます。小口取引では、一件ごとの交渉や検収に人が入ると費用が重くなる可能性があります。利用の集約や検収の自動化が有効か、人の判断を残すべき仕事はどれかも、商品ごとの検証が必要です。

### 一件の取引から、多段の取引へ広げる条件

検証の初期範囲としては、事業者・商品・支払経路を限定し、集金、配分、納品、検収、返金までを通す構成を想定しています。実際の買い手が利用できるカードやウォレットを起点に、必要な規格を選びます。これは市場が完成したという判断ではなく、需要と運用の両方を観測するための方法です。

複数社への発注や従量利用へ進む際には、仕事の親子関係、利用量、相手別上限、部分失敗を管理できることを確認します。さらに多段委任へ広げるには、元の権限と予算が引き継がれ、取引が分岐・変更されても、止める範囲と負担者を追えることが条件になります。

- [ ] 利用者と提供事業者に、繰り返し取引する理由がある。
- [ ] 仲介料の受容性と、決済・評価・回復費用を含む採算を確認できる。
- [ ] 提供地域・口座・資格・対応版が、実際の買い手と売り手の条件に合う。
- [ ] 再送や結果不明でも、二重課金や配分漏れを防ぎ、照合できる。
- [ ] 未納品・品質未達・部分成功に対する再履行、返金、負担者を決められる。
- [ ] 予算・権限・未精算額に上限を設け、人が停止・介入できる。

エージェントが仕事を買えるようになるほど、その相手と成果を信頼できるかが問われます。**Another Starは、発見・評価・連携から取引の完了までをつなぐことで、企業が外部エージェントへ仕事を任せられる範囲を広げたいと考えています。** その製品価値を、実際の有償取引、継続利用、失敗対応を含む運用実績で確かめていく方針です。

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
