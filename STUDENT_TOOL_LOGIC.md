# Embedded student tool logic

The website's guided tools run in the browser. Most use deterministic JavaScript. The Resource Inventor is different: it teaches students to construct a prompt that they may paste into an advisor-approved AI system; the website does not itself call a generative AI service.

## Empathize — Interview Coach

Uses project lens (self/other), interview purpose, and learning focus to generate neutral starter questions. Students record patterns, observations, changed assumptions, and unanswered questions.

## Define — Learning Breakdown Mapper

A guided sequence asks for project lens, broad challenge, overall task, task sequence, existing success, first breakdown, possible prerequisite/process, direct evidence, possible access explanation, observable success, and scope. It calculates readiness and classifies the challenge as **Too broad**, **Almost there**, or **Ready to design**. Missing direct evidence, an undefined bottleneck, unchecked access explanations, an unobservable success target, or broad scope can block readiness. It synthesizes what the learner can already do, the likely breakdown, direct evidence, and a focused problem frame.

## Define — Claim & Evidence Tracker (optional supplement)

This is not required for the core Define stage. Use it when an outside learning-science claim materially affects a design choice or an advisor asks students to verify a claim. It stores claims, support/source, evidence type, strength, and design implication. AI suggestions are explicitly marked as not being evidence until independently verified.

## Ideate — Guided Strategy Explorer

Asks one question at a time about the breakdown, learner stage, desired mental action, direct evidence, evidence strength, feedback, practice context, and access/design constraints. It scores strategy profiles and returns three ranked possibilities with explanations, product examples, cautions, test ideas, and confidence calibrated to the quality of the evidence.

## Ideate — Resource Inventor

Walks students through the learning target, strategy, materials/resources, additional resources, grouping, available time, access requirements, and desired variety. It then generates a detailed prompt for an advisor-approved AI system. The prompt tells AI to create genuinely different learning-activity possibilities that make meaningful use of the resources on hand, preserve learner thinking, include accessibility considerations, and suggest low-resolution prototypes. Students are told to critique and remix the AI output rather than accept a proposed activity unchanged.

## Ideate — Five-Idea Sprint

Replaces a large text-box Idea Board with five short creative rounds: no-AI, use-what-you-have, social/people, critique-and-remix an AI possibility, and wild card. Students can request a random design twist and then shortlist up to two ideas for discussion.

## Prototype — Guided Build Planner

Combines the former product-type decision, technical build-path decision, and prototype planner. The first guided sequence considers learner action, feedback/conversation needs, time, technical experience, technology access, accessibility, platform approval, data sensitivity, and available resources. It ranks concrete product forms and identifies blocked or risky options. After students choose a form, a second guided sequence selects an appropriate technical pathway and creates the smallest testable prototype plan.

## Prototype — Guided Prompt Builder

Used only when the learning interaction genuinely benefits from generative/conversational AI. The first step explicitly asks students to tell AI what it is supposed to do in their own first prompt. The one-question-at-a-time builder then makes the learning-design decisions more explicit. Students compare their first prompt with Draft 1, test Draft 1 in an approved system, record what happened, and create Draft 2 from their own revision decision.

## Test — Guided Testing & Revision

Phase 1 asks one question at a time to establish the tester, test question, exact task, observable success, observation targets, and stopping/redefinition rule. Students then run the test. Phase 2 asks one question at a time about actual behavior, confusion/help, learning evidence, accessibility/usability barriers, and the revision. The record is added to a testing log and students are encouraged to retest.

## Share — Sharing Event Builder

Asks one question at a time about the challenge, what the team learned by listening, what it learned about human learning, what it learned about AI, the design and rationale, testing, revision, focused demo, limitations, next step, and accessible backup. It assembles these into a sharing-event outline.
