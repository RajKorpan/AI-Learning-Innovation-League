# Student AI Learning Innovation League website

This static public website is organized around three audience pathways—advisors, students, and families—and a six-stage student League Journey:

1. Empathize — Understand the Challenge
2. Define — Find the Breakdown
3. Ideate — Invent Possibilities
4. Prototype — Build Something Small
5. Test — Put It to the Test
6. Share — Tell the Story

## Student experience

The Student page is a journey map. Each stage has its own page and embeds only the tools needed at that point. Students may design a tool to help themselves or someone else learn. Every stage also includes explicit reflection on human learning and AI.

Student support can be set to Guided, Supported, or Independent. The guided wizards show more explanation/examples; Independent mode keeps help available on demand.

## Tool ownership

- Student-led: Interview Coach, Resource Inventor, Idea Board, Prototype Planner, Prompt Builder when relevant, Testing & Revision, Sharing Event Builder.
- Student + advisor: Learning Breakdown Mapper, Claim & Evidence Tracker, Strategy Explorer, Choose Your Build, major testing/build checkpoints.
- Advisor: Build Your Club Plan, facilitator guidance, accessibility/family planning, local implementation notes.

## Data behavior

The interactive website is static and does not send tool entries to a server. Journey state and selected tool records use browser localStorage when available. Download buttons create local text files in the browser.

## Main scripts

- `assets/js/main.js` — navigation and general page behavior
- `assets/js/journey.js` — six-stage progress, project lens, support mode, build-path state, example threads
- `assets/js/stage-tools.js` — embedded student-stage tools and deterministic recommendation logic
- `assets/js/club-planner.js` — adaptive advisor club planner
- `assets/js/advisor-notes.js` — local advisor implementation notes


## Advisor lesson pages
The five facilitator lessons are now separate pages linked beneath Advisors in the primary navigation: lesson-empathize.html, lesson-define.html, lesson-ideate.html, lesson-prototype.html, and lesson-test.html. The Advisor page is the implementation hub rather than the lesson container.
