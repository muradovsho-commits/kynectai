export const RX_INTERVIEW_SECTIONS = [
  {
    title: 'How to Approach the Interview',
    content: `<p>Restructuring interviews test three things: whether you genuinely understand the work (the contextual fluency this guide is built to give you), whether you can handle the technicals, and whether you are someone the team wants to sit next to for very long hours. Treat all three as equally disqualifying if you fail them.</p>

<h4>Why Restructuring</h4>
<p>A weak answer here quietly sinks otherwise strong candidates. Avoid leading with exits or with it is the most prestigious group. Lead with the work itself: RX is intellectually unique because every situation is different and document-driven, so the work never becomes rote; it sits at the intersection of finance, law, and negotiation; it forces you to think like an investor (where does value break, what is the fulcrum) rather than just an advisor; and it is countercyclical and analytically deep in a way that builds durable skills. Make it specific and make it yours.</p>

<h4>Technicals</h4>
<p>Set up the structure out loud before computing. For a waterfall, state the steps (EV to distributable value, then distribute down the stack, building each claim with pre- and post-petition interest) before plugging numbers. For bond math, state the price-yield relationship before estimating. Reason directionally and approximate cleanly. If you do not know something, reason from first principles rather than guessing a term, because RX interviewers respect a candidate who thinks correctly through an unfamiliar situation far more than one who name-drops a concept they cannot apply.</p>

<h4>Behavioral and Fit</h4>
<p>RX groups are small and intense, with long hours and high-stakes, often adversarial work. Be personable, genuinely interested, and deferential without being a pushover. Show you can be in the room for sixteen hours and remain pleasant and sharp. Have thoughtful questions ready that show you understand the work.</p>`,
  },
  {
    title: 'Running a Case Study',
    content: `<p>Case studies are common at the more rigorous groups, especially creditor-side ones. You are given a situation (a capital structure, some trading prices, a rough outlook) and asked something like which part of the capital structure would you invest in or walk me through how you would restructure this company.</p>

<div class="key-concept">Treat the case as a two-way conversation, not a monologue. The interviewer expects you to ask clarifying questions and flag assumptions as you go. Ask for the pieces you need: the enterprise value or how to derive it, the trading prices of each tranche, the relevant dates (last coupon paid, expected filing, expected exit) if returns are involved, and whether to incorporate cash adjustments. Asking the right questions at the right moments is itself part of what is being assessed.</div>

<p>A clean structure for a typical which-tranche-to-buy case:</p>
<ul>
<li><strong>Establish the capital structure</strong> (build the cap table from what you are given).</li>
<li><strong>Get or estimate the enterprise value</strong>, and form a view on when the company is likely to file using the liquidity picture.</li>
<li><strong>Run the waterfall</strong> to determine each tranche's recovery, identifying where value breaks and which tranche is the fulcrum.</li>
<li><strong>Layer in trading prices and the timeline</strong> to compute MOIC and a rough annualized return for each candidate tranche.</li>
<li><strong>Recommend, with reasoning:</strong> the best investment is usually the tranche with the widest spread between proceeds and entry price, which is frequently not the safest tranche but a cheaper, higher-coupon one, or the fulcrum if you believe in the equity upside.</li>
</ul>

<p>Throughout, narrate your reasoning and your assumptions. The interviewer cares more about how you think than whether your arithmetic is perfect.</p>`,
  },
  {
    title: 'Contextual Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">What is restructuring, in one sentence?</div>
<div class="answer">Advisory work for companies that can no longer support their capital structure, focused on renegotiating claims so the business can either keep operating with a sustainable balance sheet or be wound down in the most value-maximizing way.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">How is restructuring different from M&amp;A?</div>
<div class="answer">M&A is about what a company is worth and what a buyer will pay; it grows or transfers value. Restructuring is about who gets a fixed, usually shrinking, pool of value, and in what order. The analysis is built on claims, priority, and recovery rather than synergies and accretion, and the legal documents and the bankruptcy process create leverage points that sophisticated parties fight over.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">Why is RX concentrated at independent advisory firms?</div>
<div class="answer">Conflicts of interest. A bank that arranged or underwrote a company's debt through its leveraged finance or DCM groups faces an obvious conflict advising on restructuring that same debt, and may be conflicted out of advising creditors against a company it lends to. RX advisory therefore concentrates at independents whose restructuring practices are core to their identity and who lack the lending conflicts.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">Debtor-side versus creditor-side, and which would you prefer?</div>
<div class="answer">Debtor work means advising the company to right-size its structure; it is broader and more prestigious because you quarterback the situation. Creditor work means advising a group of lenders or bondholders to maximize recovery; it is faster, more numerous, and gives a sharper view of how investors think about claims. There is no single right preference, but you should be able to articulate that tradeoff cleanly.</div>
</div>`,
  },
  {
    title: 'Distress and Capital Structure Questions',
    content: `<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">Why does a company end up needing to restructure?</div>
<div class="answer">Its capital structure outgrew the cash the business generates, through some combination of over-leverage, a maturity wall it cannot refinance, a liquidity shortfall, a covenant breach, secular decline, or a one-time shock or liability. Distress is fundamentally a mismatch between obligations and the cash or value available to meet them.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">What is the difference between insolvency and illiquidity?</div>
<div class="answer">Insolvency is a balance-sheet condition: liabilities exceed the value of assets, a valuation problem. Illiquidity is a timing condition: the company cannot meet obligations as they come due even if it is solvent long term. A liquidity problem at a healthy company can be bridged with financing or a maturity extension; genuine over-leverage requires actually cutting the debt, which means someone takes a loss.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">In a distressed situation, which financial statement matters most?</div>
<div class="answer">The cash flow statement. Distress is about liquidity, whether the company has enough cash to meet its obligations. A company can be accounting-profitable and still run out of cash if receivables balloon, capital expenditure consumes cash flow, or working capital deteriorates. Cash is what determines survival.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">Walk me up a typical capital structure from top to bottom.</div>
<div class="answer">Revolver (most senior, secured, usually banks), first-lien term loan, second-lien term loan, secured notes by lien priority, senior unsecured notes, subordinated notes, mezzanine, preferred equity, common equity. Value flows down this stack in priority order on a restructuring or liquidation.</div>
</div>

<div class="interview-q">
<div class="q-label">Q9</div>
<div class="question">What is the difference between a maintenance and an incurrence covenant?</div>
<div class="answer">A maintenance covenant is tested every period regardless of company action, like a maximum leverage ratio, so it trips automatically if performance deteriorates and gives lenders early warning. An incurrence covenant is tested only when the company takes a specific action like incurring debt, so a company can decline badly without ever breaching. Covenant-lite loans strip the maintenance covenants, which lets borrowers run closer to the edge for longer.</div>
</div>`,
  },
  {
    title: 'Solutions and Process Questions',
    content: `<div class="interview-q">
<div class="q-label">Q10</div>
<div class="question">Out-of-court versus in-court, why choose one over the other?</div>
<div class="answer">Out-of-court is cheaper, faster, quieter, and less damaging, but it cannot bind holdouts, so it needs near-unanimous consent. In-court is expensive, slow, and public, but the court can cram a plan down on dissenters and provides tools that do not exist out of court (the automatic stay, debtor financing, contract rejection). Stay out if you can get consent; go in if you need to bind holdouts or use the in-court toolkit.</div>
</div>

<div class="interview-q">
<div class="q-label">Q11</div>
<div class="question">What is the difference between a pre-pack, a pre-arranged, and a freefall bankruptcy?</div>
<div class="answer">A pre-pack has the plan negotiated and the votes solicited and obtained before filing, so it emerges in weeks. A pre-arranged case files with agreement in principle on the key terms (often an RSA) but completes solicitation in court, taking longer but staying orderly. A freefall files with no deal in place, usually out of time or liquidity, and negotiates everything in court; it is the longest, most expensive, and most work-intensive.</div>
</div>

<div class="interview-q">
<div class="q-label">Q12</div>
<div class="question">What is the absolute priority rule?</div>
<div class="answer">Senior claims must be paid in full before junior claims or equity receive anything; value flows strictly down the priority stack. It is why equity is usually wiped out, and it is the default the court enforces, though parties routinely negotiate around it with settlements and gifts to buy speed and avoid litigation.</div>
</div>

<div class="interview-q">
<div class="q-label">Q13</div>
<div class="question">How do you decide between reorganizing and liquidating?</div>
<div class="answer">Compare going-concern value (the business as a continuing operation, from comps and a DCF) against liquidation value (selling the assets piecemeal). If going-concern exceeds liquidation, reorganize; if liquidation exceeds going-concern, the business is worth more dead than alive. Liquidation value also sets the legal floor: no creditor can be forced to accept less than they would get in a hypothetical liquidation.</div>
</div>

<div class="interview-q">
<div class="q-label">Q14</div>
<div class="question">Why would a creditor ever agree to a haircut out of court?</div>
<div class="answer">Because the alternative may be worse: a freefall bankruptcy destroys value and racks up fees, so a negotiated haircut can beat the in-court outcome. They may be paid a sweetener (higher rate, better priority, fees). They may fear being the holdout stranded in a coercive exchange. And in a liability management deal, the participating majority is not taking a haircut at all, it is improving its own position at the minority's expense, so it is happy to agree.</div>
</div>`,
  },
  {
    title: 'Liability Management and Structural Questions',
    content: `<div class="interview-q">
<div class="q-label">Q15</div>
<div class="question">What is an uptier transaction?</div>
<div class="answer">A majority of existing lenders agrees with the company to create new super-priority debt that ranks ahead of the existing debt and rolls their own holdings up into it, using their majority vote to subordinate the non-participating minority. The minority, who were first in line, end up behind a new senior tranche, without consenting, because the loose documents let a majority change the priority terms.</div>
</div>

<div class="interview-q">
<div class="q-label">Q16</div>
<div class="question">What is a drop-down transaction?</div>
<div class="answer">The company moves valuable assets out of the restricted group into an unrestricted subsidiary outside the existing lenders' collateral, then raises new debt at that subsidiary secured by those assets. The new lenders get first claim on the moved assets, and the original lenders are effectively subordinated with respect to the company's most valuable property, again without consent, because the baskets permitted the transfer.</div>
</div>

<div class="interview-q">
<div class="q-label">Q17</div>
<div class="question">Explain a double-dip.</div>
<div class="answer">A creditor structures its claim so it has two independent claims against the same valuable entity: a direct claim through a guarantee, and an indirect claim through an intercompany loan made by the issuing subsidiary that gets pledged back to the creditor. On a filing it presents two claims for the same money, roughly doubling its recovery against a constrained value pool relative to equally ranked creditors, capped at being paid in full. Walk through a ParentCo and FinanceCo example to show it.</div>
</div>

<div class="interview-q">
<div class="q-label">Q18</div>
<div class="question">What is the difference between contractual and structural subordination?</div>
<div class="answer">Contractual subordination is an agreement to rank behind another creditor of the same entity. Structural subordination arises from where debt sits in the corporate tree: a holdco creditor is structurally junior to the operating subsidiary's creditors, because the subsidiary's own creditors get paid from its assets first and only residual equity value flows up to the holdco. A guarantee from the operating subsidiary cures structural subordination by giving the holdco creditor a direct claim against the assets.</div>
</div>`,
  },
  {
    title: 'Technical and Math Questions',
    content: `<div class="interview-q">
<div class="q-label">Q19</div>
<div class="question">Walk me through a recovery waterfall.</div>
<div class="answer">Start with enterprise value, adjust for cash to get distributable value, then distribute down the stack in priority order. For each tranche build the total claim: face plus accrued pre-petition interest (last coupon to filing), plus post-petition interest only for over-collateralized secured claims (filing to exit). Each tranche recovers the lesser of its claim or remaining value. Under-collateralized secured claims get no post-petition interest and the shortfall becomes a general unsecured deficiency claim. The tranche where value runs out is the fulcrum.</div>
</div>

<div class="interview-q">
<div class="q-label">Q20</div>
<div class="question">What is the fulcrum security and why does it matter?</div>
<div class="answer">The fulcrum is the tranche where enterprise value runs out, the one only partially covered. Everything above recovers in full and behaves like fixed income; everything below is wiped out; the fulcrum typically converts into the new equity of the reorganized company. It matters because it is where ownership and the upside sit, and because a small change in enterprise value can move the fulcrum, transferring the company from one creditor group to another, which is why valuation is the central battleground.</div>
</div>

<div class="interview-q">
<div class="q-label">Q21</div>
<div class="question">A bond has an 8% coupon, trades at 80, and matures in 5 years. Roughly what is its yield?</div>
<div class="answer">Annual coupon is 8. Gain to par is 20 over 5 years, or 4 per year. Annual dollar return is about 12. Average of price and par is 90. So approximate yield is 12 over 90, about 13%. It is above the coupon because you collect the coupon on full face while paying only 80 and also capture the 20-point pull to par.</div>
</div>

<div class="interview-q">
<div class="q-label">Q22</div>
<div class="question">Why does a below-par bond rise toward par over time if its yield stays constant?</div>
<div class="answer">Part of the bond's total return is the gain from converging to par at maturity. As maturity approaches, less of that gain remains to earn, so to keep delivering the same yield the price must climb toward par. A discount bond accretes to par; a premium bond amortizes down to par.</div>
</div>

<div class="interview-q">
<div class="q-label">Q23</div>
<div class="question">What does it mean for a secured creditor to be over- or under-collateralized, and why does it matter?</div>
<div class="answer">Over-collateralized means the collateral is worth more than the claim, so the creditor is entitled to post-petition interest. Under-collateralized means the collateral is worth less than the claim, so the creditor gets no post-petition interest and the uncovered portion becomes a general unsecured deficiency claim that recovers alongside the other unsecured creditors. You have to test this before running a waterfall.</div>
</div>

<div class="interview-q">
<div class="q-label">Q24</div>
<div class="question">Which piece of the capital structure would you buy in a distressed situation?</div>
<div class="answer">Run the waterfall to get recoveries, then compare returns rather than recoveries. Lay out each candidate tranche's cash in (price times face) and cash out (recovery plus accrued interest), compute MOIC, and approximate the annualized return. The best investment is usually the widest spread between proceeds and entry price, which is often not the safest tranche but a cheaper, higher-coupon one, or the fulcrum if you believe the reorganized equity will outperform the plan valuation.</div>
</div>

<div class="interview-q">
<div class="q-label">Q25</div>
<div class="question">What does a summer analyst actually do in restructuring?</div>
<div class="answer">Build and maintain screens of distressed companies, write company profiles, build liquidity roll-forwards to project when a company runs out of cash, lay out capital structures and run recovery waterfalls, and build pieces of pitch decks including pro forma capital structures. None of it requires being an expert; it requires accuracy and understanding what each output is meant to show.</div>
</div>`,
  },
  {
    title: 'Glossary',
    content: `<p><strong>Absolute priority rule (APR):</strong> Senior claims paid in full before junior claims or equity receive anything.</p>
<p><strong>Amend-and-extend (A&amp;E):</strong> Amending a credit agreement to push out maturities and reset covenants, usually for a higher rate or fees. Buys time, does not cut debt.</p>
<p><strong>Automatic stay:</strong> The halt on all collection, litigation, and foreclosure the moment a company files.</p>
<p><strong>Basket:</strong> Permitted capacity in a credit agreement to do an otherwise-restricted action up to a limit.</p>
<p><strong>Coercive exchange:</strong> A debt exchange designed to pressure creditors into participating, typically by stripping protections from the old debt so holdouts are left worse off.</p>
<p><strong>Covenant-lite:</strong> A loan with incurrence covenants only, no maintenance covenants.</p>
<p><strong>Cramdown:</strong> Court confirmation of a plan over the objection of a dissenting class, permitted if statutory fairness tests are met.</p>
<p><strong>Deficiency claim:</strong> The unsecured shortfall when a secured claim exceeds its collateral value; treated as a general unsecured claim.</p>
<p><strong>DIP financing:</strong> New financing raised during bankruptcy, often with court-granted priority over existing creditors.</p>
<p><strong>Distributable value:</strong> Enterprise value adjusted for cash items, the value actually available to distribute.</p>
<p><strong>Double-dip:</strong> A structure giving a creditor two independent claims against the same value (a direct guarantee claim and an indirect intercompany claim), roughly doubling recovery up to payment in full.</p>
<p><strong>Drop-down:</strong> Moving assets to an unrestricted subsidiary outside existing lenders' collateral, then raising new debt against them, subordinating the original lenders structurally.</p>
<p><strong>Freefall:</strong> A bankruptcy filed with no deal in place.</p>
<p><strong>Fulcrum security:</strong> The tranche where enterprise value runs out; partially recovers and typically converts to the new equity of the reorganized company.</p>
<p><strong>Going-concern value:</strong> The value of the business as a continuing operation.</p>
<p><strong>Incurrence covenant:</strong> Tested only when the company takes a specific action.</p>
<p><strong>Liability management transaction (LME):</strong> An aggressive out-of-court maneuver exploiting loose documents to reorder priority, raise senior money, or move assets, usually advantaging one creditor group at another's expense.</p>
<p><strong>Liquidation value:</strong> The value of selling assets piecemeal; sets the legal floor for recoveries.</p>
<p><strong>Maintenance covenant:</strong> Tested every period regardless of company action; trips automatically on deterioration.</p>
<p><strong>MOIC:</strong> Multiple of invested capital, total proceeds divided by amount invested.</p>
<p><strong>Post-petition interest:</strong> Interest accruing during bankruptcy, payable only to over-collateralized secured creditors.</p>
<p><strong>Pre-petition interest:</strong> Accrued, unpaid interest from the last coupon date to the filing date.</p>
<p><strong>Pre-pack:</strong> A bankruptcy with the plan negotiated and votes obtained before filing.</p>
<p><strong>Pre-arranged:</strong> A bankruptcy filed with agreement in principle on terms but votes solicited in court.</p>
<p><strong>Restricted vs unrestricted subsidiary:</strong> Whether a subsidiary is inside (restricted) or outside (unrestricted) the covenant perimeter and collateral package.</p>
<p><strong>RSA:</strong> Restructuring support agreement, committing the company and consenting creditors to support a particular restructuring.</p>
<p><strong>Structural subordination:</strong> Junior position arising from where debt sits in the corporate tree, independent of any contractual ranking.</p>
<p><strong>363 sale:</strong> A court-approved sale of assets during bankruptcy, free and clear of liens, which attach to the proceeds.</p>
<p><strong>Uptier:</strong> A majority of lenders creating new super-priority debt and rolling into it, subordinating the non-participating minority.</p>
<p><strong>Waterfall:</strong> The distribution of value down the capital structure in priority order to determine recoveries.</p>
<p><strong>YTM:</strong> Yield to maturity, the single discount rate setting the present value of a bond's cash flows equal to its price.</p>`,
  },
];
