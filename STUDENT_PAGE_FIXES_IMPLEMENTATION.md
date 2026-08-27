# Student page fixes implementation

This pass was completed before the facilitator synchronization pass.

## Stage 1 - Empathize

- Removed the click-through step wizard. The entire stage is now a vertically readable workspace.
- Replaced the on-screen "Give me a build challenge" generator and four response boxes with a two-minute build done in conversation with a facilitator or partner. The reflection questions are discussion prompts, not fields.
- Interview planning now uses structured choices:
  - who the student is learning from;
  - four common STEM situation options plus Other;
  - about four starter questions from a question bank;
  - one optional custom question.
- Moved optional AI interview practice before the real interview.
- Added a STEM-situation dropdown to the AI practice prompt, including an option to use the situation from the student's interview plan.
- Added a dynamic Download notes template action. It creates a printable HTML notes sheet with one notes area for every question selected in the interview plan.
- Removed the online interview-notes textarea.
- Removed the six online Empathy Map textareas.
- Added a downloadable Empathy Map PDF for individual work.
- Put the Empathy Map discussion/check on the same page directly after the individual worksheet activity.
- Removed the separate Finish Empathize step. Completion is a compact checkpoint at the bottom of the same page.

## Changes carried across the other stages

### Define
- Replaced the multi-step online task-decomposition form with a downloadable Task Map worksheet.
- Kept one structured choice for the type of first difficulty and only two short carry-forward fields: focused learning challenge and observable success sign.
- Put the facilitator/partner discussion directly below the focused challenge.

### Ideate
- Kept learning-strategy selection interactive.
- Replaced five online idea textareas with a downloadable Idea Sheet / sticky-note activity.
- AI is used after students generate their own ideas; the website builds the variety prompt from saved challenge, selected strategy, and selected resources.
- Students type only the preferred direction and an optional backup.

### Prototype
- Replaced most prompt-writing fields with structured choices for build path, learner action, AI role, and boundaries.
- Added a downloadable Build Plan.
- The website generates one editable/copyable prompt or build brief.
- Building happens outside the form; students only confirm that a prototype exists and save one first test question.
- The learning-design check is discussed as a checklist rather than seven separate answer screens.

### Test
- Added a downloadable Test Sheet designed for handwritten observation.
- Test planning uses structured choices for the test question and tester.
- Removed the observation/interpretation web textareas.
- Students type only one evidence-linked revision and an optional next-test question.
- A second test is encouraged but not forced.

### Share
- Replaced the long Story Builder with a downloadable two-page Share-out Planner.
- Story focus and thing-to-show decisions remain selectable on the website.
- Students type only an evidence-sized claim and the remaining uncertainty/next step.
- Rehearsal happens with a partner or facilitator.

## Open-response burden

Raw textarea + text-input counts on the six stage pages changed from:

- Empathize: 13 -> 2
- Define: 3 -> 3 (only two normal carry-forward fields; the third is the conditional Other field)
- Ideate: 12 -> 2
- Prototype: 7 -> 2
- Test: 8 -> 3 (one is the conditional Other test-question field)
- Share: 4 -> 2

Total: 47 -> 14, with several of the remaining fields optional/conditional.

## Downloadable worksheets added

- `assets/templates/empathy-map-template.pdf`
- `assets/templates/task-map-template.pdf`
- `assets/templates/idea-sheet-template.pdf`
- `assets/templates/build-plan-template.pdf`
- `assets/templates/test-sheet-template.pdf`
- `assets/templates/share-out-planner-template.pdf`

The interview-notes worksheet is generated dynamically in the browser so it can include the exact questions the student selected.
