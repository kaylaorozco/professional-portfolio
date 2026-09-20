# Hero character animation — local prototype

Uses the original seated illustration, followed by generated closing, standing,
and walking poses. The current motion is a frame-by-frame prototype, not a smooth
rigged character. Pose consistency and the transition from the original illustration
should be reviewed before publication.

The automatic sequence starts after 2.5 seconds in view, once per page load.
There are no playback controls or automatic loops; refresh starts it again.
Six extra hand-reach and laptop-closing poses play over two seconds, followed by
1.4 seconds standing and 4.4 seconds walking. The rise has eight poses;
the walk has twelve poses advancing every 90ms, maintaining a relaxed gait.
Each frame renders at full opacity, with no crossfades or ghosted overlapping poses.
Frames align to the dark crown of the head rather than the changing silhouette
width; the rise follows a continuous head-position path. The generated poses are still a prototype
and can have small drawing differences; they are not a rigged animation.
All poses share a crown-to-chin scale, with a smaller seated opening on mobile
to reserve the standing height. No per-pose viewport fitting is applied.
Reduced-motion visitors retain the static illustration. Failed sprite loads
also leave the static illustration visible. Playback pauses out of view or in
a hidden tab and resumes when visible again.

Generated with the built-in image-generation tool, using
`public/images/kayla-hero-v2.png` as the character/style reference.
Selected assets: `public/images/kayla-rise-sprites-v2.png` and
`public/images/kayla-walk-sprites-v2.png`.
Additional closing asset: `public/images/kayla-close-sprites-v1.png`.

## Final generation prompt

Expanded walk cycle (built-in image-generation tool):

Create a CLEAN animation sprite sheet, 4 columns x 3 rows of TWELVE EQUAL SQUARE CELLS, 1536x1152, transparent alpha background. Reference shows exact character. Use ONLY the upright walking version from reference: tan skin, long dark purple hair, taupe short-sleeved calf length dress, sage socks, closed orange laptop under her left arm. Side view facing RIGHT. This is ONE smooth natural slow WALK CYCLE of 12 consecutive equally spaced poses in place, NOT running. Fixed camera, body height, head size, center of hips and foot ground baseline in every cell. Full body in each cell fits with 12% clear transparent margins. Smooth 12-frame gait: 1 left heel forward contact/right toe behind, 2 weight lowers onto left foot, 3 trailing right foot leaves ground, 4 right knee passes supporting left leg, 5 right foot swings ahead, 6 right leg extends toward heel contact, 7 right heel contact/left toe behind, 8 weight lowers onto right foot, 9 trailing left foot leaves ground, 10 left knee passes supporting right leg, 11 left foot swings ahead, 12 left leg extends before returning to frame1. Every frame visibly DIFFERENT and adjacent frames only SMALL changes. One foot supports ground at all times, knees never high, modest stride. Right free arm swings naturally opposite legs, laptop fixed tucked under left arm. Dress folds and hair move subtly. Preserve exact reference face and flat editorial illustration style with fine dark purple outlines. NO text/numbers/labels/borders/grid/checkerboard/shadows. No seated/crouching poses. No giant character or overlap between cells. Same dimensions and proportions across all12. Transparent background essential.

Expanded stand-up sequence (built-in image-generation tool):

Animation sprite sheet, 4 equal columns x 2 equal rows, eight equally sized square cells, transparent alpha, clear gutters. Reference 1 is initial reclining woman, reference2 provides SAME woman standing. Draw EIGHT chronological in-between frames of her getting up from the floor holding her closed orange laptop. Character consistent dark purple long hair, tan skin, taupe short-sleeve midi dress, sage socks, purple outlines. Fixed camera, constant head size and limb lengths ALL8, same floor baseline in every cell, full character fits with transparent margins. Standing height 80% cell so seated poses occupy only about40% of cell height, DO NOT enlarge seated figures to fill cells. Sequence left to right top row then bottom: 1 reclined on sage cushion, laptop now closed on lap, right leg extended; 2 torso tilts forward slightly and legs bend; 3 sitting upright, both knees drawing closer, closed laptop hugged; 4 right foot planted, left leg folds underneath in low crouch; 5 both feet underneath, crouch leaning forward; 6 hips raised halfway standing knees still bent torso leaned forward; 7 nearly standing knees slightly bent straightening torso; 8 fully upright facing right closed laptop tucked under left arm. Adjacent frames SMALL plausible movement increments. Prioritize anatomy continuity and consistent head dimensions. Minimal flat illustrated shapes, exact reference style and identity. No text, numbers, grids, scenery or shadows. Actual transparent background.

Closing in-betweens (built-in image-generation tool):

Animation in-between sprite sheet, genuine transparent alpha background. Use attached illustration as EXACT character/style/pose reference. 3 columns x 2 rows, SIX equally sized landscape cells, each cell aspect 2:1, whole sheet aspect 3:1. Clear transparent gutters, no cell overlap, no text/numbers/grid/borders/shadows. ALL six frames show SAME woman at SAME size in SAME reclining position with same sage cushion and legs to the right, taupe midi dress, purple hair/outlines, orange laptop. Lock head size, face, body, camera and ground baseline exactly across frames. Start just like reference with hands typing, open laptop upright. Frame 1: one hand just lifting off keys. Frame 2: hand raised slightly towards top edge screen. Frame 3: hand touches top of open laptop. Frame 4: screen lowered partway about 65 degrees above keyboard. Frame 5: screen lowered to 30 degrees. Frame 6: screen fully closed flat on her lap, hand resting on lid. Only hands/forearms and laptop screen move gradually; woman stays reclining in exactly same place across all six. Clean fluid subtle successive poses for a website animation. Each drawing fits entirely inside own cell with 8 percent transparent margin. Absolutely no standing poses, no sitting upright, no camera changes. Preserve illustration look of reference.

Original standing/walking sheet:

Create one animation sprite sheet of the reference woman. Use a STRICT 3 column x 4 row layout of TWELVE EQUAL SQUARE CELLS with TRANSPARENT background. Overall image 1536 wide x 2048 high if possible. Each cell must have at least 12% clear transparent margin on EVERY side. No figure may touch another cell. Character maximum width 76% cell, standing maximum height 76% cell. One character in EACH cell. Reference establishes tan skin, dark purple long hair and outlines, taupe short sleeved calf-length dress, sage socks, orange laptop. Flat clean illustration EXACTLY reference style. All frames same anatomical scale: standing height 76% cell, reclining figure therefore only 43% cell tall. All feet ground baseline 88% cell height. NO WORDS, LABELS, BORDERS, GRID, SHADOW, checkerboard. Reading order left to right top to bottom: 1 reclining on cushion with open laptop, 2 seated closing laptop, 3 seated holding closed laptop with legs pulled inward, 4 crouching ready to stand closed laptop held close, 5 half standing leaning forward, 6 fully standing side view facing RIGHT with closed laptop tucked under arm; 7 walk right left foot forward wide stride, 8 walk right legs nearly together passing position right knee raised, 9 walk right right foot forward wide stride, 10 walk right legs nearly together passing position left knee raised, 11 walk right left foot forward wide stride (same pose as7), 12 walk right passing position right knee raised (same pose as8). Walk frames must clearly ALTERNATE extended strides and narrow passing poses, not identical wide-legged poses. Stationary in-place walk, centered in each cell. Keep face/head/body proportions consistent across all frames. Do not enlarge seated frames to fill cell. PRIORITY perfectly isolated frames, generous margins, actual transparent alpha.
