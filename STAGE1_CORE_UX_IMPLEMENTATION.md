# Stage 1 — Core UX implementation check

This file is an internal implementation record and is not linked from the public website.

| # | Recommendation | Status | Implementation evidence |
|---|---|---|---|
| 1 | Simplify facilitator landing first screen | DONE | `advisors.html#advisor-top` now answers what the League is, facilitator role, student work, and time in four fast-fact cards. |
| 2 | Separate Why join from How to do it | DONE | `#why-join`, `#club-plan`, and `#lessons` are explicitly layered as Why join → Get started → Facilitate the League. |
| 3 | Reduce adult-role section | DONE | `#role` is now two concise lists: What you do / What to avoid. Family communication remains in recruitment/planning. |
| 4 | Replace Advisor with Coach/Facilitator | DONE | Public UI adopts **Facilitator** throughout. Legacy filenames/IDs remain unchanged for stable links. |
| 5 | Replace Lesson language | DONE | Public UI uses **Session** and **Facilitation Guide/Guide**. Legacy `lesson-*.html` filenames remain stable. |
| 6 | Keep Before the session / While you facilitate | DONE | All five facilitator guides retain the two-mode structure. |
| 7 | Plug-and-play guidance | DONE | Facilitator pages relabel embedded concepts as `1-minute explainer`, `Try saying`, examples, and watch-fors; page hero promises ready-to-use support. |
| 8 | Less text-heavy student experience | DONE | Existing one-screen guided flow retained; sticky progress and bottom navigation added; landing page uses visual chips and club banner. |
| 9 | ~8th-grade functional language | DONE | Student pages replace key advanced terms with plain-language equivalents (learning goal, what success looks like, best guess to test, etc.). |
| 10 | Do not label “student-friendly language” | DONE | Label removed from student pages and changed to `Try saying` in facilitator guides. |
| 11 | Persistent visual navigation | DONE | Sticky guided progress, persistent Back/Next bar, and Now / You are making / Next organizer on every student stage. |
| 12 | Remove Not Started | DONE | Journey uses Start here / Up next / Coming later / Complete; no `Not started` text remains. |
| 13 | Strong student hook immediately | DONE | Students hero leads with “Build something that could actually help your teacher or another student learn.” |
| 14 | Stronger club feel | DONE | Team/making/testing/sharing chips, club banner, visual team asset, and creation/recognition language added. |
| 15 | Keep early quick-build | DONE | `student-empathize.html` retains the two-minute rough-build challenge near the beginning. |
| 47 | Accessibility/cognitive-load pass | DONE (obvious issues) | One task per guided screen retained; sticky directions; keyboard focus styles; responsive controls; reduced-motion support; plain-language pass. Formal WCAG audit remains later as recommended. |
| 48 | Advanced organizers + artifacts | DONE | Each stage has persistent Now / You are making / Next organizer and artifact chip. |
| 49 | Help definitions sparingly | DONE | Difficult language was removed/rewritten first; one short facilitator definition is provided rather than a glossary-heavy interface. |
| 50 | Reduce amount shown at once | DONE | Guided one-screen flow retained, detailed content remains available only in the current screen/accordion/tool step. |
| 51 | Fix obvious accessibility issues now | DONE | Skip links on all pages, visible focus, reduced motion, alt text retained, responsive navigation; formal WCAG 2.1 AA review remains a later validation activity. |
| 52 | Club Plan finite/low-burden | DONE | “6 short steps · about 10 minutes,” browser save/return message, Step X of 6 retained, concise setup messaging. |
| 53 | Simplify five session cards | DONE | Cards now show only Empathize—Understand the learner; Define—Find the real problem; Ideate—Choose a way to help; Prototype—Build something small; Test + Share—Try it and improve it. |
| 54 | Keep research/admin out of core journey | DONE | Public pages contain no consent, compensation, IRB, research-study, or cohort-administration instructions. |
| 55 | Timeline-agnostic | DONE | Public HTML/JS contains no September/October implementation dates or cohort deadlines. |
| 56 | Do not call it a pilot | DONE | Public HTML/JS contains no `pilot` labeling. |
