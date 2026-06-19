export const RX_LME_SECTIONS = [
  {
    title: 'What LMEs Are',
    content: `<p>Over the last several years, the most consequential development in restructuring has been the rise of aggressive liability management exercises, sometimes called creditor-on-creditor violence. These are out-of-court maneuvers that exploit loose credit documents to reorder priority, raise new senior money, or move assets, usually advantaging one creditor group at the direct expense of another.</p>

<div class="key-concept">They have become so central that an interviewer at a top group will absolutely expect you to understand the major archetypes. Three matter most: <strong>uptiers</strong> (priming), <strong>drop-downs</strong> (asset transfers), and <strong>double-dips</strong>. All exploit the same underlying reality: documents drafted in better times left gaps (loose lien provisions, generous baskets, unrestricted-subsidiary capacity, low consent thresholds for non-money terms), and a majority creditor group working with the company can use those gaps to climb over the minority.</div>

<div class="framework-box"><div class="fw-label">THE COMMON PATTERN</div>A company is distressed and needs money or runway. A subset of creditors holds enough of a tranche to control amendments. The company and that subset cut a private deal: the subset provides new money or agrees to a transaction, and in exchange gets a better position, usually at the expense of the creditors who were not in the room. The losers are the unorganized minority who did not see it coming or could not block it.</div>

<p>The strategic lesson, and a common interview point: in a world of loose docs, the creditors who read the agreements fastest and organize into a cooperative group first tend to win. The ones who stay passive get primed.</p>`,
  },
  {
    title: 'Uptier Transactions (Priming)',
    content: `<p>In an uptier, a majority group of existing lenders agrees with the company to issue new super-priority debt that ranks ahead of the existing debt, and to exchange their own existing holdings up into that new senior tranche. Because amending the priority and lien provisions typically requires only a majority vote, the majority lenders can use their votes to subordinate the non-participating minority, who are left holding debt that has been primed (pushed down in priority) without their consent.</p>

<div class="example-box">
<div class="example-label">Mechanics</div>
<p>A company has a 1,000 first-lien term loan held by many lenders. A group holding 55% of it agrees with the company to create a new super-priority facility that ranks ahead of the existing loan. The participating 55% rolls their old loans into the new senior tranche (often at a premium or with new-money priority), and uses its majority vote to amend the credit agreement to permit the priming. The 45% who were not invited keep their old loans, which now sit behind the new super-priority debt. They went from first in line to third in line, purely because the majority had the votes.</p>
</div>

<div class="warning-box">This archetype became infamous through a series of heavily litigated cases involving a mattress maker and others around 2020, where excluded minority lenders sued, arguing the credit agreement never permitted what the majority did. Courts have split on whether specific implementations were allowed, which is exactly why the precise drafting (open-market purchase provisions, pro-rata sharing language, the definition of permitted debt) matters so much. The lesson for an interview: an uptier's legality turns on the specific words in the agreement, not on a general principle.</div>`,
  },
  {
    title: 'Drop-Down Transactions (Asset Transfers)',
    content: `<p>A drop-down exploits the restricted-versus-unrestricted subsidiary distinction. The company transfers valuable assets, often the crown jewels like key brands or intellectual property, out of the restricted group and into an unrestricted subsidiary that sits outside the existing lenders' collateral perimeter. The unrestricted subsidiary then raises new debt secured by those assets.</p>

<div class="example-box">
<div class="example-label">The structural insight</div>
<p>The company did not change anyone's priority by a vote. It moved the assets to a place the existing lenders' liens do not reach (using investment and asset-transfer baskets), then borrowed against them fresh. The new lenders have a first claim on the dropped-down assets. The original lenders still have their liens, but on a diminished pool of collateral, and they are now structurally subordinated with respect to the company's most valuable property, again without their consent.</p>
</div>

<div class="warning-box">The classic precedent is a retailer that transferred a large chunk of its brand intellectual property to an unrestricted subsidiary and used it to raise new financing, leaving existing lenders subordinated to that IP. The maneuver became common enough that the move is named after that deal in restructuring circles. As with uptiers, the fight is over whether the baskets and definitions actually permitted the transfer, and lenders now negotiate hard for blockers (caps on transfers to unrestricted subs, J. Crew blockers) in new documents to prevent it.</div>`,
  },
  {
    title: 'Double-Dip Transactions: The Mechanic',
    content: `<p>The double-dip is the most intricate of the common archetypes. A creditor structures its claim so that, on a filing, it has two independent allowed claims against the same valuable entity, roughly doubling its recovery relative to similarly ranked creditors, capped at payment in full.</p>

<div class="example-box">
<div class="example-label">A Clean Worked Example</div>
<p>ParentCo holds essentially all the operating assets and has issued the company's only existing debt: a 200 first-lien term loan. For tax or regulatory reasons the company creates FinanceCo, which does no real business. FinanceCo issues 200 of new secured notes, and the creditors demand a first-lien guarantee from ParentCo, so the notes sit alongside (pari passu with) the term loan at ParentCo. <strong>That is the first dip: a direct secured claim against ParentCo via the guarantee.</strong></p>
<p>FinanceCo has no use for the 200 it raised, so it lends it up to ParentCo through a secured intercompany loan that also ranks alongside the term loan. In exchange, FinanceCo receives a 200 intercompany note receivable from ParentCo, and pledges that receivable to its noteholders as collateral. <strong>That is the second dip: an indirect claim, because FinanceCo can enforce its 200 receivable against ParentCo, and any recovery flows to FinanceCo's only creditors, the noteholders.</strong></p>
<p>On a filing, the noteholders present two separate 200 claims against ParentCo (400 of claims) while having advanced only 200 of money. Against a constrained pool of value, those two claims capture a far larger slice than the term lenders' single 200 claim. Total dollar recovery is still capped at payment in full on the 200 they actually lent.</p>
</div>

<p>The structure works because the two claims are legally distinct: one arises from a guarantee, the other from an intercompany loan that a separate legal entity can independently enforce. Courts generally respect the separateness of entities and the enforceability of intercompany obligations, which gives the second dip its teeth. It is contentious because the term lenders, who thought they ranked equally with the noteholders, find the noteholders eating a double portion of the limited value, diluting everyone else's recovery.</p>`,
  },
  {
    title: 'Double-Dip: Why It Caps and How It Evolved',
    content: `<p>Two follow-on points that show real understanding.</p>

<p><strong>Why it caps at par.</strong> The plain double-dip stops being useful to the creditor once both claims together repay the 200 actually lent. You cannot collect more than you are owed, so additional recovery on the second claim beyond payment in full does the noteholder no good. The doubling is about capturing a larger share of a <em>shortfall</em>, not about being repaid twice in absolute dollars. If there is plenty of value, both pari creditors get paid in full and the double-dip is irrelevant; the structure only bites when value is scarce and the enlarged claim grabs more of the limited pool.</p>

<p><strong>How it evolved.</strong> Practitioners have engineered more aggressive variants intended to push beyond the simple par cap or to extend the benefit, sometimes by recycling the borrowed proceeds so they generate additional claims, producing what the market loosely calls multi-dip or pari-plus structures. The technical detail is well beyond interview scope.</p>

<div class="warning-box"><strong>In an interview, do not recite a perfect generalized definition.</strong> The structure has too many permutations and you will tie yourself in knots. Walk through the ParentCo and FinanceCo example, name the two dips (a direct guarantee claim and an indirect intercompany claim), state that this doubles the claim size against the same value, and note the recovery is capped at payment in full. That demonstrates real understanding, which is all the interviewer wants. If pressed, add that newer multi-dip variants try to extend the concept.</div>

<div class="takeaway-box"><strong>The three archetypes in one frame:</strong> uptiers reorder priority by vote (priming the minority); drop-downs move assets beyond the lenders' reach (structural subordination by transfer); double-dips multiply a creditor's claims against the same value (enhanced recovery by structure). All three are the same story: loose documents plus an organized majority equals value taken from the unorganized minority.</div>`,
  },
];
