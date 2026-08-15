---
title: "エージェント間決済が実は完了していない——x402の31件の脆弱性が示した外部連携の落とし穴"
shortTitle: "x402決済31件の脆弱性が示した外部連携の落とし穴"
description: "AIエージェントや外部サービスに仕事を頼んだとき、返ってきた「完了しました」をどう確かめますか。x402決済の仲介者15社で見つかった31件の脆弱性を手がかりに、「成功応答」と「実際の処理成立」を同一視する危険を、決済を使っていないA2A連携にもつながる問題として整理します。"
pubDate: 2026-08-15
tags: ["論文レビュー", "x402", "セキュリティ", "A2A"]
category: "定点観測"
readingTime: "8分"
heroImage: "/blog/x402-facilitator-eyecatch.webp"
heroAlt: "2体のAIエージェントをつなぐ橋が中央で崩落し、チェックマークの付いた箱だけが宙に浮いている概念図"
---

<div class="report">
<style>
.report{--c:#67e8f9;--c2:#22d3ee;--dim:#9ca3af;--void:#f87171;--card:#0a0a14;--bd:rgba(255,255,255,.1);margin:1rem 0 0}
.report .lead{font-size:1.06rem;color:#e5e7eb;line-height:1.9}
.report .kicker{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--c);margin:2.8rem 0 .4rem}
.report h2.rh{font-size:1.35rem;font-weight:400;margin:.2rem 0 1rem;color:#fff;border:0;padding:0}
.report h3{font-size:1.05rem;font-weight:500;margin:1.8rem 0 .65rem;color:#e5e7eb}
.report p{line-height:1.9}
.report ul{padding-left:1.2rem;line-height:1.85}
.report li{margin:.25rem 0}
.report figure{margin:1.6rem 0;padding:1.25rem 1.25rem 1.1rem;border:1px solid var(--bd);border-radius:14px;background:var(--card)}
.report figcaption{font-size:.8rem;color:var(--dim);margin-top:.7rem;line-height:1.6}
.report .conclusion{margin:1.5rem 0 2rem;padding:1.2rem 1.3rem;border:1px solid rgba(103,232,249,.38);border-radius:14px;background:linear-gradient(135deg,rgba(103,232,249,.11),rgba(34,211,238,.03))}
.report .conclusion .label{margin:0 0 .45rem;font-size:.72rem;letter-spacing:.13em;color:var(--c)}
.report .conclusion p{margin:0;color:#e5e7eb;font-size:1rem}
.report .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:.7rem;margin:1.4rem 0}
.report .tile{border:1px solid var(--bd);border-radius:12px;background:var(--card);padding:.95rem 1rem}
.report .tile .num{font-size:1.75rem;font-weight:400;color:var(--c);line-height:1.05}
.report .tile .num small{font-size:.9rem;color:var(--dim)}
.report .tile .lbl{font-size:.78rem;color:var(--dim);margin-top:.35rem;line-height:1.4}
.report .hb{display:grid;grid-template-columns:11em 1fr 4.7em;align-items:center;gap:.55rem;margin:.48rem 0;font-size:.88rem}
.report .hb .l{color:#cbd5e1;text-align:right;line-height:1.3}
.report .hb .t{height:.9rem;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.report .hb .f{display:block;height:100%;background:linear-gradient(90deg,#0e7490,var(--c));border-radius:4px}
.report .hb .v{color:#e5e7eb;font-variant-numeric:tabular-nums}
.report .hb.primary .f{background:linear-gradient(90deg,var(--c2),#a5f3fc)}
.report .hb.primary .v{color:var(--c)}
.report .hb.void .f{background:var(--void)}
.report .hb.void .v{color:var(--void)}
.report .note{border-left:2px solid var(--c);background:rgba(103,232,249,.05);padding:.8rem 1rem;border-radius:0 10px 10px 0;font-size:.92rem;color:#cbd5e1;margin:1.2rem 0}
.report .void-note{border-left-color:var(--void);background:rgba(248,113,113,.06)}
.report .caveats{border:1px solid var(--bd);border-radius:12px;padding:1.1rem 1.25rem;background:var(--card);font-size:.88rem;color:var(--dim)}
.report .table-wrap{overflow-x:auto;margin:1.3rem 0;border:1px solid var(--bd);border-radius:12px;background:var(--card)}
.report table{width:100%;border-collapse:collapse;min-width:540px;font-size:.86rem}
.report th,.report td{padding:.7rem .8rem;border-bottom:1px solid var(--bd);text-align:left;line-height:1.5}
.report th{color:#fff;font-weight:500;background:rgba(255,255,255,.035)}
.report td.num{text-align:right;font-variant-numeric:tabular-nums}
.report tr:last-child td{border-bottom:0}
.report .src{font-size:.78rem;color:#6b7280;margin-top:1.6rem}
.report .flow{display:grid;gap:.5rem;margin:1.2rem 0}
.report .flow .step{display:grid;grid-template-columns:2.2em 1fr;gap:.8rem;align-items:start;padding:.75rem .9rem;border:1px solid var(--bd);border-radius:10px;background:var(--card);font-size:.9rem;line-height:1.6}
.report .flow .step b{color:#e5e7eb}
.report .flow .n{color:var(--c);font-variant-numeric:tabular-nums}
.report .flow .step.gap{border-color:rgba(248,113,113,.4);background:rgba(248,113,113,.06)}
.report .flow .step.gap .n{color:var(--void)}
@media(max-width:480px){.report .hb{grid-template-columns:8em 1fr 4.1em;font-size:.8rem}.report table{font-size:.8rem}}
</style>
<p class="lead">AIエージェントや外部サービスに仕事を頼んだとき、返ってきた「完了しました」を、どうやって確かめていますか。多くの実装が確認しているのは「返事が返ってきたこと」であって、「仕事が本当に終わったこと」ではありません。今回の論文は、この差が失敗として見えやすい機械間決済を大規模に実測しました。<b>USENIX Security 2026</b>で発表された研究です。</p>
<div class="conclusion">
<p class="label">今回の要点</p>
<p><b>外部のサービスや別のAIエージェントから「確認できました」「完了しました」と返ってきても、処理が本当に成立したとは限りません。</b> x402では、支払いの「検証」と実際の「決済」が別の時点で起きます。検証に成功しても決済が成立しないことがあり、多くの実装はその差を確認せずに商品やサービスを渡していました。</p>
<p style="margin-top:.7rem;color:#cbd5e1;font-size:.92rem">まず自社で確認したいのは2点です。<b>「完了」を何で判定しているか</b>、そして<b>失敗したときに自社側で進めた処理をどこまで戻せるか</b>です。</p></div>
<p>これは決済だけの話ではありません。<b>AIエージェントが外部のサービスや別のAIエージェントに仕事を頼んだとき、その仕事が本当に終わったのかを、頼んだ側が確かめられない</b>という構造の問題です。たとえば、外部のエージェントに在庫引当やデータ登録を頼み、「完了しました」という返事を受けて自社側で次の処理へ進むケースです。返事が来たことだけを完了の根拠にすると、x402と同じ形のズレが起こり得ます。</p><p>この記事では、こうして仕事を外部に任せることを「<b>委任</b>」、頼まれる外部サービスやエージェントを「<b>委任先</b>」と呼びます。以降はこの言葉も使いますが、意味は「外部に仕事を頼むこと／頼まれた相手」です。</p>
<div class="kicker">01 — 論文が突きつけた一文</div>
<h2 class="rh">「支払い確認OK」は、入金を意味しない</h2>
<p>x402は、HTTPの <code>402 Payment Required</code> を使ってAPIやリソースへの支払いを自動化するオープン標準です。買い手（多くはAIエージェント）が署名済みの支払いデータを送り、売り手のサーバーはそれを<b>ファシリテーター</b>と呼ばれる第三者に渡して検証してもらい、実際のブロックチェーン上の決済もその第三者に委ねます。</p>
<p>問題は、この流れが一度で完結しないことです。</p>
<div class="flow">
<div class="step"><span class="n">1</span><span>買い手が署名済みの支払い証明を送る</span></div>
<div class="step"><span class="n">2</span><span>サーバーがファシリテーターに <code>/verify</code> を依頼 → <b>「有効です」</b></span></div>
<div class="step gap"><span class="n">3</span><span><b>サーバーが業務ロジックを実行し、商品やデータを返す</b> ← ここで多くの実装が完了扱いにする</span></div>
<div class="step"><span class="n">4</span><span>ファシリテーターが <code>/settle</code> でオンチェーン決済を送信</span></div>
<div class="step gap"><span class="n">5</span><span><b>決済が失敗・期限切れ・リバートすることがある</b> ← 商品はすでに渡っている</span></div>
</div>
<p>3と5のあいだには、トランザクションの構築、ブロードキャスト、ネットワーク伝播、ブロックへの取り込みという実時間の遅延があります。<b>2で「有効」と言われたことは、4が成功することを保証しません。</b>論文はこの意味的なギャップを起点に、実装がどう壊れるかを体系的に調べました。</p>
<div class="note void-note"><b>具体例として、Coinbase の Flask SDK（v0.2.1以下）は検証成功の直後に保護リソースを返し、決済成立を待ちません。</b>加えて論文は、評価したマーチャントSDKの<b>いずれも、業務ロジックの副作用に対する明示的なロールバック機構を実装していない</b>と報告しています。x402 v2 はコールバックインターフェースを導入しましたが、これはロールバックのプリミティブとしては規定されておらず、補償と原子性の担保はアプリケーション側に残されています。</div><h3>この構造を、自社のAIエージェント連携に置き換える</h3><p>ここで、x402を使っていない自社システムに置き換えてみます。決済の「検証」と「成立」のズレは、外部サービスやAIエージェントに仕事を頼む場面にもほぼそのまま対応します。</p><div class="table-wrap">
<table>
<thead><tr><th>x402で起きていること</th><th>決済を使わない外部連携では</th></tr></thead>
<tbody>
<tr><td><code>/verify</code> が「有効です」を返す</td><td>外部サービスやAIエージェントが 200 を返す、「実行しました」と応答する</td></tr>
<tr><td><code>/settle</code> がチェーン上で成立したか</td><td>相手側のシステムに、実際にレコードが入ったか</td></tr>
<tr><td>検証成功の時点で商品を渡す</td><td>応答を受けた時点で次の処理（発注確定、通知送信）に進む</td></tr>
<tr><td>決済失敗時のロールバック機構がない</td><td>外部側で失敗しても、自社側で進めた処理を戻す手段がない</td></tr>
<tr><td><code>validBefore</code> が3〜7秒と短すぎる</td><td>依頼の有効期限が、実際の処理時間より短く設定されている</td></tr>
<tr><td>ファシリテーターが1社に集中している</td><td>処理を単一の外部サービスやエージェントに寄せている</td></tr>
</tbody>
</table>
</div><p>x402が示したのは、この差を埋める仕組みを設計しないと、失敗が静かに通過してしまうということでした。決済では失敗が金額として即座に見えます。それ以外の委任では、見えないまま蓄積します。</p>
<div class="kicker">02 — 15社すべてが違反</div>
<h2 class="rh">仲介先を選び直しても回避できない</h2>
<p>論文の著者らは半自動検査ツール <code>X402SCOPE</code> を使い、主要ファシリテーター15社を外部から検査しました。</p>
<div class="tiles">
<div class="tile"><div class="num">15<small> / 15社</small></div><div class="lbl">少なくとも1つの規則に違反</div></div>
<div class="tile"><div class="num">49<small> 件</small></div><div class="lbl">検出された規則違反</div></div>
<div class="tile"><div class="num">31<small> 件</small></div><div class="lbl">新規に発見された脆弱性</div></div>
<div class="tile"><div class="num">8<small> / 8</small></div><div class="lbl">すべての規則が、いずれかの実装で違反されていた</div></div>
</div>
<p>49件の規則違反は、手動確認を経て<b>31件の新規脆弱性</b>に整理されました。重要なのは、特定の一社だけの問題ではなく、<b>15社すべてが少なくとも1つの規則に違反していた</b>ことです。</p>
<p>つまり「評判の良い仲介先を選ぶ」だけでは回避できません。<b>委任先を信頼することと、委任結果を検証できることは別</b>です。</p>
<div class="kicker">03 — 4つの失敗モード</div>
<h2 class="rh">外部に任せた処理が失敗したとき、誰が損をするか</h2>
<p>検出された違反から、論文の著者らは4つの攻撃ベクトルを導きました。注目したいのは攻撃手法そのものより、<b>損失が誰に着地するか</b>です。</p>
<div class="table-wrap">
<table>
<thead><tr><th>失敗モード</th><th>何が起きるか</th><th>損をするのは</th><th class="num">実測</th></tr></thead>
<tbody>
<tr><td><b>Free Shopping</b></td><td>検証は通るが決済が成立せず、商品やデータだけが渡る</td><td>売り手</td><td class="num">高リスク10件<br/>完全実証2件</td></tr>
<tr><td><b>Gas Abuse</b></td><td>攻撃者が仲介者負担のオンチェーン実行コストを膨らませる</td><td>ファシリテーター</td><td class="num">3件</td></tr>
<tr><td><b>Service Denial</b></td><td>検証と決済の状態のずれを突かれ、決済サービスが機能しなくなる</td><td>売り手・買い手</td><td class="num">全15社が高リスク</td></tr>
<tr><td><b>Asset Theft</b></td><td>決済処理が「仲介者の署名と資金で任意の宛先に任意の命令を送る」手段に転化する</td><td>ファシリテーター</td><td class="num">1件</td></tr>
</tbody>
</table>
</div>
<p>ここで一つ、断っておくべきことがあります。<b>この表では、仕事を頼んだ側だけが損をする行はありません。</b> x402では支払う側よりも、受け取る側（売り手）や決済を仲介する側に損失が出やすいからです。ただし、決済を伴わない外部連携では話が変わります。外部サービスやAIエージェントに処理を任せ、その返事を受けて自社の処理を進める場合、「完了した」という報告を信じて次に進むのは自社側です。同じ確認不足が、今度は自社の損失として現れます。</p>
<div class="kicker">04 — オンチェーン実測</div>
<h2 class="rh">1億1900万件の実取引でも、失敗コストは発生した</h2>
<p>論文は2025年10月1日から12月26日までのBaseとSolanaの取引<b>1億1900万件超</b>も分析しています。実験環境だけではなく、実取引でも問題の影響を確認するためです。</p>
<figure>
<div class="hb primary"><span class="l">Coinbase</span><span class="t"><span class="f" style="width:100%"></span></span><span class="v">77.17M件</span></div>
<div class="hb"><span class="l">第2階層</span><span class="t"><span class="f" style="width:14%"></span></span><span class="v">PayAI / Dexter / Daydreams ほか</span></div>
<figcaption>取引件数・決済額のいずれもCoinbaseが大差で首位です（7717万件、2685万ドル）。ピーク時は1日あたり約350万件、日次USDC決済額270万ドル超に達しました。</figcaption>
</figure>
<p>取引は主要事業者に集中しており、 1社の欠陥がエコシステム全体の露出になりやすい 構造でした。これは、AIエージェントの外部処理を単一のサービスやエージェントに寄せる設計でも同じです。</p>
<p>決済の試行でファシリテーターが負担したガス・手数料は、累計で約<b>20万2000ドル</b>にのぼります。このうち<b>失敗して巻き戻された送信によるものは約5800ドル</b>で、残りは成立した決済のコストです。失敗分に限れば金額は大きくありません。それでも、支払いが成立しなかった取引のコストを回収する手段はなく、負担しているのは仲介側です。<b>委任が失敗したときのコストを誰が負担するかは、設計で決まります。</b></p>
<div class="kicker">05 — 前回の観測とつなげると</div>
<h2 class="rh">「相手の条件」と「本当に終わったか」の両方を確認しにくい</h2>
<p>前回の記事では、公開A2Aエージェント194件を調べました。<a href="/blog/2026-08-09-a2a-agents-liveness-x402/">前回の実測</a>では、認証要件の記載があるのは1件、認証方式も1件、ライセンスと料金情報は0件でした。つまり、外から見ただけでは「このエージェントに何を、どんな条件で頼めるのか」が分かりにくい状態でした。今回の論文が見ているのは、その先で支払いを確認・決済する仲介側です。</p>
<p>対象も調査方法も違うため、数字を直接比べることはできません。ただ、共通しているのは、<b>外部の相手に仕事を頼むとき、「どんな条件で動く相手なのか」と「頼んだ仕事が本当に終わったのか」の両方を、外から確認しにくい</b>ことです。前回は「頼む前の情報不足」、今回は「頼んだ後の成立確認の不足」を見ている、と考えるとつながりが分かりやすくなります。</p>
<div class="kicker">06 — 確認できること</div>
<h2 class="rh">x402を使っていなくても、今日確認できる5点</h2>
<p>ここまでの論点を、x402を使っていない会社でも今日確認できる項目に落とします。外部サービスやAIエージェントに仕事を頼んでいるなら対象です。</p>
<ul>
<li><b>完了の定義</b>：外部サービスやAIエージェントから「完了しました」と返ってきただけで、仕事が終わったとみなしていないか。相手側の状態を別の方法で確認しているか</li>
<li><b>失敗したときに戻せるか</b>：外部側で失敗したとき、自社側ですでに進めた処理（在庫引当、通知、後続の依頼）を戻す手段があるか</li>
<li><b>タイムアウトの整合</b>：依頼の有効期限が、実際の処理時間より短くなっていないか</li>
<li><b>失敗コストの帰属</b>：外部処理が失敗したとき、コストを負担するのは自社か、相手か、その先か。契約上の想定と実装が一致しているか</li>
<li><b>依存先の集中</b>：重要な処理を1社・1サービス・1エージェントに寄せすぎていないか。その相手の不具合がそのまま自社の障害にならないか</li>
</ul>
<h3>x402を実装している場合の追加5点</h3>
<p>すでにx402を実装・検証している場合は、論文の指摘から直接確認できる項目があります。</p>
<ul>
<li><b>保護リソースの解放境界</b>：検証成功で返しているか、決済成立を待っているか。前者なら Free Shopping の前提条件を満たします</li>
<li><b>マーチャントSDKのバージョン</b>：Coinbase Flask SDK は v0.2.1以下が該当します。利用中のSDKが決済成立で応答をゲートしているか確認してください</li>
<li><b>決済失敗時の補償設計</b>：業務ロジックの副作用を巻き戻す手段がアプリケーション側にあるか</li>
<li><code>validBefore</code> <b>の設定値</b>：論文は3〜7秒という極端に短い設定を多く観測しています。検証から決済送信までの遅延を吸収できず、失敗率を上げます</li>
<li><b>ファシリテーターの多重化</b>：単一の仲介者への依存が、そのままシステミックリスクになります</li>
</ul>
<h3>参考：論文が導出した8つのセキュリティ規則</h3>
<p>論文の著者らはファシリテーターが決済インフラとして満たすべき規則を8つ定義しました。前半4つは「いつ支払い済みと認可してよいか」（認可の正しさ）、後半4つは「決済時にチェーン上で何を実行してよいか」（実行安全性）を規定します。</p>
<div class="table-wrap">
<table>
<thead><tr><th>規則</th><th>内容</th><th class="num">違反</th></tr></thead>
<tbody>
<tr><td><b>SR1</b></td><td>検証時、支払い証明がサーバー宣言の要件（scheme・network・資産・payTo・金額）と一致しなければ invalid を返す</td><td class="num">—</td></tr>
<tr><td><b>SR2</b></td><td>検証時、支払者の認可が想定する署名モデルの下で真正でなければ invalid を返す</td><td class="num">—</td></tr>
<tr><td><b>SR3</b></td><td>検証時、支払者の認可が期限切れであれば invalid を返す</td><td class="num">—</td></tr>
<tr><td><b>SR4</b></td><td>決済時、チェーン上で実際に決済が成立した場合にのみ valid を返す</td><td class="num">—</td></tr>
<tr><td><b>SR5</b></td><td>検証時、決済不能または経済的に無意味な支払いを早期に拒否する</td><td class="num">14社</td></tr>
<tr><td><b>SR6</b></td><td>スポンサー実行は、手数料・ガス・compute unit の上限で制約する</td><td class="num">—</td></tr>
<tr><td><b>SR7</b></td><td>決済送信の直前に、時刻・状態に依存する条件を再検証する</td><td class="num">14社</td></tr>
<tr><td><b>SR8</b></td><td>オンチェーン実行が支払いセマンティクスに収まる証明のみを決済する</td><td class="num">9社</td></tr>
</tbody>
</table>
</div>
<p>最も頻出したのはSR5・SR7・SR8です。加えて、少なくとも1つの実装はSR1〜SR4という基礎的な要件を満たしていませんでした。SR1〜SR4、SR6の個別の違反社数は論文に明記されていないため、上表では「—」としています。</p>
<div class="kicker">調査範囲と限界</div>
<h2 class="rh">論文自身が明示する制約</h2>
<div class="caveats">
<p style="margin:0 0 .5rem;color:#e5e7eb"><b>「どの社が何に違反したか」は公開されていません。</b></p>
<p style="margin:0 0 .8rem">論文は開示上の配慮から、違反の内訳表で各ファシリテーターを数字のIDに匿名化しています。調査対象社の一覧（Coinbaseなど）は公開されていますが、対象リストに載っていることと、特定の違反が確認されたことは別です。報道等で社名と違反内容が結び付けられている場合は、出典を確認してください。</p>
<p style="margin:0 0 .8rem"><b>規則の「合格」は安全性の証明ではありません。</b>論文の著者ら自身が、ブラックボックス検査であること、破壊的テストを避けたこと、正解データセットが存在しないことから「合格とは実装した検査を通過したという意味であり、一般に安全であることを示さない」と明記しています。攻撃の一部は倫理的制約により完全実証を避け、高リスク証拠として保守的に分類されています。</p>
<p style="margin:0">また、悪意あるファシリテーターや共謀、ウォレット侵害、決済境界を越えたマーチャントの業務ロジック、信用・担保ベースの決済方式は調査範囲外です。オンチェーン実測はアドレス単位の推定であり、未登録のファシリテーター、プロキシコントラクト、アドレスのローテーションは捕捉できていません。</p>
</div>
<p style="margin-top:1.8rem;font-size:1.02rem;color:#e5e7eb">論文の著者らは影響を受ける各社へ責任ある開示を行い、Coinbaseを含む複数社が問題を認め、緩和策を導入したと報告しています。個別の修正が進んでいること自体は前向きな材料です。一方で、外部の相手が規則を守っているかを継続的に確認する仕組みは、まだ存在しません。</p>
<p style="font-size:1.02rem;color:#e5e7eb">最後に一つ。<b>いま自社が外部サービスやAIエージェントに任せている仕事を1つ挙げて、「完了を何で確認しているか」と「失敗したとき何を戻せるか」に答えられるか、確かめてみてください。</b> 答えられない仕事が1つでもあれば、それは今回の論文が示したのと同じ「返事」と「実際の成立」のズレを抱えている可能性があります。決済を使っているかどうかは関係ありません。</p>
<div class="note"><b>開示：</b>Another Star合同会社は、エージェント間の信頼情報を扱うエージェントストアと仲介エージェントを開発しており、x402を含む決済連携は現在検討・検証中の事項です。当社は決済機能を提供していません。本記事は論文の内容を要約・整理したものであり、特定のファシリテーターやサービスの利用可否を判断するものではありません。</div>
<p class="src">一次資料：Qinying Wang, Yong Yang, Yuan Chen, Shouling Ji, Mathias Payer, "When HTTP 402 Meets the Blockchain: Risks on Emerging x402 Payments," <a href="https://www.usenix.org/conference/usenixsecurity26/technical-sessions">USENIX Security 2026</a>（arXiv: <a href="https://arxiv.org/abs/2607.19545">2607.19545</a>, v1: 2026-07-21）。本文中の数値は、断りのない限りすべて同論文の記載によります。オンチェーン実測期間は2025-10-01〜2025-12-26。売り手側の数値は当社の<a href="/blog/2026-08-09-a2a-agents-liveness-x402/">2026-08-09実測記事</a>によります（同記事の見出しにある「31件」はx402に言及するエージェントの数で、本記事の「31件」＝脆弱性とは無関係です）。仕様参照：<a href="https://docs.x402.org/core-concepts/client-server">x402 Client / Server</a>、<a href="https://a2a-protocol.org/latest/specification/">A2A Protocol Specification</a>。</p>
</div>

*A2A Insights は、A2Aプロトコルの動向と実測データを日本語で定点観測しています。更新は[RSS](/blog/rss.xml)でフォローできます。*
