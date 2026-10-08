# Contact desk animation

The `/contact` hero replaces the orange note with Kayla at her desk, using the original contact illustration as the visual reference. Kayla approved this version for publication.

## Artwork and rendering

Original reference: https://images.squarespace-cdn.com/content/v1/605cdeab92df3f21fa5a6c81/f858eaab-39cf-4e33-bccd-499ac419d777/contact.png

Assets were made with the built-in imagegen tool, with actual transparent alpha:

- `public/images/kayla-contact-base-v1.png`: 1536 × 1024 transparent extraction, used for the loading fallback and reduced-motion still. Derived from the original reference, not a screenshot of the website.
- `public/images/kayla-contact-clean-v3.png`: 1536 × 1024 clean plate with the near forearm, hand, and cup removed. Only its keyboard area behind the typing fingers is composited onto the original illustration.

`components/contact-character.tsx` uses a 1056 × 976 canvas crop of the original transparent illustration. The sleeve, forearm, and cup are original pixels, held still. A small clip over the near hand redraws only the typing fingers over the clean keyboard area. There is no coffee reach. A small localized eyelid supplies an early blink. Earlier pose sheets were experiments and were removed from the project.

The toe tip deforms by at most six source pixels, tapering to zero before the heel. The heel, ankle, and shin do not move, and no circular cutout or background-colored patch is used. Typing changes finger contours with the palm anchored. The hand contour is an approximation of the reference.

## Timing

The typing loop lasts six seconds. Toes tap every 1.1 seconds throughout, including typing pauses. When site sound is on, their timing uses the music playback clock; the revised cadence is not locked to each beat.

| Time | Action |
| --- | --- |
| 0.03–0.15s | Blink |
| 0–1.8s | Type |
| 1.8–3s | Pause typing; toes continue |
| 3–4.8s | Type |
| 4.8–6s | Pause typing; toes continue |

Typing eases in and out over 180ms while the toes keep their independent rhythm. Animation pauses offscreen and in hidden tabs, then resumes. Both CSS and JavaScript honor `prefers-reduced-motion`; the high-resolution CSS still also works before hydration or if an image/canvas fails. The page stacks copy and illustration at 900px and below.

## Verification

- TypeScript, lint on changed components, whitespace checks, and the production build passed before publication. Repository-wide lint still reports existing issues in unrelated files.
- Desktop and 390px mobile layouts were inspected in the local browser; no horizontal overflow.
- Development-only `?contact-preview-ms=630` freezes a typing pose. It is disabled in production. Remove the parameter to see the normal loop.

## Built-in imagegen prompts

The transparent extraction and clean plate remain in the project. The retired coffee pose prompts below are kept as design history; their assets were removed from the project.

### Transparent extraction

Use case: background-extraction. Precisely remove the background of this original illustration, keeping the woman and complete desk scene pixel-faithful. Actual transparent alpha outside solid objects, including between table legs, under table, between chair and body. Keep all artwork fully opaque inside its outlines. Crisp clean cutout, ZERO glow, ZERO feathered aura, ZERO gradients, ZERO haze, ZERO floor shadows. Remove arrows, sparkles, dots. Do not change face, pose, objects, scale, framing or colors. Retain original muted orange laptop, tan skin, taupe dress, sage socks, brown desk and striped paper coffee cup. This is strictly a background removal task. Use the same 1536x1024 canvas and original object positions.

### Previous coffee poses (retired)

Use case: identity-preserve. Create an animation sprite sheet of the EXACT reference desk illustration. 3 columns x 3 rows, nine EQUAL square cells in a 1536x1536 transparent PNG, no labels or borders. Each cell repeats the ENTIRE same woman/desk/chair/laptop/plant composition at EXACT identical scale and pixel position, all feet and desk legs visible, small margin. Reference woman has dark purple hair, taupe dress, sage socks, orange laptop, striped paper coffee cup. Preserve exact face and linework. Only foreground arm nearest coffee and coffee cup move. Everything else MUST be motionless. Nine sequential keyframes in reading order: 1 original both hands typing cup on desk; 2 foreground fingers released from keyboard and hand moving toward cup with elbow fixed; 3 hand grips cup while cup remains resting on desk; 4 cup raised slightly above desk; 5 cup halfway raised toward face; 6 cup near mouth; 7 cup touching mouth for a sip, slight wrist tilt; 8 same sip with eye briefly closed; 9 cup touching mouth eye open. Foreground arm bends naturally at fixed elbow. Background hand stays on keyboard. When coffee lifts its original place on desk must be EMPTY (never duplicate cup). NO movement of desk/laptop/chair/plant/legs/body/shoulder, no shape changes, no floating arm disconnected from sleeve. Exact same registration in all 9 frames. Transparent alpha, remove beige backdrop, arrows, dots, sparkles and shadows. Full scene never cropped.

### Previous cup registration correction (retired)

Use case: precise-object-edit. Edit this exact 1254x1254 nine-frame 3x3 sprite sheet. Preserve every pixel outside TOP MIDDLE and TOP RIGHT foreground hand/cup region. All 418x418 cells fixed. Correct TOP MIDDLE cup: move cup UP exactly 10 pixels, so its rim and base height match TOP LEFT cup. The cup remains resting in IDENTICAL desktop position as top-left, with foreground fingers reaching toward its rim; attached arm remains natural. Correct TOP RIGHT cup: move cup and gripping hand DOWN exactly 10 pixels, so the cup is also resting at exactly TOP LEFT cup's desktop position and the hand grips it ready to lift. ALL other 7 frames unchanged, identical positions/colors/face/lines/scale. Keep original 1254x1254 dimensions and 418px grid; don't crop, regenerate, resize or rearrange sheet. No new objects, labels or backdrop. True transparent alpha.

### V3 clean plate

Use case: precise-object-edit. Animation clean plate. Edit this exact 1536x1024 transparent illustration. REMOVE ONLY the foreground bare forearm and hand that stretches from sleeve at image x1000 y400 to keyboard x700 y415, and REMOVE the coffee cup and its shadow at x985 y470. Reconstruct the small areas of taupe dress, brown desktop, and orange keyboard exposed beneath them with clean matching flat illustration. Leave the far arm and hand on keyboard intact. Keep the short sleeve ending at its original cuff. Woman will temporarily be missing just the near forearm/hand for overlay animation. All other pixels must stay identical: face, hair, body, sleeve outline, laptop, far arm, feet, chair, desk, plant, composition, colors, linework. Same canvas, same positions, no crop, no zoom, no restyling. True transparent background.

### V3 sixteen-pose gesture study

Create production animation keyframes in a 4x4 square sprite sheet, 16 equal cells, high resolution. Reference1 exact Kayla illustration. Reference2 intended coffee motion, but needs MORE intermediate poses. Every cell shows ONLY CLOSE-UP UPPER BODY from head to desk surface: woman, orange laptop keyboard at lower left, stationary brown desk edge along bottom and cup at lower right. NO chair legs or feet; zoom same crop in all16. Enough detail for fine fingers. Keep exact identical face, hair, head, torso position, desk and laptop in all cells. The only moving object is near arm+hand+coffee. Near shoulder pinned. CUP SITS AT FAR RIGHT of tabletop, near the elbow's horizontal coordinate, NOT near left hand or laptop. In frames1-7 cup location is absolutely identical to reference1. Hand leaves keyboard on LEFT and reaches RIGHT to this cup, shortening/bending forearm naturally, NEVER moving cup toward hand. 16 reading-order poses: 1 resting both hands keyboard; 2 fingers lift slightly; 3 hand moves a small distance right; 4 hand a quarter way toward cup; 5 halfway right; 6 threequarters right; 7 hand at cup; 8 gripping cup still on desk; 9 cup just lifted; 10 cup at low chest; 11 mid chest; 12 upper chest; 13 below chin; 14 near mouth; 15 rim touching lips; 16 very small sip with cup tilted. Same fixed arm attachment, same cup size, anatomically natural bending at elbow. Eye open unchanged all16. Exact same crop registration all cells. Actual transparent alpha around character/props. No background boxes, labels, borders, arrows. Flat precise original colors and outlines. Render close-up large crisp artwork, not a thumbnail of entire scene.
