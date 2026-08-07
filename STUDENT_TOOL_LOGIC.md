# Embedded student tool logic

All tools run in the browser with deterministic JavaScript. They do not call a generative AI model.

## Empathize — Interview Coach

Uses project lens (self/other), interview purpose, and learning focus to generate neutral starter questions. Students then record repeated themes, observations, changed assumptions, and unanswered questions.

## Define — Learning Breakdown Mapper

A guided 11-step wizard asks for project lens, broad challenge, overall task, step sequence, existing success, first breakdown, possible prerequisite/process, evidence, access explanation, observable success, and scope. It calculates a readiness score and classifies the challenge as Too Broad, Almost There, or Ready to Design. Missing direct evidence, an undefined bottleneck, unchecked access explanations, an unobservable success target, or broad scope can block readiness. It synthesizes “can already,” “breakdown,” evidence, and a focused problem frame.

## Define — Claim & Evidence Tracker

Stores claims, evidence/source, evidence type, current evidence strength, and design implication. AI suggestions receive a visible warning that they are not evidence until independently verified.

## Ideate — Strategy Explorer

Scores ten learning-strategy profiles from the reported breakdown, desired learner action, current learner stage, feedback needs, practice context, evidence quality, and access/design constraints. Returns three ranked strategies with explanations, product possibilities, testing ideas, cautions, and an evidence-confidence label.

## Ideate — Resource Inventor

Combines the chosen strategy, target learner action, and available materials/people/spaces/devices to produce three deliberately different activity directions: low-tech/physical, social/role-based, and digital/AI-assisted or a paper simulation when technology is unavailable.

## Ideate — Idea Board

Requires a five-idea sprint: no AI, use existing resources, people/social, AI-supported, and wild card. Resource Inventor outputs can be loaded as starting directions but students must refine them.

## Prototype — Choose Your Build

Scores ten concrete product forms: printable resource, physical game, practice routine, interactive activity, AI-generated content, conversational AI, role-play simulation, AI-supported physical activity, multimedia resource, and advanced app. Inputs include learner action, feedback adaptivity, conversation need, build time, technical experience, technology access, specific access needs, platform approval, data sensitivity, and—when available—resources selected in Ideate. It applies blockers to AI/digital paths when platform or data conditions are unresolved and returns three recommended forms plus the smallest prototype for each.

## Prototype — Prototype Planner

Produces a low-resolution plan from one test question, prototype form, required learner attempt, materials, deliberately omitted features, accessibility plan, and first test.

## Prototype — Guided Prompt Builder

Begins with the student's own first prompt. A one-question-at-a-time 13-question wizard then makes explicit the product/interaction format, learner, breakdown, learner action, sequence, productive struggle, feedback, resources, limits, accessibility, fading, evidence of learning, and options mode. Guided/Supported/Independent modes change how much explanation is displayed. The tool assembles Draft 1, shows it beside the student's first prompt, requires test notes, and then creates Draft 2 with the student's revision decision appended. Prompt Builder is visually gated by the selected build pathway.

## Test — Testing & Revision

Creates a focused test plan from tester, test question, exact task, observable success evidence, observation targets, and stopping rule. Multiple test records capture behavior, confusion/help, learning evidence, access issues, and the evidence-based revision.

## Share — Sharing Event Builder

Creates a presentation outline from the learning challenge, empathy/research findings, what the team learned about human learning, what it learned about AI, design rationale, evidence, testing, revision, demo, limitations, next steps, and accessible backup.
