export const ACCT_ASSETS_SECTIONS = [
  {
    title: 'Current Assets',
    content: `<p><strong>Cash and Cash Equivalents:</strong> The most liquid assets. Cash equivalents are short-term investments that are readily convertible to known amounts of cash and have original maturities of three months or less. Auditors confirm cash balances directly with financial institutions and review bank reconciliations for reconciling items that might indicate misappropriation or manipulation.</p>

<p><strong>Accounts Receivable (AR):</strong> Amounts owed by customers for goods or services delivered. Reported net of an allowance for doubtful accounts&mdash;an estimate of uncollectible amounts. The allowance is one of the most judgment-intensive estimates on the balance sheet. Auditors assess the reasonableness of the allowance by reviewing the aging schedule, historical collection rates, and subsequent collections after year-end.</p>

<p><strong>Inventory:</strong> Goods held for sale or used in production. Under GAAP, inventory is measured at the lower of cost or net realizable value (NRV). Cost flow assumptions&mdash;FIFO (first in, first out), LIFO (last in, first out), or weighted-average&mdash;determine the cost assigned to goods sold vs. goods remaining. In inflationary environments, LIFO produces lower inventory balances (and higher COGS) than FIFO. Auditors observe physical inventory counts and test the NRV analysis.</p>`,
  },
  {
    title: 'Non-Current Assets',
    content: `<h4>Property, Plant &amp; Equipment (PP&amp;E)</h4>

<p>PP&amp;E is recorded at cost and reduced by accumulated depreciation over its useful life. Key audit considerations include: proper capitalization (distinguishing between capital expenditures that extend useful life vs. repair expenses that merely maintain the asset), impairment testing when indicators exist, and the reasonableness of useful life and salvage value estimates. Asset impairment occurs when the carrying amount exceeds the recoverable amount&mdash;a judgment that requires estimating future cash flows and discount rates.</p>

<h4>Goodwill &amp; Intangible Assets</h4>

<p>Goodwill arises from business combinations and represents the excess of purchase price over the fair value of identifiable net assets acquired. Under GAAP, goodwill is not amortized but is tested annually for impairment (or more frequently when triggering events occur). Goodwill impairment is one of the most significant and complex estimates in financial reporting&mdash;it requires management to estimate the fair value of a reporting unit, a highly judgmental exercise that auditors must evaluate with specialized valuation knowledge.</p>

<p>Identifiable intangible assets (customer relationships, trade names, patents, technology) are amortized over their useful lives. The valuation of intangibles acquired in a business combination involves assumptions about customer attrition rates, royalty rates, and discount rates that are difficult to verify and easy to manipulate.</p>`,
  },
  {
    title: 'Liabilities',
    content: `<h4>Accounts Payable &amp; Accrued Liabilities</h4>

<p>Accounts payable represents amounts owed to suppliers for goods and services received but not yet paid. Accrued liabilities are obligations that have been incurred but not yet invoiced (accrued wages, accrued interest, warranty reserves). Auditors test for <strong>completeness</strong>&mdash;the risk that liabilities are understated or omitted&mdash;by reviewing subsequent cash disbursements and searching for unrecorded liabilities.</p>

<h4>Debt &amp; Lease Obligations</h4>

<p>Borrowings must be classified as current (due within one year) or long-term. Debt is typically recorded at amortized cost using the effective interest method, which allocates discount or premium over the debt's life. Under ASC 842, most operating leases appear on the balance sheet as right-of-use assets and corresponding lease liabilities&mdash;a significant change that affected the reported leverage ratios of companies with substantial operating leases.</p>

<h4>Income Tax: Current &amp; Deferred</h4>

<p>Income tax accounting is among the most complex areas in GAAP. <strong>Current tax</strong> is the amount actually owed to tax authorities for the current period based on taxable income. <strong>Deferred tax</strong> arises from temporary differences between the book value of assets and liabilities and their tax bases. A deferred tax liability (DTL) means tax will be paid in the future (e.g., accelerated depreciation for tax reduces current taxes but will be recaptured). A deferred tax asset (DTA) means taxes paid in the past or future deductions are available (e.g., warranty accruals deductible only when paid).</p>

<div class="formula-box">
Tax Expense = Current Tax + Change in Deferred Tax<br>
Deferred Tax Asset/Liability = Temporary Difference × Enacted Tax Rate
</div>`,
  },
];
