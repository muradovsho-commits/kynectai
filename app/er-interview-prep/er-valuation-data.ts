export const ER_VALUATION_SECTIONS = [
  {
    title: 'The Target Price',
    content: `<p>Every ER report includes a <strong>target price</strong>&mdash;the analyst's estimate of what the stock should be worth in 12 months. The target price is typically derived from one or more valuation methodologies, applied to the analyst's forward estimates.</p>

<p>The most common approaches, in order of frequency used in ER:</p>

<h4>1. Multiples-Based Valuation (Most Common)</h4>

<p>Apply a target multiple to a forward financial metric. Example: if you believe the company should trade at 18x next year's earnings, and your EPS estimate is $5.50, your target price is $99.</p>

<p>The critical judgment: <strong>what multiple is appropriate?</strong> You determine this by analyzing: the company's historical trading range (has it traded at 15&ndash;22x over the past 5 years?), comparable companies' current multiples (peers trade at 16&ndash;20x), the company's growth rate relative to peers (faster growers deserve premium multiples), and qualitative factors (management quality, competitive position, earnings visibility).</p>

<p>Common multiples used in ER: <strong>P/E</strong> (the default for most sectors), <strong>EV/EBITDA</strong> (for capital-intensive or leveraged companies), <strong>EV/Revenue</strong> (for pre-profit growth companies), <strong>P/FCF</strong> (for companies where earnings quality is questionable), <strong>P/Book</strong> (for banks and insurers), and sector-specific multiples (EV/subscriber for cable, price per flowing barrel for E&P, price per bed for hospitals).</p>

<h4>2. DCF Analysis</h4>

<p>Project free cash flows for 5&ndash;10 years, calculate a terminal value, and discount everything back to today at WACC. ER analysts use DCFs more as a sanity check than a primary valuation tool because small changes in terminal assumptions swing the output dramatically. However, DCFs are particularly useful for companies undergoing significant change (margin expansion stories, turnarounds, secular growth companies) where historical multiples may not be representative of future value.</p>

<h4>3. Sum-of-the-Parts (SOTP)</h4>

<p>For diversified companies, value each segment separately using the appropriate peer-group multiple, then add them up and subtract corporate overhead and net debt. SOTP often reveals a "conglomerate discount"&mdash;the whole trading for less than the sum of its parts&mdash;which can be a catalyst for activism, spin-offs, or strategic alternatives.</p>

<h4>4. Dividend Discount Model (DDM)</h4>

<p>For mature, stable dividend payers (utilities, REITs, consumer staples, telecoms), the DDM values the stock as the present value of future dividends. DDM is less relevant for growth companies that reinvest earnings rather than distributing them.</p>`,
  },
  {
    title: 'Common Valuation Pitfalls in ER',
    content: `<p><strong>Anchoring to the current price.</strong> An analyst covering a stock at $80 may unconsciously set a target price near $80 (say, $90) because deviating dramatically feels uncomfortable. The best analysts set the target price based on their model's output, not the current stock price. If your work says $120, publish $120.</p>

<p><strong>Using peak multiples on peak earnings.</strong> Applying a 20x P/E (the high end of the historical range) to a cyclically elevated EPS estimate produces an inflated target price. A more conservative approach: apply a mid-cycle multiple to mid-cycle earnings, or apply a premium multiple to trough earnings if the company is in a downturn.</p>

<p><strong>Ignoring the balance sheet.</strong> Two companies with identical EPS can have very different equity values if one has $5B in net cash and the other has $5B in net debt. Always check whether your P/E-based target price is consistent with the implied enterprise value.</p>`,
  },
];
