export const RX_LME_SECTIONS = [
  {
    title: 'What LMEs Are',
    content: `<p>Over the last several years, the most consequential development in restructuring has been the rise of aggressive liability management transactions, sometimes called creditor-on-creditor violence. These are out-of-court maneuvers that exploit loose credit documents to reorder priority, raise new senior money, or move assets, usually advantaging one creditor group at the direct expense of another.</p>

<div class="key-concept">They have become so central that an interviewer at a top group will absolutely expect you to understand the major archetypes. Three matter most: <strong>uptiers</strong> (priming), <strong>drop-downs</strong> (asset transfers), and <strong>double-dips</strong>. All exploit the same underlying reality: documents drafted in better times left gaps, and a majority creditor group working with the company can use those gaps to climb over the minority.</div>`,
  },
  {
    title: 'Uptier Transactions (Priming)',
    content: `<p>In an uptier, a majority group of existing lenders agrees with the company to issue new super-priority debt that ranks ahead of the existing debt, and to exchange their own existing holdings up into that new senior tranche. Because amending the priority and lien provisions typically requires only a majority vote, the majority lenders can use their votes to subordinate the non-participating minority, who are left holding debt that has been primed (pushed down in priority) without their consent.</p>

<div class="example-box">
<div class="example-label">Mechanics</div>
<p>The company and a majority of the term lenders agree to a new financing that sits senior to the existing term loan. The participating majority rolls their old loans into the new senior debt at attractive terms. The minority who were not invited (or refused) keep their old loans, which now rank behind the new super-priority debt the majority just created. The minority went from first in line to behind a brand-new tranche, purely because the majority had the votes to permit it under the loose documents.</p>
</div>

<p>This archetype became infamous through a series of heavily litigated cases, and courts have split on whether specific implementations were permitted by the documents, which is exactly why the precise drafting matters so much.</p>`,
  },
  {
    title: 'Drop-Down Transactions (Asset Transfers)',
    content: `<p>A drop-down exploits the restricted-versus-unrestricted subsidiary distinction. The company transfers valuable assets (often the crown jewels, like key brands or intellectual property) out of the restricted group and into an unrestricted subsidiary that sits outside the existing lenders' collateral perimeter. The unrestricted subsidiary then raises new debt secured by those assets.</p>

<div class="example-box">
<div class="example-label">The structural insight</div>
<p>The company did not change anyone's priority by vote. It moved the assets to a place the existing lenders' liens do not reach, then borrowed against them fresh. The new lenders have a first claim on the dropped-down assets. The original lenders still have their liens, but on a diminished pool of collateral, so they have been effectively subordinated with respect to the company's most valuable property, again without consent, because the investment and asset-sale baskets permitted the transfer.</p>
</div>

<p>This archetype is named in restructuring circles after the early high-profile case that popularized it, and like uptiers it has spawned extensive litigation about whether the baskets really allowed it.</p>`,
  },
  {
    title: 'Double-Dip Transactions',
    content: `<p>The double-dip is the most intricate of the common archetypes. A creditor structures its claim so that, on a filing, it has two independent allowed claims against the same valuable entity, roughly doubling its recovery relative to similarly ranked creditors, capped at payment in full.</p>

<div class="example-box">
<div class="example-label">A Clean Worked Example</div>
<p>ParentCo holds essentially all the operating assets and has issued the company's only existing debt: a 200 first-lien term loan. For tax or regulatory reasons the company creates FinanceCo, which does no real business. FinanceCo issues 200 of new secured notes, and the creditors demand a first-lien guarantee from ParentCo, so the notes sit alongside the term loan. <strong>That is the first dip: a direct secured claim against ParentCo via the guarantee.</strong></p>
<p>FinanceCo has no use for the 200, so it lends it up to ParentCo through a secured intercompany loan that also ranks alongside the term loan. In exchange, FinanceCo receives a 200 intercompany note receivable, and pledges that receivable to its noteholders. <strong>That is the second dip: an indirect claim, because FinanceCo can enforce its 200 receivable against ParentCo, and any recovery flows to its noteholders.</strong></p>
<p>On a filing, the noteholders present two separate 200 claims against ParentCo (400 of claims) while having advanced only 200 of money. Against a constrained pool of value, those two claims capture a far larger slice than the term lenders' single 200 claim. Total dollar recovery is still capped at payment in full on the 200 they actually lent.</p>
</div>

<p>The structure works because the two claims are legally distinct: one arises from a guarantee, the other from an intercompany loan a separate legal entity can independently enforce. It is contentious because the term lenders, who thought they ranked equally, find the noteholders eating a double portion of the limited value.</p>

<div class="warning-box"><strong>In an interview, do not recite a perfect definition.</strong> Walk through the ParentCo and FinanceCo example, name the two dips (a direct guarantee claim and an indirect intercompany claim), state that this doubles the claim size against the same value, and note the recovery is capped at payment in full. Newer variants (multi-dip, pari-plus) try to extend the concept beyond the simple cap, but the basic mechanic is what you need.</div>`,
  },
];
