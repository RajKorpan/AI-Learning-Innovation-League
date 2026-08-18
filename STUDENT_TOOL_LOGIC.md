# Embedded student tool logic

The website's guided tools run in the browser. Most use deterministic JavaScript. The Resource Inventor is different: it teaches students to construct a prompt that they may paste into an advisor-approved AI system; the website does not itself call a generative AI service.

## Empathize — Interview Coach

Uses project lens (self/other), interview purpose, and learning focus to generate neutral starter questions. Students record patterns, observations, changed assumptions, and unanswered questions.

## Define — Learning Breakdown Mapper

A guided sequence asks for project lens, broad challenge, overall task, task sequence, existing success, first breakdown, possible prerequisite/process, direct evidence, possible access explanation, observable success, and scope. It calculates readiness and classifies the challenge as **Too broad**, **Almost there**, or **Ready to design**. Missing direct evidence, an undefined bottleneck, unchecked access explanations, an unobservable success target, or broad scope can block readiness. It synthesizes what the learner can already do, the likely breakdown, direct evidence, and a focused problem frame.

## Define — Direct evidence within the Learning Breakdown Mapper

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

## Stage 3 revision: Define + Ideate

The current Define and Ideate pages supersede the earlier descriptions of the Learning Breakdown Mapper, Strategy Explorer, and Resource Inventor above where they differ.

### Learning Breakdown Mapper
The mapper now has four progressive parts: set the task, build a step-by-step Task Map, set the learning target, and review. Each task step records the learner action, required knowledge/decision, current status, and direct evidence. The tool creates a focused learning objective and observable evidence of success, then stores these as project-wide variables.

### Optional Task Breakdown Guide
When students cannot identify the hidden steps, the site can generate a prompt for an advisor-approved AI tool. The prompt asks the AI to question the student and propose a draft hypothesis. It explicitly prohibits diagnosis and requires the student to return to the website, revise the Task Map, and review it with an advisor.

### Strategy Explorer
Students first learn a limited set of learning-challenge categories and complete short classification practice cases. The Explorer then returns three ranked strategy hypotheses. Every strategy output includes why it may fit, what the learner should actually do, what the learning tool should do, how to know whether the strategy helped, and concrete product possibilities.

### Resource Inventor
Resource Inventor now incorporates the project learning objective, selected strategy, available materials, learner interests, grouping, time, practical constraints, accessibility needs, and a request for multiple alternatives. It builds a prompt to use in an advisor-approved AI system; it does not call an AI service itself. Students bring generated ideas back to the site, explain which possibility or combination seems most useful and why, and can later complete a reflection after trying an activity.

### Connected project state
The focused problem, learning objective, observable evidence of success, selected learning strategy, and available resources are saved locally in the browser and are carried forward into later Prototype and Test tools where feasible.
