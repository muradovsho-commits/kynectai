export const PE_TECH_SECTIONS = [
  {
    title: `1. The 3 Financial Statements (Deep Dive)`,
    content: `<p>In PE, you must link the statements perfectly in your sleep. It's not just about knowing them; it's about knowing how an obscure non-cash charge flows through the matrix.</p>
<br/>
<p><strong>The Core Engine:</strong><br/>
1. <strong>Income Statement (IS):</strong> Shows profitability over a period. Ends in Net Income.<br/>
2. <strong>Cash Flow Statement (CFS):</strong> Starts with Net Income, adds back non-cash expenses (Depreciation/Amortization), adjusts for Changes in Working Capital, and subtracts CapEx to find Free Cash Flow.<br/>
3. <strong>Balance Sheet (BS):</strong> A snapshot in time. Assets = Liabilities + Equity. Net Income flows into Retained Earnings. Cash from the CFS becomes the top-line Cash asset.</p>
<br/>
<p><strong>If Depreciation goes up by $10 (assuming a 20% tax rate):</strong><br/>
1. IS: Pre-tax Income down $10. Taxes are down $2 (saving). Net income down $8.<br/>
2. CFS: Net Income down $8. Add back the $10 non-cash Depreciation. Cash is UP $2.<br/>
3. BS: Cash is up $2. PP&E is down $10 (from Depreciation). Assets are down $8 total. On the other side, Retained Earnings are down $8 (via Net Income). The BS balances perfectly.</p>`
  },
  {
    title: `2. Free Cash Flow (Unlevered vs Levered)`,
    content: `<p>Free Cash Flow (FCF) is the lifeblood of Private Equity. EBITDA is a proxy, but FCF is what actually pays down the debt.</p>
<br/>
<p><strong>Unlevered FCF (Free Cash Flow to the Firm - FCFF):</strong><br/>
The cash available to ALL investors (Debt and Equity) before any debt interest is paid. Used in DCF valuations.<br/>
<em>Formula:</em> EBIT * (1 - Tax Rate) + D&A - CapEx - Change in Net Working Capital.</p>
<br/>
<p><strong>Levered FCF (Free Cash Flow to Equity - FCFE):</strong><br/>
The cash available STRICTLY to equity holders <em>after</em> mandatory debt principal and interest obligations have been paid off. This is the ultimate metric for LBO debt paydown capacity.<br/>
<em>Formula:</em> Net Income + D&A - CapEx - Change in NWC - Mandatory Debt Amortization.</p>`
  },
  {
    title: `3. Valuation (Multiples & DCFs)`,
    content: `<p>PE firms rarely rely heavily on DCFs because their holding period is only 5 years, relying instead on Exit Multiples.</p>
<br/>
<p><strong>EV / EBITDA (The Standard):</strong><br/>
Why use EV/EBITDA instead of P/E? Because Private Equity firms fundamentally change the capital structure (they add mountain of debt). P/E is affected by interest payments, so an LBO ruins the P/E ratio. EBITDA is capital-structure-neutral (before Interest and Taxes), so EV/EBITDA allows an "apples-to-apples" comparison regardless of how much debt the company has.</p>
<br/>
<p><strong>Creating "Adjusted EBITDA":</strong><br/>
A massively tested concept. If a founder pays himself an absurd $5M salary to golf, the PE firm will fire him and hire a CEO for $1M. In the LBO model, you will "Add-Back" $4M to the historical EBITDA, because that cash is now freed up for debt service. Understanding what counts as a legitimate "Add-Back" (non-recurring legal fees, excess salary) is critical.</p>`
  },
  {
    title: `4. Deferred Tax Liabilities (DTLs) & Step-Ups`,
    content: `<p>This is the absolute most advanced accounting concept tested in standard Megafund models. If you get this right, you pass.</p>
<br/>
<p><strong>The Asset Write-Up:</strong><br/>
When PE acquires a company, they often allocate the purchase price to the target's assets, marking them up from their historical book value to their actual Fair Market Value (e.g., land bought in 1990 is worth way more now). However, the IRS does not allow you to deduct this newly created depreciation for tax purposes.</p>
<br/>
<p><strong>The DTL Creation:</strong><br/>
Because your GAAP accounting books now report huge depreciation (lowering your book taxes), but your IRS books do not recognize it (keeping your cash taxes high), a temporary timing difference is created. You must model a Deferred Tax Liability (DTL) on the balance sheet that slowly bleeds down over the life of the asset.</p>`
  }
];
