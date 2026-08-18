# Build Your Club Plan — Current Logic

The advisor planner is a browser-based, deterministic planning tool. It does not call a generative-AI service and does not save entries to a server.

## Inputs used

The planner currently uses:

- number of students;
- grade band;
- prior design/AI experience;
- club format selected through the format cards;
- available adult facilitation;
- which teacher students will interview, including whether the advisor is that teacher;
- technology availability;
- family-communication status;
- stated accessibility, language, device, transportation, or scheduling needs;
- available supports; and
- whether each of the five lessons will use one 45-minute session or two 45-minute sessions.

## Current schedule constraint

The current pilot planner supports one sequence only:

1. Lesson 1 — Empathize
2. Lesson 2 — Define
3. Lesson 3 — Ideate
4. Lesson 4 — Prototype
5. Lesson 5 — Test + Share

Advisors choose either the 45-minute plan or the 90-minute/two-session plan for each lesson. The generated plan therefore links to the five facilitator lesson pages rather than inventing a separate calendar.

Additional schedule patterns can be added later without changing the five-lesson curriculum structure.

## Recommendation logic

The planner combines fields rather than treating every answer independently. Examples include:

- one-on-one format with more than one student produces a format mismatch;
- virtual format without device/internet support produces a required access action;
- many teams with one advisor produces an adult-capacity recommendation;
- advanced application development without technical support produces a required simplification/support action;
- new student teams using the one-session lesson version receive stronger scope and scaffolding recommendations;
- an unconfirmed teacher interview connection produces a readiness action;
- unfinished family communication produces a required or strong next step before interviews, learner testing, or public sharing;
- stated access needs generate targeted recommendations and can flag missing accessibility or language supports;
- non-virtual formats without an identified meeting space produce a readiness action.

## Generated plan sections

The output includes:

1. setup/readiness status;
2. selected configuration;
3. recommended team structure;
4. format-specific recommendations;
5. student scaffolding recommendations;
6. adult-facilitation recommendations;
7. technology/building recommendations;
8. teacher-interview and family-communication recommendations;
9. accessibility and participation recommendations;
10. guidance for the selected 45- or 90-minute lesson pattern;
11. direct links to the five facilitator lessons; and
12. prioritized actions and items still needing confirmation.
