# About character animation

The About hero uses transparent artwork directly on the page, with separate CSS spark/dot accents and a clay italic headline finish. The image-generation skill supplied the cutout and motion artwork through the built-in image tool (not the CLI). The desktop illustration is capped at 26rem and takes 88% of its grid column; mobile uses a centered composition capped at 24rem and 80% of the content width.

## Assets

- `public/images/kayla-about-cutout-v1.png`: transparent reference cutout, 1024 × 1536. Retained for future revisions; not downloaded by the page.
- `public/images/kayla-about-idle-v1.png`: first motion sheet, retained as the edit reference.
- `public/images/kayla-about-idle-v2.png`: active nine-pose transparent sheet with corrected fingers, 1254 × 1254.
- `public/images/kayla-about.png`: original preserved.

## Rendering and behavior

`components/about-character.tsx` draws the opening sheet region [100, 0, 300, 418] as the permanent foundation. Generated column spacing is 384 pixels and row spacing is 418 pixels; do not infer the column offsets from the sheet width. Only small eye/hand patches are composited from frames 1, 2, 4, 5 (zero-based). The hand patches have explicit registration offsets and two-pixel edge feathering to match the fixed wrist and dress/podium seam. There is no body scale change, crossfade between full poses, or floating motion. The larger weight-shift idea was omitted to keep contact points and silhouette steady.

After the artwork loads and enters view, the sequence starts after 150ms: the first visible blink frame appears at about 240ms and the fingers begin moving at about 850ms. Blink and two gentle finger gestures take 1.93 seconds, followed by a short 1.2–1.8 second rest. The sequence repeats automatically without playback controls, as requested. Rendering uses timers only at pose changes, not a continuous animation loop. The animation resets to the resting pose when offscreen or the tab is hidden, and restarts after the same brief delay when visible. Reduced motion always shows the matching CSS opening pose. CSS also supplies the no-JavaScript/canvas fallback. The decorative star uses the same `--ochre` yellow as the home hero.

## Built-in generation prompts

### Transparent cutout

Use case: background-extraction / identity-preserve. Edit target: attached About-page illustration. Create a clean transparent cutout of the EXACT same woman, tall brown rectangular podium, and orange laptop. Remove all beige background, decorative arrows, dots, sparkles, and floor shadow. Preserve exact dark purple fine outlines, tan skin, taupe dress, sage socks, crossed ankles, face and hair, podium geometry and laptop. One small pose adjustment only: the forearm resting on the podium should end with wrist and fingers resting naturally on its top-right edge, fingertips curled gently onto the edge, instead of hanging far down. Her other hand stays on her hip. Tall tightly composed full-body illustration, comfortably fits entire podium and feet with 5% transparent margin. Same flat editorial artwork, no new styling, no text, no scenery, no shadow, no gradients. Actual transparent alpha background.

### Motion sheet

Use case: identity-preserve animation sprite sheet. Reference: the attached transparent woman/podium/laptop cutout, exact character and palette. Produce a 3 columns x 3 rows sheet of NINE equally sized SQUARE cells, overall 1536x1536, actual transparent alpha background. Each cell contains the identical FULL composition of woman, podium and laptop, centered at identical scale and position, entire head, podium bottom and socks inside each cell with 5% transparent margin. Tall composition within square cells. LOCK the podium, laptop, feet, legs, torso, head, hair, supporting elbow, and other hand on hip in every frame. Animate ONLY eyelid and fingers of the hand resting over the podium's upper right corner. No whole body motion. Sequence reading order: 1 neutral hand relaxed eyes open; 2 eyelid half down same hand; 3 eyelid closed same hand; 4 eyes open same hand; 5 resting hand's index and middle fingertips slightly uncurl/lift off edge, wrist fixed; 6 fingertips lift a little further away from edge, wrist fixed; 7 fingertips halfway curl back toward edge; 8 fingertips gently contact edge like a quiet tap; 9 original neutral pose identical to frame 1. This is tiny relaxed finger motion, no arm lifting, no hand relocation. All cells share EXACT identical face/head size, podium corners and foot baseline. Preserve fine dark purple outlines, tan skin, taupe dress, sage socks, orange laptop, brown podium. Flat colors same as reference. No borders, labels, grid, text, decorations, backdrop, floor shadows or glow. Actual transparent gutters and background essential.


### Finger correction (v2)

Use case: precise-object-edit. Edit target is the attached nine-frame transparent sprite sheet. Correct ONLY the resting hand on the podium in the MIDDLE ROW CENTER and MIDDLE ROW RIGHT cells. Those two hands look unnatural, with splayed extra-looking fingers. Replace them with a clean anatomically coherent hand matching the top-left original resting hand: four fingers grouped together in a relaxed soft curl, thumb tucked naturally behind, exact same wrist and knuckles. Middle center: only the index fingertip uncurls by a very small amount, about 2 pixels at this sheet's current size. Middle right: index fingertip only extends a further 1-2 pixels, while the other fingers stay gently curled in their original positions. Tiny finger tap, NOT a spreading hand, claw, reach or wave. Keep the palm, back of hand, wrist, forearm position, and attachment unchanged from the top-left reference pose. Preserve every other pixel of the sheet: face/eye poses, hair, body, podium, laptop, feet, transparent background, exact grid spacing and original 1254x1254 dimensions. DO NOT move, resize or redraw the figures, podium or dress; change ONLY those two small hands. No labels, borders or background. Genuine transparent alpha.
