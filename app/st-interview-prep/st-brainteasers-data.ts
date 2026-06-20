export const ST_BRAINTEASERS_SECTIONS = [
  {
    title: 'What Brainteasers Actually Test',
    content: `<p>Brainteasers have a fearsome reputation in S&T interviews, but they are far less scary once you understand what they are really for. The interviewer almost never cares whether you instantly know the answer. They care how you think when you do not.</p>

<div class="key-concept">A brainteaser tests your <strong>problem-solving process under pressure</strong>: can you stay calm when you do not immediately see the answer, break an unfamiliar problem into pieces, reason out loud in a structured way, make sensible assumptions, and handle being nudged or corrected without rattling? That is exactly the skill a trader needs when a novel situation hits the market and there is no textbook answer. So the brainteaser is a simulation of the job, not a trivia quiz. The single biggest mistake candidates make is going silent to think; the interviewer cannot evaluate silence. <strong>Think out loud.</strong> Your narrated reasoning is the thing being graded.</div>

<div class="warning-box">Common failure modes that sink candidates, all about temperament rather than math: freezing and going quiet; blurting a guess without reasoning; getting flustered when challenged ("are you sure?") and abandoning a correct answer; and refusing to commit to an assumption when one is needed. The interviewer is often testing your composure deliberately, sometimes by pushing back even when you are right, to see if you crack. Calm, structured, out-loud reasoning beats a fast but silent (or panicked) answer every time.</div>

<div class="takeaway-box">Reframe the brainteaser: it is not "do you know this?" but "how do you think?" Your job is to make your reasoning visible, stay composed, and show a method. A candidate who works calmly toward an answer, narrating each step, outscores one who either guesses instantly or freezes, even if both eventually reach the same number.</div>`,
  },
  {
    title: 'A Universal Approach',
    content: `<p>Almost any brainteaser yields to the same calm, repeatable process. Having a method means you never face a teaser with nothing to do; you always have a first move.</p>

<div class="framework-box"><div class="fw-label">THE STEP-BY-STEP METHOD</div><strong>1. Clarify.</strong> Restate the problem and ask any clarifying questions. This buys thinking time and prevents solving the wrong problem.<br/><strong>2. Break it down.</strong> Decompose the problem into smaller, manageable parts or identify what is actually being asked.<br/><strong>3. State assumptions.</strong> When you need a number you do not have, assume a reasonable one out loud and proceed. Interviewers want to see sensible assumptions, not perfect data.<br/><strong>4. Reason out loud, step by step.</strong> Walk through your logic verbally so the interviewer follows your thinking.<br/><strong>5. Arrive at an answer and sanity-check it.</strong> Commit to a number, then ask whether it is reasonable in size.<br/><strong>6. Hold or revise under pressure.</strong> If challenged, calmly re-examine; defend a sound answer, and if you spot a real error, fix it gracefully.</div>

<div class="key-concept">The meta-skill across all of this is <strong>structured decomposition</strong>: turning one hard, unfamiliar question into a sequence of small, familiar ones. A market-sizing question becomes population times usage times price. A probability puzzle becomes enumerate the cases and count. A logic puzzle becomes work through the constraints one at a time. You are never really solving a "hard problem"; you are solving several easy ones in order. That is the same move as the mental math techniques (turn hard into easy and combine) and the same move traders use on novel market situations. Master the decomposition habit and brainteasers stop being scary.</div>

<div class="takeaway-box">Internalize the method so it runs automatically under stress: clarify, decompose, assume out loud, reason step by step, commit and sanity-check, hold or revise calmly. With a process in hand you will never freeze, because you always know your next move, and the process itself is much of what is being scored.</div>`,
  },
  {
    title: 'Estimation and Market-Sizing',
    content: `<p>One whole category of brainteaser is the estimation or "Fermi" question: "how many golf balls fit in a school bus," "how many gas stations are in the US," "what's the market for umbrellas in London." These look impossible and are actually the most method-driven of all.</p>

<div class="key-concept">The entire trick to estimation is <strong>breaking the unknowable into a chain of knowable, assumable pieces, then multiplying.</strong> You do not need to know the answer; you need to build it from reasonable building blocks. "How many gas stations in the US?" Start from the population (about 330 million), estimate cars (say 1 per 2 people, so ~165 million), estimate how many cars one station serves, and divide. Every step is an assumption you state out loud, and the magic is that errors tend to partly cancel, so a well-structured estimate usually lands within the right order of magnitude. The interviewer is watching your structure and the reasonableness of each assumption, not checking your number against a true value.</div>

<div class="example-box">
<div class="example-label">Worked: how many piano tuners in a large city?</div>
<p>Population of the city: say 3 million. People per household: ~3, so 1 million households. Fraction with a piano: maybe 1 in 20, so 50,000 pianos. Add some institutions (schools, venues); call it 60,000 pianos. Each tuned once a year. A tuner does maybe 3 per day, ~600 per year. So 60,000 / 600 = about 100 tuners. The number could be off, but the structure is sound and the order of magnitude is defensible, which is the whole point.</p>
</div>

<div class="takeaway-box">For any estimation question: build a chain (population, then a rate, then a frequency, then divide or multiply), state each assumption out loud, and aim for the right order of magnitude, not precision. Narrate the structure confidently. These questions reward a clear method more than any others, so they are points you can reliably win.</div>`,
  },
  {
    title: 'Worked Examples Across Types',
    content: `<p>Seeing the method applied to different teaser types builds the pattern recognition that makes new ones feel familiar. Notice how each is just decomposition plus calm reasoning.</p>

<div class="example-box">
<div class="example-label">Probability type: the birthday-style surprise</div>
<p>"In a room of 23 people, is it more likely than not that two share a birthday?" Surprisingly, yes (about 50 percent). The method: do not compute matches directly; use the complement. The chance all 23 have different birthdays is 365/365 x 364/365 x 363/365 ... which falls below 50 percent by 23 people, so the chance of a shared birthday exceeds 50 percent. The lesson is the reusable move (complement for "at least one match"), not memorizing the answer.</p>
</div>

<div class="example-box">
<div class="example-label">Logic type: weighing problem</div>
<p>"You have 8 balls, one is heavier; with a balance scale, find it in 2 weighings." Decompose: split into 3, 3, 2. Weigh the two groups of 3 against each other. If they balance, the heavy ball is in the leftover 2, weigh those two (1 weighing left): done. If one group of 3 is heavier, take those 3, weigh 1 versus 1: if they balance it is the third, else the heavier pan, done. The key insight, narrated out loud, is that each weighing has three outcomes (left, right, balanced), so it can sort into thirds, not halves.</p>
</div>

<div class="example-box">
<div class="example-label">EV/game type: the fair price</div>
<p>"A die is rolled; you are paid the number shown in dollars. What would you pay to play?" EV = average of 1 through 6 = 3.5. So a rational price is up to 3.50; below that you have positive expected profit. Then a follow-up might add a choice (re-roll once if you wish), which raises the EV and the fair price, testing whether you can re-compute when the game changes.</p>
</div>

<div class="key-concept">Across all types, the pattern is the same: identify which tool fits (complement for "at least one," enumeration for conditional probability, EV for games, constraint-by-constraint for logic, a chain of estimates for sizing), then apply it out loud and calmly. After working through a range of teasers, you stop seeing them as a scary grab-bag and start recognizing the handful of underlying types, which is exactly the pattern recognition the interview rewards.</div>

<div class="takeaway-box">Do not try to memorize a catalog of specific teasers and answers; interviewers can always find a new one. Instead, drill the <em>types</em> and their tools so any new teaser maps to a familiar approach. Practice a couple dozen across categories, always out loud, and the genre becomes manageable, even enjoyable.</div>`,
  },
];
