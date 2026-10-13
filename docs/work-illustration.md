# Work illustration

## Current motion: simple blink

The user paused the finger-tap experiment and rejected the head nod because it stretched the artwork. Work now uses only an occasional 240ms blink, with 5.4–6.8 seconds of rest between blinks. The head, face outline, body and selected new hand remain completely still. There is no music sync; the sound provider, Home, About and Chat are unchanged. The original clean v1 illustration is retained, and only the selected hand detail is composited from these built-in image-edit outputs:

- `public/images/kayla-work-seated-desktop-v2.png` (`exec-57fc8f26-4660-4eed-9d03-c6f8a5182256.png`)
- `public/images/kayla-work-seated-mobile-v2.png` (`exec-9dcdf834-e9dd-4c69-9593-6ddebd3d2f1e.png`)

These v2 images are hand-source plates, not full replacements: their outside alpha contains generation artifacts. A cached, feathered mask follows the palm interior, fully includes the selected fingers, and softly fades back to the original skin before the wrist. This replaces the earlier rectangular crop, which cut through the upper hand outline and exposed a skin-color seam. The mask avoids the edited plate's offset outer wrist edge, and `source-atop` preserves the original silhouette. The v1 face and body remain the source artwork.

Only the dot eye is animated: a tiny matching skin patch covers it while the original eye closes smoothly into a small lid and reopens. No head deformation or hand-movement frames are active. A project interaction, reduced motion, a hidden tab, or an offscreen character holds the original open-eye pose. Sound can be on or off.

### Selected still-hand source prompt

Use case: precise-object-edit. Correct the raised hand ONLY. The hand currently has a hooked thumb on its image-RIGHT lower edge, making it read as a left hand attached to her right arm. Redraw this as a clearly anatomically RIGHT hand, palm angled slightly toward the viewer, with the thumb rooted on the IMAGE-LEFT edge of the palm and gently folded inward. Remove the erroneous hooked thumb on the image-right bottom. The INDEX finger is the uppermost digit, extended gently toward her chin. Below it, the middle, ring and little fingers are three softly curled fingers on the image-right side of the palm; thumb is separate on the image-left side. Use an anatomically natural relaxed right wrist connecting to the existing raised right forearm. Keep forearm and elbow fixed. Simple cartoon hand, five digits total, no extra details or fingernails. Change nothing outside the hand and wrist: preserve face, rounded chin, tiny dot eye, smile, hair, body, other arm, dress, seated legs, sage socks, stool and transparent background exactly. Same full 1024x1536 image composition and original line style. Do not mirror the figure or alter facial features.

## Chin-tapping idle animation

Status: paused at the user's request, superseded by the simple blink above. The user identified ambiguous handedness and unwanted middle-finger movement. Intermediate tap frames were not adopted; their source outputs remain in the generated-images directory. The original approved seated assets remain unchanged.

The approved seated artwork remains the base. A feathered fingertip-only mask composites a second frame, leaving the rest of the original illustration untouched. Two gentle taps occur during each ten-second idle cycle, with a long rest. Opening an overview, playing or dragging a record, leaving the viewport, or hiding the browser tab returns to the still pose. Reduced-motion preferences disable the animation.

Versioned assets created with the built-in image-generation tool:

- `public/images/kayla-work-chin-tap-desktop-v1.png` (original: `exec-965670ea-fba6-4321-9892-36aa7542270e.png`)
- `public/images/kayla-work-chin-tap-mobile-v1.png` (original: `exec-3e2f1d44-f651-41c7-ad74-de45b88a4873.png`)

### Finger-frame editing prompt (both variants)

Use case: precise-object-edit. Create ONE very subtle animation frame from this exact illustration. Change ONLY the raised hand's index finger beside her chin: lift its fingertip upward by about 12 pixels so it lightly touches the underside of her chin, bending gently at the knuckle. Keep the palm, wrist, other fingers, forearm and elbow absolutely fixed in place. This is a tiny thoughtful finger tap, not a different gesture. Everything else must remain pixel-aligned with the reference: same exact face, dot eye, rounded chin, smile, head, hair, dress, body, legs, socks, stool, colors, outlines, scale, positioning and 1024x1536 canvas. Do not redraw or improve the face. No movement of head or body. Preserve transparent alpha background. Return the entire original image with only that one fingertip adjusted, not a crop, not multiple frames, no added details or motion lines.

## Current seated assets

- `public/images/kayla-work-seated-desktop-v1.png`
- `public/images/kayla-work-seated-mobile-v1.png`

Both are 1024 × 1536 transparent PNGs made with the built-in image-generation tool, using the original Home illustration only as a reference. Home artwork is unchanged. The mobile version inclines her head toward the records. Full seated figures are layered behind the tabletop so the lower legs and flat sage socks remain visible below it.

Original generated outputs are retained in the Codex generated-images directory: desktop `exec-7fdad075-e668-4b05-a6af-911eb190b012.png`; mobile `exec-cc5b1726-03f1-487e-8285-416bbd50ef40.png`.

### Final face correction prompt (both variants)

Use case: identity-preserve. Image 1 is the edit target, a full body seated Kayla. Image 2 is the ORIGINAL character identity reference. Correct ONLY the face in image 1 to match the very simple, soft rounded cartoon face of image 2. The current face is too sculpted, pointed and angular. Give her the same gently rounded cheek and chin contour as image 2, tiny dot eye, single short eyebrow and tiny curved smile. No defined jawline, no cheekbone, no angular chin, no eyelids or eyelashes, no facial shading or extra details. Keep her original warm friendly expression. Keep the head's existing tilt and gaze direction from image 1. Preserve EVERYTHING ELSE in image 1 exactly: hair silhouette, chin-supporting hand position, arms, body, taupe dress, seated legs, stool, flat soft sage socks with no heels, canvas dimensions, positioning and scale. Match original flat outline illustration. Genuine transparent background outside character and stool, no glow or shadows.

### Flat-sock correction prompt (both variants)

Use case: precise-object-edit. Edit ONLY the footwear at the bottom of this full-body seated illustration. Replace both sage green heeled boots with soft, plain sage green SOCKS covering her feet and ankles. Both feet lie flat at a natural relaxed seated angle. No heel block, no raised heel, no shoe sole, no boot structure, no heel gap, no elevated arch. The socks have a simple rounded toe and a smooth flat underside following the foot, with only minimal curved seam lines matching the illustration style. Preserve the exact rest of the image: face and gaze, hair, thoughtful chin-hand pose, every hand, arms, dress, seated legs, stool, colors, scale, placement, canvas dimensions and transparency. Keep both entire socked feet visible. Genuine transparent alpha outside the character and stool. Do not add background, glow, props, shadows or text.

## Earlier upper-body study (retained, no longer displayed)

Asset: `public/images/kayla-work-thinking-v1.png` (1024 × 1536, transparent PNG).
Created with the built-in image-generation tool. Existing Home and About artwork is unchanged.

References: `kayla-hero-v2.png` for character identity and drawing style; `kayla-about-cutout-v1.png` for clothing and character continuity.

## Generation prompt

Use case: illustration-story. Asset type: high-resolution transparent character cutout for an existing cream-colored lo-fi portfolio website. Input image 1 is the primary CHARACTER IDENTITY and DRAWING STYLE reference. Input image 2 is supporting clothing and character reference only. Generate ONE new pose of the same illustrated woman, Kayla. Preserve her warm tan skin, long dark aubergine hair with a sweeping side part, simple rounded face, tiny dark dot eyes, gentle small curved smile, muted taupe short-sleeved dress, and clean thin aubergine outlines. Match the original flat editorial cartoon exactly in level of detail; very restrained soft shading, no realistic rendering, no added facial detail. Pose: behind an implied waist-high table, body in a relaxed three-quarter view turned toward the LEFT of the image, head inclined slightly DOWN AND LEFT looking at records that will be placed separately in the website. She is quietly considering which record to choose. One bent arm rests its elbow at the implied tabletop level, with knuckles lightly supporting her chin and one index finger near the chin. Her other forearm rests naturally across the same implied tabletop with a relaxed visible hand. Both elbows/forearms are at a consistent horizontal level. Three-quarter face, not strict side-profile, friendly attentive expression with eyes open. Composition: a single isolated character, portrait canvas, head through hips visible, top of hair and both arms fully within frame, lower dress extends a little below the elbow/tabletop level to allow website masking. Character occupies most of the canvas, modest transparent margins. Deliver sharp high-resolution edges suitable for retina web display. Genuine transparent background throughout, including between arms and body. Do not draw the table, chair, laptop, vinyl records, props, scenery, cast shadow, glow, text, watermark, border, or checkerboard. Only the woman. Preserve original character identity and original illustration style.

## Final cleanup prompt

Use case: background-extraction. Edit this character cutout. Keep the woman's exact pose, silhouette, face, hairstyle, colors, clothing, outlines and all interior artwork unchanged. Remove ALL diffuse dark, purple, tan and white glow/halo/shadow surrounding the silhouette. Every pixel outside the crisp aubergine outline must be fully transparent alpha zero, including all empty space above the head, at the canvas edges, below the dress and in openings between arm and torso. No replacement background color or checkerboard. Do not erase any hair or change any part of the character. Deliver a clean, genuinely transparent, sharp-edged PNG cutout for compositing on a light cream website.
