# Building the board with the Figma Plugin API

Load `figma:figma-use` and `figma:figma-use-figjam` before your first `use_figma` call, and `figma:figma-create-new-file` before `create_new_file`. These are hard prerequisites. Skipping them produces failures whose error messages point at the wrong place.

## Build order

Build **one zone per `use_figma` call**, and verify before moving on. A twelve-zone monolith that throws on zone nine leaves you with a half-built board, no clean re-run, and manual cleanup. Small calls also mean a gotcha costs you one zone instead of the afternoon.

Sequence:
1. `create_new_file` with `editorType: 'figjam'`. Keep the file key.
2. One call per zone: create the section, fill it, resize it, record its height.
3. A final call for anything cross-zone (a legend, a nav aid).
4. Read the board back with `get_figjam` and check the zones are where you think they are.

Track `y` across calls yourself. The plugin context does not persist between calls, so pass the running `y` into each script as a literal.

## Helpers worth pasting into every script

```js
// Fonts must be loaded before any text is created or edited.
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

const hx = h => ({
  r: parseInt(h.slice(1, 3), 16) / 255,
  g: parseInt(h.slice(3, 5), 16) / 255,
  b: parseInt(h.slice(5, 7), 16) / 255
});
const fill = h => [{ type: 'SOLID', color: hx(h) }];

// Absolutely positioned text. `w` makes it wrap at a fixed width.
// size must be a NUMBER. Passing '16' throws from inside this helper
// with a stack that points here, not at your call site.
function T(parent, s, x, y, size, colour, style, w) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: style || 'Regular' };
  t.fontSize = size;
  t.characters = s;
  t.fills = fill(colour);
  t.textAutoResize = w ? 'HEIGHT' : 'WIDTH_AND_HEIGHT';
  if (w) t.resize(w, t.height);
  t.x = x; t.y = y;
  parent.appendChild(t);
  return t;
}

// A zone. Name is deliberately blank, see board-spec.md.
function zone(y, w, h) {
  const s = figma.createSection();
  s.name = '';
  s.x = 0; s.y = y;
  s.resizeWithoutConstraints(w, h);
  s.fills = fill('#FFFFFF');
  return s;
}

// A card: a rectangle for fill and stroke, with real TEXT laid on top.
// Do not put the copy inside a shape's own text, see the gotchas.
function card(parent, x, y, w, h, bg, stroke) {
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(w, h);
  r.cornerRadius = 12;
  r.fills = fill(bg);
  if (stroke) { r.strokes = fill(stroke); r.strokeWeight = 1; }
  parent.appendChild(r);
  return r;
}
```

## Gotchas

Each of these has cost a failed run or a repair. They are cheap to read and expensive to rediscover.

### Text and shapes

- **`createShapeWithText` clips multi-line text even when the box is obviously large enough.** Three lines at 16px in a 2260x132 rounded rectangle still ellipsised at line two. Whenever copy runs past one short line, use the shape for fill and stroke only, empty its text, and lay real `TEXT` nodes on top positioned from the shape's own x and y. This is the single most common cause of a board that looks broken.
- Rounded rectangles at 330x170 clip at five lines of 14px. 330x215 at 13px holds five lines.
- Diamonds need roughly 360x200 for two short lines. Keep decision text under about 30 characters or use a rectangle.
- **`fontSize` must be a number.** `'14'` throws `Expected number, received string` from inside your text helper, with a stack pointing at the helper rather than the call that passed the string.

### Stickies

- Wide stickies are exactly **416x240** and auto-grow taller with content. Their final height is unknown until the text is in.
- Lay stickies out in **two passes**: create them all with their text, then read `sticky.height` and position them. Positioning during creation guarantees overlap, because you are positioning against a height that changes a moment later.

### Tables

- FigJam **tables handle long prose well** and auto-grow row height. For any comparison matrix they are far more robust than a grid of shapes, which will clip.
- Column width is set with `table.resizeColumn(i, w)` only. `width` and `height` on the table are read-only, and assigning to them fails silently or throws depending on context.
- Reach cells with `table.cellAt(row, col).text.characters = '...'`.

### Connectors, the most failure-prone part of the board

- **Floating endpoints (`{ position: { x, y } }`) are absolute page coordinates, not section-local**, even after the connector has been appended into a section. Move the section and the endpoints stay behind. If you must use floating endpoints, compute them as `section.x + localX, section.y + localY`, and re-anchor after any reflow. Prefer node endpoints (`{ endpointNodeId, magnet }`) which move with their nodes.
- **Section children x and y are section-local.** Text and shapes reflow correctly when a section moves. Connectors are the only exception, which is why they surprise people.
- Connector labels land on the midpoint and **print on top of whatever the line crosses** when the run is short or vertical. Either shorten the label, clear it and explain the line in a legend, or lengthen the run.
- A loop-back connector routes straight through whatever sits in its row. Force `magnet: 'BOTTOM'` on both ends so it dips underneath.
- Elbowed connectors between adjacent columns need roughly **50px of empty lane** between them, or they route back across the shapes.

### Finding nodes again

- **`createdNodeIds` from a build script interleaves shapes, their text children, and connectors.** Do not index back into that array to find "the third shape", because one of them will be a connector and `resize()` will throw. Find nodes properly:

```js
const shapes = sec.findAll(n => n.type === 'SHAPE_WITH_TEXT');
const target = shapes.find(s => s.text.characters.startsWith('Verified'));
```

### Images

- `figma.createImageAsync(url)` fetches and returns an image you can use as a rectangle fill. It fails on hosts that block hotlinking, so download the bytes first when in doubt and upload them with `upload_assets`.
- Size the rectangle to the image's real aspect ratio (`img.getSizeAsync()`), then set `scaleMode: 'FIT'`. `'FILL'` silently crops screenshots, usually removing the part that made the screenshot worth including.

## Verifying

Before you hand the board over, call `get_figjam` and check:
- Every section is at `x = 0` and the gaps are the intended 200.
- No section overlaps the next, which happens whenever a zone grew after you computed the following `y`.
- No text is ellipsised.
- Connector endpoints still sit on their nodes.

Then take a screenshot with `get_screenshot` and actually look at it zoomed out. Reading the API output tells you the board is structurally correct. Looking at it tells you whether it is legible, which is a different question and the one the reviewer will be answering.
