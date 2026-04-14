export const ST_STRATEGIES_SECTIONS = [
  {
    title: 'Market-Making',
    content: `<p>The core function of an S&amp;T desk is making markets: standing ready to buy or sell a security at quoted prices. The market maker earns the bid-ask spread but takes on inventory risk. If you buy $50M of bonds from a client and the market drops before you can sell, you lose money on the position.</p>

<p>Effective market-making requires: accurate pricing (knowing where the fair value is so you set your bid and ask appropriately), inventory management (not accumulating too much risk in one direction), client knowledge (understanding who's likely to buy what you're holding), and hedging skill (using related instruments to reduce directional risk while retaining the spread).</p>`,
  },
  {
    title: 'Relative Value Trading',
    content: `<p>Relative value strategies profit from pricing discrepancies between related instruments. Examples: buying a corporate bond and shorting the CDS if the bond is cheap relative to the CDS (the "basis trade"), going long one maturity on the yield curve and short another to profit from a change in curve shape, or buying one company's bonds and shorting another's if you believe the spread between them is mispriced.</p>

<p>Relative value trades are generally lower risk than directional trades because both legs move together-you're betting on the <em>difference</em>, not the absolute level. But they carry basis risk (the risk that the relationship between the two instruments breaks down).</p>`,
  },
  {
    title: 'Flow Trading',
    content: `<p>Flow trading monetizes client order flow. The desk sees what clients are buying and selling and uses that information (ethically and within regulatory bounds) to manage inventory and position around anticipated flows. For example, if you know a large asset manager is rebalancing and will need to sell $500M of 10-year Treasuries over the next three days, you can position your book accordingly (being a willing buyer at a slight discount, then selling into the market over the following days as the selling pressure subsides).</p>`,
  },
  {
    title: 'Macro / Directional Trading',
    content: `<p>Taking directional positions based on a macroeconomic thesis. A rates trader might go long duration (buy bonds) if they believe the Fed will cut rates. An FX trader might short the euro if they believe the ECB will remain dovish while the Fed tightens. Macro trading carries higher risk (you can be right on the thesis but wrong on the timing) but can be highly profitable.</p>`,
  },
];
