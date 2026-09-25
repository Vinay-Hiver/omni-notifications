# Research method

## Sourcing rules

**Source priority, best first:**
1. Vendor help centre and product documentation. This is what the product actually does, written by people who have to support it.
2. The public pricing page. Authoritative on numbers, often vague on mechanics.
3. Changelogs and release notes. The best way to find features that exist but are not marketed, and to date when something shipped.
4. Engineering and product blog. Good on the reasoning behind a design.
5. Third-party writeups, analyst pages, comparison sites. **Worst available source and frequently wrong.** Use them only to find a lead, then verify it at the source before it goes on the board.

**Every fact carries a URL and a check date.** AI pricing and features change monthly. Undated claims cannot be re-checked, which means in three months a reader has to redo the whole study to trust any of it.

**When sources disagree**, put both on the board with their dates and say which you trust and why. A quiet pick looks like certainty you do not have.

**Never write a number from memory.** This is the failure that destroys trust in the entire artefact, because a reader who catches one invented figure reasonably assumes the rest are invented too. If you cannot source something, write "could not verify" on the board. That is a respectable thing to say and an unsourced number is not.

## Finding what the PRD missed

The most valuable finding is rarely "they are cheaper than us." It is usually structural. Two patterns recur:

**The vendor split it into several features and the PRD compared against one.** A PRD once benchmarked a testing feature against a competitor's batch tests and concluded "their evaluation is fully manual." The competitor actually shipped three deliberately separate testing surfaces, one of which was fully automated and metered. The PRD's headline competitive claim was wrong, and the split itself was the real finding, because it revealed a product decision worth copying.

To catch this: read the whole product area in the vendor's documentation, not only the page whose title matches the PRD's framing. Check the navigation of their docs. Check their changelog for the last twelve months.

**The word means something different to them.** Terms like "resolution", "conversation", "session", "agent" carry different definitions and different prices at each vendor. Two vendors charging $0.80 and $0.99 for a "resolution" may not be selling the same thing at all. Whenever the PRD borrows a term the market already uses, check what the market means by it, and check whether the PRD's stricter or looser definition survives contact with a pricing page where none of the surrounding UI exists to explain it.

## Structuring a vendor teardown

Per vendor, in this order:

1. **What they ship.** One paragraph, plain.
2. **The mechanic, in their words.** Quote the vendor's own framing briefly. How they describe it tells you what they think the product is.
3. **The numbers.** Prices, limits, thresholds, tiers.
4. **What is good about it.** Be generous. A teardown that finds nothing to admire was not done carefully.
5. **What is weak.** Be specific. "Confusing" is not a weakness, "the meter shows credits while the invoice shows dollars and the conversion is on a different page" is.
6. **Source line.** URLs and check date.

## Screenshots

Real shipped UI ends arguments that description cannot. Getting them:

- Vendor documentation images usually sit on a CDN separate from the doc page. When a help page returns 403 to a direct fetch, open it in the browser, list the image URLs, and fetch those directly. The CDN is normally open even when the page is not.
- Capture the whole surface including the surrounding navigation. A cropped panel loses the information about where the feature lives, which is often the interesting part.
- Caption every screenshot with vendor, what it shows, and source URL. An uncaptioned screenshot on a board gets misattributed within one meeting.
- Marketing images and mockups do not count. Only ship what the product actually renders.

## Writing findings

The test: **if the team read this and nothing about the product would change, it is an observation, not a finding.** Delete it.

Structure each one as claim, evidence, consequence.

> **3. Their auto top-up has no spending ceiling and support threads show it burns people.**
> Three vendors offer automatic credit purchase. Only one pairs it with a monthly maximum. The other two have recurring support threads from customers surprised by a large invoice, sourced below.
> Consequence: pair auto top-up with a monthly spend ceiling in v1. It costs one field and removes the single most common billing complaint in this category.

Rank them by how much they would change the product, not by how interesting they were to find.

## Corrections

Quote the PRD line verbatim, state what is actually the case, source it, say what follows. Neutral tone, no softening that obscures the point and no scolding. The PRD author wrote from memory under time pressure, which is normal, and the whole reason the study exists.

If nothing was wrong, say so explicitly and list the claims you checked. An empty corrections zone with no note reads as "not checked", which wastes the credibility you earned doing the work.

## The optional HTML report

Only when someone wants something linkable outside Figma. Ask first, and do not build it by default. It duplicates the board, and a duplicate that drifts out of sync is worse than not having one.

If you do build it: publish it as an Artifact so it has a URL, load the `artifact-design` skill before writing it, and keep it to the same content as the board so the two cannot disagree. A restrained editorial look works better than a dashboard look here, because the content is argument rather than data. One accent colour, generous whitespace, semantic colours reserved for meaning.

## Cost discipline

This research is thorough, not exhaustive. Verify each fact once, properly, and move on. Do not re-verify what you have already sourced, do not run parallel agents that duplicate each other's searches, and do not read a forty-page pricing doc when the pricing page answers the question. The budget is better spent looking at one more competitor's actual product than re-reading a page you have already understood.
