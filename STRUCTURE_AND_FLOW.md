# Student Journey and Project Studio Structure

This revision changes **organization and flow**, not the underlying content or algorithms of the current Project Studio tools. The original tool implementations remain in `tool-lab.html`.

## Student Journey

The student experience now uses six stage pages:

1. `student-empathize.html` — Understand the Challenge / Empathize
2. `student-define.html` — Find the Breakdown / Define
3. `student-ideate.html` — Invent Possibilities / Ideate
4. `student-prototype.html` — Build Something Small / Prototype
5. `student-test.html` — Put It to the Test / Test
6. `student-share.html` — Tell the Story / Share

`students.html` is now a journey map rather than a long project manual.

### Progress logic

`assets/js/journey.js` stores three lightweight settings in browser `localStorage`:

- completed stage numbers
- preferred support level (Guided / Supported / Independent)
- selected build path during Prototype

This is intentionally a **soft progression**. Later stages are never technically locked. The map marks the first unfinished stage as “Up next” while still allowing students and advisors to preview or revisit any stage.

## Tool ownership

### Student
- Interview Coach (new)
- What Do You Have? Resource Inventor (new)
- Idea Board (new)
- Prototype Planner
- Prompt Builder when the selected build path needs it
- Testing & Revision
- Sharing Event Builder (new)

### Student + advisor
- Learning Breakdown Mapper (planned consolidation of Problem Size Check + Task Analysis + relevant Learning Progression)
- Claim & Evidence Tracker
- Strategy Explorer
- Choose Your Build (current Product-Type Decision)
- Advanced Build Guidance

### Advisor
- Build Your Club Plan
- Accessibility implementation check
- Implementation Notes (new)
- Sharing-Event Readiness (new)

## Build paths

Prototype stage separates technical complexity from journey progress:

- Path A — AI helps you make something
- Path B — Guided AI tool
- Path C — Design AI behavior more independently
- Path D — Advanced digital build

The paths are not rankings.

## Support levels

The journey also separates student independence from technical complexity:

- Guided
- Supported
- Independent

The selected support mode is currently saved and displayed. Tool content can later adapt to that mode without changing the page architecture.

## Current tool preservation

No current tool algorithm was removed or rewritten in this pass. `tool-lab.html` contains the previous Project Studio so all existing tools remain usable while their future consolidated flows are designed.
