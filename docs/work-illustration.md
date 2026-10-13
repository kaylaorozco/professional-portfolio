# Work illustration

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
