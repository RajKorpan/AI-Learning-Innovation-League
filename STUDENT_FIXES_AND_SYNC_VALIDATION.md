# Student fixes + facilitator synchronization validation

## Structural validation

- 22 public HTML pages checked.
- Internal file links and anchors validated using URL parsing.
- Duplicate IDs checked.
- Local image references checked.
- Image alt attributes checked.
- Facilitators top navigation verified as a direct link to `advisors.html` on public pages.
- All JavaScript files pass `node --check`.
- Public HTML scan found no pilot/date/teacher-client/Not Started language.

## Student-page validation

- No student stage page uses the old guided-flow wizard.
- No student stage page contains the old Back / Continue micro-step navigation.
- Every student stage retains the quiet bottom six-stage navigation.
- Every student stage retains the persistent Need help? affordance.
- Every student stage contains one completion checkpoint rather than a separate sequence of finish screens.
- Stage 1 AI practice appears before the real interview.
- Stage 1 has four standard STEM-situation choices plus Other.
- Stage 1 includes the dynamic interview-notes template action and downloadable Empathy Map.
- The downloadable Task Map, Idea Sheet, Build Plan, Test Sheet, and Share-out Planner are present.

### Open-response counts after revision

- Empathize: 0 textareas + 2 text inputs
- Define: 0 textareas + 3 text inputs (one is conditional Other)
- Ideate: 0 textareas + 2 text inputs
- Prototype: 1 optional textarea + 1 text input
- Test: 0 textareas + 3 text inputs (one is conditional Other)
- Share: 0 textareas + 2 text inputs

The previous student architecture contained 47 textarea/text-input controls across the six stages. The revised pages contain 14, several of which are optional or conditional.

## Worksheet validation

Six PDF worksheets were generated and rendered to PNG for visual inspection:

- Empathy Map
- Task Map
- Idea Sheet
- Prototype Build Plan
- Test Sheet
- Share-out Planner

The interview-notes template is generated dynamically as printable HTML so it can include the exact questions selected by the student.

## Facilitator synchronization validation

Every facilitator agenda activity was compared against an explicit expected student destination. All mappings pass.

The synchronized sequences are:

- Session 1: quick build -> Question Detective -> interview plan -> real interview -> Empathy Map -> check together.
- Session 2: quick challenge -> Task Map -> focused challenge -> check together.
- Session 3: learning strategies -> choose strategy -> varied ideas -> AI stretch -> shortlist -> check together.
- Session 4: quick challenge -> choose build path -> Build Plan/AI brief -> actual prototype -> design self-check -> check together.
- Session 5: evidence challenge -> test plan -> Test 1 -> revision -> test check -> story focus -> Share-out Planner -> thing to show -> rehearsal -> story check.

All five printable facilitator guides were checked against their corresponding web agendas for activity order and timing.

For every 2 x 45-minute facilitator plan:

- Meeting 1 begins at 0 and ends at 45.
- Meeting 2 begins at 0 and ends at 45 when used.
- There are no timing gaps or overlaps.
- No activity crosses the Meeting 1 / Meeting 2 boundary.

## Final automated result

- 1,039 checks
- 0 errors
