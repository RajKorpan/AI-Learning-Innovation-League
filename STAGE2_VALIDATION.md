# Stage 2 Validation

Validation performed after the Empathize + hardest-thinking scaffold pass.

## Automated checks

- 22 HTML pages parsed successfully.
- No duplicate HTML IDs.
- No broken internal HTML links or anchors after accounting for query parameters.
- No missing local image assets.
- All local images include alt text.
- All JavaScript files pass `node --check` syntax validation.
- All six student stage pages load the shared open-response scaffold.
- Empathize contains the new Empathy Map form/output.
- Empathize places the real interview in Student Step 4 and removes the old separate "Learn the basics" screen.
- Question Detective and the compact question bank are present.
- Optional simulated interview practice uses structured select controls and is inside a collapsed optional panel.
- Define contains the built-in Task Breakdown Helper and no longer contains the old external AI Task Breakdown Guide.
- Define contains an Empathy Map carry-forward panel.
- Stage 1 save/download logic includes the Empathy Map.
- No old Task Breakdown external-AI button IDs remain in Stage 3 JavaScript.

## Open-response audit

Static textarea counts in the current HTML:
- Empathize: 8
- Define: 7
- Ideate: 11
- Prototype: 8
- Test: 0 static textareas (questions are rendered dynamically one at a time)
- Share: 0 static textareas (questions are rendered dynamically one at a time)

Static textareas receive the shared collapsed response scaffold unless the field already has a more specific question bank, sentence starter, or wizard helper. Dynamic tools retain their existing question-specific explanations, examples, and uncertainty/help controls.

## Browser limitation

A source-level and JavaScript validation pass was completed. Chromium headless rendering in this container did not return a DOM because the container browser process could not initialize its system-bus environment, so real-device/browser usability testing remains the appropriate next validation step for interaction timing and visual behavior.
