# FigJam board specification

## Layout

Every zone is a `SECTION`. All sections at `x = 0`, uniform width, stacked vertically with a 200px gap between them. Nothing sits outside a section.

- **Width:** 2400 to 3400. Pick one at the start and never vary it. Ragged right edges make a board look unfinished when you zoom out, which is exactly when a stakeholder forms their first impression. 2464 suits mostly-text boards, 3400 suits boards carrying wide comparison tables or screenshots.
- **Gap:** 200 between sections. Tighter and the zones visually merge, wider and the board feels empty when scrolling.
- **Section names:** set to empty string. Each zone starts with its own H1 text node, so the grey section chrome above it just repeats the title in a worse font.
- **Inner padding:** 80 left and right, 80 top before the H1, 100 bottom after the last element. Content lives in the width minus 160.

Compute each section's `y` as you go: `y += previousHeight + 200`. Resize a section to fit its content once the content is placed, not before.

## Type scale

Inter throughout, because it is FigJam's default and always available.

| Role | Size | Weight | Colour |
|---|---|---|---|
| Zone H1 | 48 | Bold | ink |
| Zone standfirst | 20 | Regular | secondary |
| Block heading | 28 | Medium | ink |
| Body | 16 | Regular | ink |
| Caption, source line, date | 13 | Regular | tertiary |

Pick one accent colour for the whole board and use semantic colours (positive, caution, negative) only where they carry meaning. Semantic colour follows the meaning of the number, not the mood of the section it sits in: a reassuring zero rendered in the alarm colour reads as an alarm.

## The zones, in order

The order matters. It follows the sequence in which a stakeholder's questions actually arrive.

**1. Read me** (always)
What this board is, what PRD version and date it studies, who asked, what date the research was done, and how to navigate. Three or four sentences and a list of the zones. Someone opening this cold in three months should orient in twenty seconds.

**2. The PRD in plain English** (always)
Six to ten sentences, no jargon, plus the key numbers as a small table. Written before the research, from Phase 1. If two parts of the PRD contradict each other, note it here.

**3. Market map** (always)
Who is in this space and how they cluster. Two axes that actually discriminate, or simple labelled groups if no honest axes exist. Do not invent a 2x2 to look strategic. Include a short note on who you left out and why.

**4. Competitor teardown** (always)
One block per vendor (such as Zendesk, Freshdesk, Intercom, Slack, Front, Pylon). Each block: what they ship, the mechanic in their words, the numbers, what is good about it, what is weak, and a dated source line. This is the longest zone. Use a table when the vendors are directly comparable and blocks when they are not.

**5. Screens from the field** (fetch relevant screenshots wherever available)
Real shipped UI, actively downloaded from vendor documentation, help articles, or live app screens. Caption each with vendor, what it shows, and where it came from. Two or three genuine screenshots beat a page of description. Prioritize real screenshots of settings, notifications, or triage flows wherever available. Skip marketing fluff or mockups.

**6. Feature matrix** (when the comparison is genuinely apples to apples)
Rows are capabilities, columns are vendors, plus a column for what the PRD proposes. Use a FigJam table, not shapes, because tables auto-grow row height and handle prose. Cells hold a short phrase, not a tick, because a tick hides the interesting differences.

**7. Patterns to steal** (usually)
Specific interaction or model ideas worth taking, each with which vendor does it and why it works. Distinct from findings: patterns are borrowable craft, findings are strategic consequences.

**8. Findings** (always)
Five to eight, ranked, numbered, most consequential first. Each is a claim, the evidence, and what it means for this PRD. This is the zone people photograph.

**9. Corrections** (always, even when empty)
Where the PRD is factually wrong about a competitor. Quote the PRD line, state what is actually true, source it, say what follows. If nothing was wrong, put a single card saying every competitor claim in the PRD was checked and held up, listing which claims those were. An absent zone reads as unchecked.

**10. Where we win** (usually)
Honest differentiation given everything above. Include where the competition is genuinely ahead. A zone that only lists strengths gets discounted entirely.

**11. Screens to design** (when the PRD implies UI)
The inventory of screens and states this feature needs, as a numbered list. This is the bridge from research into design work and is often the zone the design team uses most.

**12. Userflows** (when there is a process worth drawing)
Two or three flows as connected nodes: the happy path, the admin path, the failure path. See the connector guidance in `figjam-build.md` before drawing these, they are the most failure-prone thing on the board.

**13. Information architecture** (when the feature touches navigation)
Where each screen is homed, as a left-to-right tree. Worth building whenever two screens about the same thing might end up in unrelated parts of the nav, which is a bug that is invisible in a screen-by-screen review and obvious in a tree.

**14. Open questions** (always)
Phrased as decisions someone must make, not as topics. "Do included credits stack on a purchased tier or get absorbed by it? The PRD does not say, and the two readings differ by 1,000 credits." Name the likely owner where you can.

**15. Sources** (always)
Every URL, what it supported, and the date checked. Grouped by vendor. This zone is what makes the board re-checkable in six months, which is the difference between a research artefact and a snapshot of one person's opinion.

## Choosing zones

Zones 1, 2, 3, 4, 8, 9, 14, 15 are always present. That is the minimum honest study.

The rest depend on the PRD. A pricing PRD needs the feature matrix and screens to design. A pure market question needs neither. Ten to twelve zones is the typical landing point. Adding a zone you cannot fill properly is worse than omitting it, because an underfed zone tells the reader the research ran out of steam.
