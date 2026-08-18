# Stage 1 — Reliability and Advisor/Student Alignment

This revision focuses on fixing existing interactions and making the five Advisor lessons point cleanly into the current six Student stages before the next structural redesign.

## Interaction repairs

- Restored the Empathize interaction script so the two-minute build challenge, Question Detective, visual Interview Coach choices, and weak-question activity work from the page.
- Made the three Prototype build-path cards directly selectable, keyboard accessible, and visibly selected.
- Repaired the Resource Inventor follow-up layout for bringing AI ideas back to the site and reflecting after trying an activity.
- Audited all six Student stages for interactive roots, script wiring, broken internal links, duplicate IDs, missing images, and unmatched button IDs.
- Removed the separate research-claim tracking tool from the Define experience.

## Advisor lesson behavior

- Each lesson defaults to **Before the session** the first time that specific lesson is opened.
- Lesson view state is stored separately for each lesson, so opening one lesson in Student meeting mode does not force a different lesson to open there on first visit.
- Previous Activity is hidden on the first activity.
- Next Activity is hidden on the final activity.
- Two-session labels are standardized as **Session 1 — 45 minutes** and **Session 2 — 45 minutes**.

## Advisor ↔ Student alignment

- Every Advisor lesson activity has one explicit Student Stage destination.
- Link labels are generated from the actual current student step number/title so the wording and destination match.
- Lesson 1 begins with the student's quick-build activity rather than jumping several steps into Empathize.
- Lesson 3 includes the student's short strategy experience between Strategy Explorer and Resource Inventor.
- The expanded Prototype lesson now follows the current student order: plan/build → learning-design check → Prompt Builder when relevant → advisor checkpoint.
- Lesson 5 explicitly spans both the Student Test and Share stages and links to both at the final artifact check.
- Each lesson's final artifact list has been aligned with the corresponding Student-stage save/checkpoint outputs.

## Terminology cleanup

- Specialized client terminology was replaced with plain language about interviewing a teacher. The advisor can be the teacher students interview.
- The removed research-claim tool no longer appears in public pages or the packaged documentation.

## Validation

- 17 HTML pages checked.
- 0 broken internal file links or section anchors.
- 0 duplicate IDs.
- 0 missing local images or missing image alt text.
- Core interactive roots present on all six Student stages.
- Every lesson activity has exactly one explicit Student Stage link.
- All JavaScript files pass `node --check` syntax validation.
- A static interaction-wiring audit found no unmatched ID-based buttons on the six Student stages.

The remaining changes that intentionally belong to the next restructuring stage—such as moving optional AI interview practice before the real interview, folding note synthesis into the interview flow, integrating the lightest-test choice into the testing wizard, conditional Prompt Builder display, and embedding support/extensions directly within individual lesson activities—are not part of this reliability pass.
