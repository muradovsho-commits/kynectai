export const CORE_SECTIONS = [
  {
    title: 'What Is Financial Modeling?',
    content: `<p>Suppose two partners at a small investment firm are debating whether to buy shares in a mid-size grocery chain. Partner A says the stock is underpriced at $45 and should be closer to $65. Partner B disagrees and thinks $45 is already generous. They each have opinions, but opinions alone don't settle the argument. What settles it is evidence&mdash;specifically, a structured set of projections and calculations that translate assumptions about the future into an estimated value today.</p>

<p>That structured set of projections is a <strong>financial model</strong>. Think of it as a stress-test for your thesis about a company. If you believe a stock is worth $65, a model forces you to specify <em>exactly</em> what has to be true about revenue growth, margins, and reinvestment for that number to hold up. If those assumptions look unrealistic when laid out explicitly, your thesis probably needs revision.</p>

<p>Financial models are used across finance in different ways. Equity analysts build them to recommend buying or selling a stock. Investment bankers build them to advise clients on whether to acquire another company, go public, or raise capital. Private equity professionals build them to decide whether to buy a business, how much debt to use, and what return they can expect when they eventually sell. Corporate finance teams use them internally to evaluate new projects, expansion plans, or capital allocation decisions.</p>

<p>A model is never the sole basis for a decision. It's one tool among many&mdash;comparable to a medical scan. A doctor wouldn't perform surgery based on a scan alone, and an investor shouldn't make a billion-dollar bet based on a spreadsheet alone. But just as a scan reveals things invisible to the naked eye, a model reveals things that gut feeling misses: hidden risks, implausible assumptions, and surprising sensitivities.</p>

<h4>The General Workflow</h4>

<p>Regardless of whether you're building a valuation, a merger model, or a buyout analysis, the workflow follows a common arc. You begin by clarifying what question you're trying to answer. Then you research the company, its industry, and its competitors. Next, you identify the handful of variables that drive the business&mdash;for a gym chain, that might be locations, memberships per location, and average monthly dues; for a software company, it might be enterprise customers, annual contract value, and renewal rate. After that, you build the model itself: projecting financial performance, estimating value, and testing scenarios. Finally, you synthesize the numbers with qualitative judgment and present a conclusion.</p>

<p>The technical difficulty is less about the math (which is mostly arithmetic and algebra) and more about the judgment: choosing appropriate assumptions, understanding which simplifications are acceptable, and interpreting results honestly rather than bending them to support a predetermined conclusion.</p>`,
  },
  {
    title: 'The Time Value of Money',
    content: `<p>If someone offered you $10,000 today or $10,000 three years from now, which would you take? Almost everyone chooses the money today, but the reason matters. The core insight is not about inflation&mdash;even in a world with zero inflation, present dollars are more valuable than future dollars because <strong>money received today can be put to work immediately</strong>.</p>

<p>Consider a practical example. You inherit $50,000 and face a choice: invest it in an index fund that has historically returned about 8% per year, or leave it in a non-interest-bearing safe deposit box and collect it three years later. If you invest, you'd expect roughly $50,000 × (1.08)³ ≈ $63,000 after three years. By choosing the safe deposit box, you forgo that ~$13,000 in potential gains. That forgone gain is your <strong>opportunity cost</strong>.</p>

<div class="key-concept">
<strong>Core Principle:</strong> Money today is worth more than the same amount in the future because today's money can be invested to earn a return. The size of that advantage depends on what returns you could realistically earn elsewhere&mdash;your opportunity cost.
</div>

<p>This principle underlies every investment decision. When you evaluate any use of capital&mdash;buying stock, funding a project, acquiring a company&mdash;you're implicitly comparing it to what that capital could earn if deployed differently. An investment is attractive only when it offers returns that exceed what you'd earn on alternatives of comparable risk.</p>

<h4>A Concrete Illustration</h4>

<p>Imagine you own a small commercial building and a tenant offers two lease structures. Under Lease A, the tenant pays $240,000 upfront for a two-year lease, and you refund the full $240,000 at the end. Under Lease B, the tenant pays a $20,000 deposit (refunded at the end) and $9,000 per month in rent.</p>

<p>On the surface, Lease A looks free&mdash;you hold $240,000 for two years and return it, pocketing nothing. But that's wrong. You hold $220,000 more under Lease A than under Lease B. If you can invest that $220,000 at 7% annually, you'd earn about $15,400 per year in returns. Under Lease B, you'd collect $108,000 per year in rent but have $220,000 less to invest.</p>

<p>Lease B is better when your realistic investment returns on $220,000 fall short of $108,000 per year (i.e., you'd need to earn 49% annually on that sum to break even&mdash;unrealistic). Lease A is better if you have some extraordinary investment opportunity. In most real-world scenarios, Lease B wins decisively. The point isn't the specific answer; it's the process of comparing the opportunity cost of tied-up capital against the explicit cash flows of each option.</p>`,
  },
  {
    title: 'Present Value and Discounting',
    content: `<p>Since future money is worth less than present money, we need a way to convert future cash flows into today's terms. This process is called <strong>discounting</strong>, and the result is the <strong>Present Value (PV)</strong>.</p>

<div class="formula-box">
Present Value = Future Cash Flow / (1 + Discount Rate)^n<br>
<small>where n = number of periods until the cash flow is received</small>
</div>

<p>The <strong>Discount Rate</strong> is the rate of return you could earn on comparable investments. If you could earn 10% per year on investments of similar risk, then $100 received one year from now is worth $100 / 1.10 = $90.91 today. That's because $90.91 invested at 10% would grow to exactly $100 in one year.</p>

<p>A higher Discount Rate means future cash flows are worth less today (you have better alternatives, so you demand a steeper discount). A lower Discount Rate means future cash flows are worth more today (your alternatives aren't as attractive, so you're willing to pay more for them).</p>

<div class="example-box">
<div class="example-label">Discounting Example</div>
<p>A rental property will generate $30,000 per year for 5 years, and you expect to sell it for $400,000 at the end of Year 5. Your required return is 8%.</p>
<p>PV of Year 1 rent: $30,000 / 1.08 = $27,778</p>
<p>PV of Year 2 rent: $30,000 / 1.08² = $25,720</p>
<p>PV of Year 3 rent: $30,000 / 1.08³ = $23,815</p>
<p>PV of Year 4 rent: $30,000 / 1.08⁴ = $22,050</p>
<p>PV of Year 5 rent + sale: $430,000 / 1.08⁵ = $292,710</p>
<p><strong>Total PV: $392,073</strong></p>
<p>If the asking price is $375,000, you'd consider buying because PV exceeds the price. If the asking price is $425,000, you'd pass.</p>
</div>`,
  },
  {
    title: 'The Internal Rate of Return (IRR)',
    content: `<p>While PV asks "What is this investment worth?", <strong>IRR</strong> asks "What return does this investment generate?" Technically, IRR is the Discount Rate at which the Net Present Value (the PV of cash flows minus the upfront cost) equals exactly zero.</p>

<p>Continuing the rental property example: if you buy for $375,000 and receive the cash flows described above, the IRR is the annual return that makes the PV of those cash flows exactly equal to $375,000. In this case, it works out to roughly 9.5%. Since 9.5% exceeds your 8% required return, the investment is attractive.</p>

<p>IRR is intuitive: it's the "effective compounded annual return" on your money. If you invest $500,000 and receive $1,000,000 back in 5 years with no interim cash flows, the IRR is the rate r such that $500,000 × (1 + r)⁵ = $1,000,000, which gives r ≈ 14.9%. You can verify: $500K growing at 14.9% annually for 5 years reaches about $1M.</p>

<h4>IRR vs. Required Return: The Decision Rule</h4>

<p>The investment decision rule using IRR is simple: if IRR exceeds your required return (the Discount Rate for that type of investment), proceed. If IRR falls short, don't. The required return for a specific project should reflect that project's risk level, not the company-wide average. A tech company evaluating a low-risk data center project should use a lower hurdle rate for that project than it would for a speculative R&D initiative.</p>`,
  },
  {
    title: 'The Weighted Average Cost of Capital (WACC)',
    content: `<p>Companies fund themselves with a mix of <strong>Equity</strong> (selling ownership stakes to shareholders) and <strong>Debt</strong> (borrowing money from lenders). Each source has a "cost"&mdash;a return that investors expect in exchange for providing capital. WACC blends these costs based on the proportion of each source in the company's capital structure.</p>

<div class="formula-box">
WACC = (Equity / Total Capital) × Cost of Equity + (Debt / Total Capital) × After-Tax Cost of Debt
</div>

<p>Why is Debt cheaper than Equity? Two reasons. First, Debt holders face less risk&mdash;they receive fixed interest payments and have priority over shareholders in bankruptcy. Lower risk means they accept a lower return. Second, interest payments on Debt are tax-deductible, which effectively reduces the cost to the company. If a company pays 6% interest and its tax rate is 30%, the after-tax cost is only 6% × (1 − 0.30) = 4.2%.</p>

<p>Why not fund everything with Debt? Because too much Debt increases the risk of financial distress. At extreme leverage levels, the probability of bankruptcy rises sharply, which increases both the Cost of Debt (lenders demand higher rates) and the Cost of Equity (shareholders demand a premium for the added risk). WACC initially falls as a company adds Debt (since Debt is cheaper), but beyond an optimal point, WACC starts rising again.</p>

<div class="example-box">
<div class="example-label">WACC Calculation</div>
<p>A company's capital structure is 65% Equity and 35% Debt. Its Cost of Equity (estimated via CAPM) is 11%, and its pre-tax Cost of Debt is 5.5%. The corporate tax rate is 25%.</p>
<p>After-Tax Cost of Debt = 5.5% × (1 − 0.25) = 4.125%</p>
<p><strong>WACC = 65% × 11% + 35% × 4.125% = 7.15% + 1.44% = 8.59%</strong></p>
</div>`,
  },
  {
    title: 'The Perpetuity Valuation Formula',
    content: `<p>If a company generates stable cash flow that grows at a constant rate forever, its value has a remarkably simple expression:</p>

<div class="formula-box">
Value = Next Period's Cash Flow / (Discount Rate − Growth Rate)<br>
<small>where Growth Rate &lt; Discount Rate</small>
</div>

<p>This is called the <strong>Gordon Growth Model</strong> or the perpetuity formula. Suppose a stable utility company generates $80 million in free cash flow this year, growing at 2.5% per year indefinitely, and the appropriate Discount Rate is 9%. Its value would be ($80M × 1.025) / (9% − 2.5%) = $82M / 6.5% ≈ $1,262 million.</p>

<p>The formula makes intuitive sense. Higher cash flow means higher value. Faster growth means higher value. A higher Discount Rate means lower value (because your alternative returns are better, so you demand a lower price). In the real world, no company has perfectly stable growth forever, which is why this formula is typically applied only to the "terminal period" of a valuation&mdash;the period after detailed year-by-year projections end.</p>`,
  },
  {
    title: 'Why Financial Modeling Is Hard in Practice',
    content: `<p>If the formula above captured everything, valuation would be trivial. Several complexities create the need for more sophisticated analysis:</p>

<p><strong>Cash flow isn't reported directly.</strong> You have to construct it from financial statements by making numerous adjustments. Reasonable people can disagree about which adjustments are appropriate, leading to different cash flow estimates from the same data.</p>

<p><strong>Growth rates change over time.</strong> A startup growing at 40% annually won't do so forever. A mature company declining at 2% might stabilize or accelerate its decline. Projecting how growth evolves requires industry knowledge and judgment.</p>

<p><strong>The Discount Rate is hard to pin down.</strong> WACC requires estimates for Cost of Equity (which depends on Beta, the Equity Risk Premium, and the Risk-Free Rate&mdash;all of which can be estimated differently) and the capital structure (which may change over time).</p>

<p><strong>"Company Value" means different things.</strong> The value to all investors (Enterprise Value) differs from the value to just shareholders (Equity Value), and these concepts require careful handling to avoid errors.</p>

<p><strong>Not every situation is about value.</strong> In a leveraged buyout, you care about annualized returns. In a merger, you care about earnings impact. In a debt issuance, you care about repayment capacity. Each requires a different analytical framework built on these same foundations.</p>`,
  },
  {
    title: 'Foundational Concepts: Interview Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Why is $1,000 received today worth more than $1,000 received in two years?</div>
<div class="answer">Because the $1,000 received today can be invested immediately. If you earn 7% annually, it becomes roughly $1,145 in two years. The future $1,000 has no time to compound, so it's worth less in today's terms. This holds even without inflation&mdash;the driving force is the ability to earn a return on invested capital.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">An investment costs $600,000 upfront and produces $90,000 per year for 10 years. Is it a good deal?</div>
<div class="answer">It depends on the required return. If you discount $90,000 per year for 10 years at 8%, the PV is approximately $604,000&mdash;barely above the cost, implying an IRR right around 8%. If your required return is 6%, it's attractive. If your required return is 10%, the PV drops to about $553,000, which is below the cost, so you'd pass. Context and opportunity cost determine the answer.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">What is WACC and what does an 8% WACC mean?</div>
<div class="answer">WACC is the Weighted Average Cost of Capital&mdash;a blended required return reflecting the costs of all funding sources (Equity and Debt), weighted by their proportions. An 8% WACC means the company's investors collectively expect about 8% annualized returns. Debt investors earn their interest, equity investors earn stock returns, and the weighted average across both groups is 8%. It's the hurdle rate a project must clear to create value.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">Why is Debt typically cheaper than Equity for companies?</div>
<div class="answer">Two reasons. First, Debt holders bear less risk: they receive fixed contractual payments and have priority over equity holders in bankruptcy. Lower risk means they accept lower returns. Second, interest payments are tax-deductible, so the government effectively subsidizes a portion of the cost. Equity holders, by contrast, have no guaranteed payments, bear the residual risk, and receive dividends that are not tax-deductible for the company.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">A company generates $150 million in annual cash flow growing at 3%. Your Discount Rate is 10%. Roughly what is this company worth?</div>
<div class="answer">Using the perpetuity formula: Value = $150M / (10% − 3%) = $150M / 7% ≈ $2,143 million, or about $2.1 billion. This assumes stable, perpetual growth at 3%&mdash;which is realistic only for mature, established businesses. For younger or faster-growing companies, you'd project cash flows in detail before applying this formula to the terminal period.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">What is IRR and how do you use it?</div>
<div class="answer">IRR is the annualized compounded return an investment generates. Technically, it's the Discount Rate at which NPV equals zero. You compare IRR to the appropriate required return: if IRR exceeds the hurdle rate, the investment creates value; if it falls short, it doesn't. For example, if a project's IRR is 14% and the division-specific WACC is 11%, the project is worth pursuing.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 7</div>
<div class="question">What factors would cause a company's intrinsic value to increase?</div>
<div class="answer">Three categories. First, higher expected cash flows&mdash;from revenue growth, margin expansion, or more efficient capital deployment. Second, faster growth in those cash flows. Third, a lower Discount Rate&mdash;which could result from reduced business risk, a lower Risk-Free Rate environment, or a shift to a cheaper capital structure. The value formula is Cash Flow / (Discount Rate − Growth Rate), so anything that increases the numerator or decreases the denominator raises the value.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 8</div>
<div class="question">A company's overall WACC is 12%, but its consumer products division has a WACC of 7%. A new consumer product project has an expected IRR of 9%. Should the company pursue it?</div>
<div class="answer">Yes. The relevant comparison is the division-specific WACC (7%), not the company-wide WACC (12%). Since 9% exceeds 7%, the project creates value for that division. The company-wide WACC reflects the blended risk of all divisions and would unfairly penalize a low-risk project. Always match IRR to the risk profile of the specific project being evaluated.</div>
</div>`,
  },
];
