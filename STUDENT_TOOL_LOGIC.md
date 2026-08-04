# Student Tool Logic

The Project Studio uses transparent, deterministic browser logic. It does not send entries to a server, call a generative AI model, or automatically save work.

## Adaptive Problem Size Check

The tool calculates a feasibility score from:

- Problem focus
- Observable evidence of learning
- Evidence sources
- Timeline-to-scope fit
- Access to testing
- Action-based versus deficit language
- Expected product scope
- Understanding of prerequisites
- Breadth of the intended learner group

Essential conditions receive more weight than optional conditions. The tool also applies combination rules, including broad problems in short timelines, varied learner groups without a shared bottleneck, motivation goals without observable behavior, platform-level ambitions, unknown prerequisites, and missing learner or teacher-client evidence.

The output includes a readiness status, score, evidence-base rating, strengths, blockers, tailored next revisions, cautions, a problem-frame template, and a target-specific evidence recommendation.

## Adaptive Strategy Matcher

Twelve strategy profiles are scored against:

- Learning breakdown
- Desired mental action
- Learner stage
- Current support
- Error pattern
- Evidence quality
- Practice context
- Practice frequency
- Feedback type
- Feedback timing
- Fading method
- Access and format constraints

The text fields affect the confidence rating and evidence recommendations. The highest-scoring profiles are returned as a sequence rather than an isolated list. The tool also generates a feedback plan, fading plan, access and format recommendations, cautions, and a testing recommendation.

The profiles are hypotheses to verify through learning-science research and user testing. They are not diagnoses.

## Adaptive Product-Type Decision

The tool compares four paths:

1. Non-AI learning tool
2. AI-assisted non-AI tool
3. Conversational AI tool
4. Custom application

Scores are adjusted using:

- Learner action
- Interaction need
- Response variability
- Feedback need
- Data sensitivity
- Account and platform approval
- Technical capacity
- Timeline
- Testing access
- Connectivity
- Maintenance capacity
- Five explicit decision gates

Hard blockers are applied to conversational or custom paths when sensitive data, prohibited or uncertain platforms, unverified generated feedback, or unsafe testing make those paths inappropriate. The output includes a primary path, backup path, comparison scores, blockers, matched conditions, minimum prototype, safeguards, next decisions, and testing plan.

## Guided Prompt Builder

The Prompt Builder asks seventeen questions one at a time. Each question includes:

- Why the decision matters
- How to respond
- A concrete example

Answers are stored only in temporary browser memory and update a live prompt. Students can move backward, jump among completed questions, review all answers, or prefill several questions from completed Project Studio tools. The final prompt includes interaction sequence, productive struggle, feedback, reflection, motivation, accessibility, fading, limits, measurement, verification, and escalation rules.
