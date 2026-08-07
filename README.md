# Student AI Learning Innovation League website

This static public website is organized around three audience pathways—advisors, students, and families—and a six-stage student League Journey:

1. Empathize — Understand the Challenge
2. Define — Find the Breakdown
3. Ideate — Invent Possibilities
4. Prototype — Build Something Small
5. Test — Put It to the Test
6. Share — Tell the Story

## Student experience

The Student page is a journey map. Each stage has its own page and embeds only the tools needed at that point. Students may design something to help themselves or someone else learn. Across the journey, they also build understanding of human learning and of what AI can and cannot contribute to learning design.

Student support can be set to Guided, Supported, or Independent. Guided tools reveal one decision at a time rather than presenting large forms.

## Tool ownership and flow

- **Student-led:** Interview Coach, Resource Inventor AI-prompt builder, Five-Idea Sprint, Guided Prompt Builder when relevant, Testing & Revision, Sharing Event Builder.
- **Student + advisor:** Learning Breakdown Mapper, Strategy Explorer, Guided Build Planner, and major testing/build checkpoints.
- **Optional supplement:** Claim & Evidence Tracker, used when an outside claim needs verification; it is not required in the core Define stage.
- **Advisor:** Build Your Club Plan, lesson facilitation, accessibility/family planning, and implementation decisions.

## Advisor lesson pages

The five facilitator lessons are separate pages linked beneath Advisors: `lesson-empathize.html`, `lesson-define.html`, `lesson-ideate.html`, `lesson-prototype.html`, and `lesson-test.html`.

Each lesson begins with a choice between:

- a single **45-minute lesson**, or
- a **90-minute version delivered as two 45-minute sessions**.

The selection reveals one matching detailed Lesson Plan. Background ideas advisors need to teach are embedded directly in the relevant activity. Differentiation is presented as expandable, step-by-step options under **Need more?**.

## Data behavior

The interactive website is static and does not send tool entries to a server. Journey state and selected tool records use browser `localStorage` when available. The Resource Inventor creates a prompt for students to review and paste into an advisor-approved AI system; the website itself does not submit that prompt to an AI service. Download buttons create local files in the browser.

## Main scripts

- `assets/js/main.js` — navigation and general page behavior
- `assets/js/journey.js` — six-stage progress, project lens, support mode, build-path state, example threads
- `assets/js/stage-tools.js` — embedded student-stage tools and recommendation/guidance logic
- `assets/js/club-planner.js` — adaptive advisor club planner
- `assets/js/lesson-plans.js` — advisor lesson-length selector and plan switching
