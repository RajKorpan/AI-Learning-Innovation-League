# Student AI Learning Innovation League — Journey Structure Revision

This revision focuses on **organization, navigation, and flow logic** before the next content/tool-development pass.

## What changed

- The public top navigation remains: Home, About, Advisors, Students, Families, Project Studio, Resources.
- `students.html` is now a visual **six-stage League Journey map** rather than one long student manual.
- Six stage pages organize student work around:
  1. Empathize — Understand the Challenge
  2. Define — Find the Breakdown
  3. Ideate — Invent Possibilities
  4. Prototype — Build Something Small
  5. Test — Put It to the Test
  6. Share — Tell the Story
- Browser-local progress logic marks stages Complete / Up next / Preview without hard-locking later stages.
- Students can select a scaffolding level: Guided, Supported, or Independent.
- Prototype has four **build paths** that are explicitly not rankings.
- Three example projects can be followed across all six stages.
- Project Studio is now a **role-based hub** rather than the all-tools workspace.
- Tools are organized as Student, Student + Advisor, or Advisor tools.
- The previous full interactive Project Studio is preserved as `tool-lab.html`; tool algorithms were intentionally not redesigned in this pass.
- The Advisor page now includes a concise tool-ownership map.

## Current tool preservation

The adaptive Problem Size Check, Strategy Matcher, Product-Type Decision, Prompt Builder, Testing Log, and other existing interactive tools are still available in `tool-lab.html` and use the existing `assets/js/studio-tools.js` logic.

The adaptive advisor club planner remains unchanged on `advisors.html` and continues to use `assets/js/club-planner.js`.

## Flow documentation

See `STRUCTURE_AND_FLOW.md` for the proposed consolidation of tools, ownership, stage routing, support levels, and build paths.
