---
title: "公開A2Aエージェント194件を調査：実応答67件、そのうち31件がx402に言及"
description: "a2aregistryの公開APIで確認できる登録エージェントは194件です。AgentCardの疎通、ヘルスチェック、A2A message/sendの実動作を分けて見ると、WORKINGは67件、x402への言及がありWORKINGのものは31件でした。"
pubDate: 2026-08-09
tags: ["実測レポート", "A2A", "x402"]
category: "定点観測"
readingTime: "8分"
heroImage: "/blog/a2a-liveness-x402-eyecatch.webp"
heroAlt: "暗い背景に白い大きな文字でx402と描かれたビジュアル"
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
@media(max-width:480px){.report .hb{grid-template-columns:8em 1fr 4.1em;font-size:.8rem}.report table{font-size:.8rem}}
</style>

<p class="lead">公開レジストリ <a href="https://a2aregistry.org">a2aregistry</a> の公開APIで確認できる登録エージェントは <b>194件</b>です。この数字を、AgentCardの疎通、レジストリのヘルスチェック、A2A <code>message/send</code> の実動作という<b>3つの層</b>に分けて確認しました。</p>

<div class="conclusion">
<p class="label">今回の要点</p>
<p><b>登録194件のうち、直近のヘルスチェックで正常と判定されたものは186件（95.9%）でした。一方、A2Aの<code>message/send</code>で実応答を返す<code>WORKING</code>は67件（34.5%）です。x402・機械間決済への言及は77件（39.7%）にありますが、<code>WORKING</code>と重なるのは31件（16.0%）でした。</b></p>
</div>

<p>結論として、公開A2Aエコシステムの規模はまだ小さく、「稼働」をどの層で見るかによって見える数字が大きく異なります。エージェントカードが取得できることと、A2Aのメッセージ交換が実際に機能することは別の指標です。</p>

<div class="kicker">01 — 調査対象と方法</div>
<h2 class="rh">a2aregistry公開APIの194件を対象に確認</h2>

<p>対象は、a2aregistryの <code>/api/stats</code> と <code>/api/agents?limit=100&amp;offset={0,100}</code> から取得した公開データです。各エージェントの <code>is_healthy</code>、<code>task_conformance.category</code>、<code>uptime_percentage</code> を用いて、登録状況と実動作を分けて確認しました。</p>

<p>あわせて、登録されている <code>.well-known/agent-card.json</code> または旧形式の <code>.well-known/agent.json</code> にHTTP <code>GET</code> を送り、AgentCardの公開エンドポイントに到達できるかを確認しました。A2Aの仕様とAgentCardの位置付けは、<a href="https://a2a-protocol.org/latest/specification/">A2A Protocol Specification</a>を参照しています。</p>

<div class="kicker">02 — 稼働性を3層で見る</div>
<h2 class="rh">カードの疎通とA2Aの実動作には差がある</h2>

<div class="tiles">
<div class="tile"><div class="num">194<small> 件</small></div><div class="lbl">公開APIで確認できた登録エージェント</div></div>
<div class="tile"><div class="num">188<small> 件</small></div><div class="lbl">AgentCardのHTTP取得が成功</div></div>
<div class="tile"><div class="num">186<small> 件</small></div><div class="lbl"><code>is_healthy=true</code></div></div>
<div class="tile"><div class="num">67<small> 件</small></div><div class="lbl"><code>message/send</code> が実応答</div></div>
</div>

<figure>
<div class="hb primary"><span class="l">登録エージェント</span><span class="t"><span class="f" style="width:100%"></span></span><span class="v">194件</span></div>
<div class="hb"><span class="l">AgentCard取得成功</span><span class="t"><span class="f" style="width:96.9%"></span></span><span class="v">96.9% · 188件</span></div>
<div class="hb"><span class="l">healthy</span><span class="t"><span class="f" style="width:95.9%"></span></span><span class="v">95.9% · 186件</span></div>
<div class="hb primary"><span class="l">WORKING</span><span class="t"><span class="f" style="width:34.5%"></span></span><span class="v">34.5% · 67件</span></div>
<figcaption>「AgentCardを取得できる」「ヘルスチェックで正常」「A2Aのメッセージ送信が実応答を返す」は異なる層の指標です。</figcaption>
</figure>

<p><code>is_healthy=true</code> でありながら <code>WORKING</code> ではないエージェントは119件でした。これらはAgentCardのエンドポイントには到達できるものの、<code>message/send</code> では404、401、405、トランスポート定義不足などにより実応答を返せていません。公開エージェントの「生存」を単一の数字で表すことには限界があります。</p>

<div class="table-wrap">
<table>
<thead><tr><th>稼働性の区分</th><th class="num">件数</th><th class="num">割合</th><th class="num">x402言及あり</th></tr></thead>
<tbody>
<tr><td><code>WORKING</code> かつ <code>healthy</code></td><td class="num">67</td><td class="num">34.5%</td><td class="num">31</td></tr>
<tr><td><code>healthy</code> だが <code>WORKING</code> 以外</td><td class="num">119</td><td class="num">61.3%</td><td class="num">42</td></tr>
<tr><td><code>WORKING</code> 以外かつ <code>unhealthy</code></td><td class="num">8</td><td class="num">4.1%</td><td class="num">4</td></tr>
<tr><td><b>合計</b></td><td class="num"><b>194</b></td><td class="num"><b>100%</b></td><td class="num"><b>77</b></td></tr>
</tbody>
</table>
</div>

<div class="kicker">03 — 機械間決済・x402</div>
<h2 class="rh">x402への言及は77件、実動作との交差は31件</h2>

<p><code>name</code>、<code>description</code>、<code>provider</code>、<code>skills</code>、<code>tags</code> に含まれる <code>x402</code>、<code>HTTP 402</code>、<code>machine-to-machine</code>、<code>M2M payment</code>、<code>stablecoin</code> などの語句を集計しました。該当は <b>77件（39.7%）</b>です。</p>

<figure>
<div class="hb primary"><span class="l">x402・決済への言及</span><span class="t"><span class="f" style="width:100%"></span></span><span class="v">39.7% · 77件</span></div>
<div class="hb"><span class="l">healthy</span><span class="t"><span class="f" style="width:94.8%"></span></span><span class="v">73件</span></div>
<div class="hb primary"><span class="l">WORKING</span><span class="t"><span class="f" style="width:40.3%"></span></span><span class="v">16.0% · 31件</span></div>
<div class="hb"><span class="l">WORKING以外</span><span class="t"><span class="f" style="width:59.7%"></span></span><span class="v">46件</span></div>
<figcaption>x402・機械間決済に言及する77件の内訳。<code>WORKING</code>は、全194件に対して16.0%、x402言及エージェント77件に対して40.3%です。</figcaption>
</figure>

<p>x402は、HTTPの <code>402 Payment Required</code> を使い、支払条件の提示、署名済み支払データを添えたリクエストの再送、検証・決済を行うためのオープン標準です。A2Aがエージェントの発見・タスク管理・メッセージ交換を担うのに対し、x402は保護されたAPIやリソースへのプログラム可能な支払いを担います。基本フローは、<a href="https://docs.x402.org/core-concepts/client-server">x402公式ドキュメント</a>を参照してください。</p>

<p>重要なのは、77件という数字はあくまでカード上の言及であることです。<code>WORKING</code>との交差は、A2Aの <code>message/send</code> が応答するかを見る指標であり、x402決済ハンドラの実装やオンチェーン決済の成立を直接検証したものではありません。ここから断言できるのは、機械間決済を掲げる公開エージェントが一定数存在し、その中でA2Aメッセージ交換まで確認できるものは31件だった、という点です。</p>

<div class="kicker">04 — 信頼情報の空白</div>
<h2 class="rh">認証・ライセンス・料金の記述はほぼない</h2>

<p>機械間決済への言及がある一方で、取引相手を判断するためのメタデータはほとんど記載されていませんでした。</p>

<figure>
<div class="hb void"><span class="l">認証要件（security）</span><span class="t"><span class="f" style="width:1%"></span></span><span class="v">0.5% · 1件</span></div>
<div class="hb void"><span class="l">認証方式（securitySchemes）</span><span class="t"><span class="f" style="width:1%"></span></span><span class="v">0.5% · 1件</span></div>
<div class="hb void"><span class="l">ライセンス（license）</span><span class="t"><span class="f" style="width:.2%"></span></span><span class="v">0.0% · 0件</span></div>
<div class="hb void"><span class="l">料金情報（pricing）</span><span class="t"><span class="f" style="width:.2%"></span></span><span class="v">0.0% · 0件</span></div>
<figcaption>194件のAgentCardにおけるフィールド記載率です。A2Aのバージョンやカード構造の違いをまたいで集計しています。</figcaption>
</figure>

<p>企業間でエージェントを利用するには、認証方式、要求権限、料金、ライセンス、提供者、実行履歴を確認できることが重要です。公開AgentCardは発見と機能説明には使えますが、現状では取引条件や信頼性を判断する情報として十分ではありません。</p>

<div class="kicker">05 — Another Starの取り組み</div>
<h2 class="rh">エージェントストアと仲介エージェントで、信頼できる接続を支える</h2>

<p>Another Starでは、AgentCardへの到達、A2Aメッセージ交換の実動作、認証・利用条件といった情報を分けて確認できる<b>エージェントストア</b>を実装・提供しています。今回の調査で見えたのは、AgentCardが取得できること、A2Aのメッセージ交換が機能すること、取引条件を確認できることは、それぞれ別の確認事項だという点です。</p>

<div class="tiles">
<div class="tile"><div class="num">01</div><div class="lbl"><b>エージェントストア</b><br>提供者、AgentCardの構造、対応プロトコル、稼働性、認証・利用条件、審査結果を確認できるカタログ</div></div>
<div class="tile"><div class="num">02</div><div class="lbl"><b>仲介エージェント</b><br>ストアの情報を基に接続先を選び、依頼・実行結果・証跡を一つの経路で扱うための仲介層</div></div>
</div>

<p>仲介エージェントは、こうした確認情報を利用側の接続判断や実行結果の記録に結び付け、エージェント間のやり取りを一つの経路で扱う役割を担います。</p>

<p>仲介エージェントにおける決済関連の機能は、今後の検討事項です。決済を伴う場合に、利用側・仲介・提供側の間で選定、支払条件、実行結果、証跡を関連付ける構成を検討しています。x402や決済サービスとの連携、ウォレットと予算の管理、返金・補償、法務・金融規制への対応は、現在検討・検証を進めている事項です。</p>

<div class="note"><b>仲介エージェントにおける決済関連機能は検討中です。</b>Another Starは現在、決済機能を提供していません。実際の提供範囲や実装方式は、技術・法務・運用面の検証を踏まえて決定します。</div>

<div class="kicker">調査範囲と限界</div>
<h2 class="rh">公開情報に基づくスナップショット</h2>

<div class="caveats">
<p style="margin:0 0 .5rem;color:#e5e7eb"><b>194件は、世界中のA2Aエージェントの総数ではありません。</b></p>
<p style="margin:0">対象はa2aregistryの公開APIで取得できたAgentCardです。企業内・非公開のエージェントは含まれません。<code>WORKING</code>はa2aregistry側の <code>task_conformance.category</code> に依拠しており、Another Starがすべてのエージェントに対して機能・セキュリティ・決済を網羅的に動作検証したものではありません。x402・機械間決済の集計はキーワードベースであり、決済件数や取引額、決済ハンドラの動作を示すものではありません。</p>
</div>

<p style="margin-top:1.8rem;font-size:1.02rem;color:#e5e7eb">公開A2Aエコシステムはまだ小規模です。登録、AgentCardの疎通、A2Aのメッセージ交換という異なる層を分けて観測することで、実態に近い判断が可能になります。今後も、取引・決済・信頼に関する設計が実装と相互運用へどこまで進むかを継続して観測します。</p>

<p class="src">調査対象：<a href="https://a2aregistry.org">a2aregistry</a>の公開API <code>/api/stats</code> および <code>/api/agents?limit=100&amp;offset={0,100}</code>。取得日：2026-08-09。AgentCardの疎通確認は、登録された <code>.well-known</code> のURLに対するHTTP GETによるものです。仕様参照：<a href="https://a2a-protocol.org/latest/specification/">A2A Protocol Specification</a>、<a href="https://docs.x402.org/core-concepts/client-server">x402 Client / Server</a>。</p>

</div>

*A2A Insights は、A2Aプロトコルの動向と実測データを日本語で定点観測しています。更新は[RSS](/blog/rss.xml)でフォローできます。*
