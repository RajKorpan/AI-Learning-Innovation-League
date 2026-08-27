# Student Experience Recommendation Matrix

## Overall design system

- [x] **One primary action per screen.** All six stages use guided panels with only the current panel visible; the old “See all steps” control is removed.
- [x] **Negative space separates thinking modes.** New student CSS increases space around stage headers, step transitions, generated artifacts, checks, and completion states while keeping related controls grouped.
- [x] **Narrow instructional copy / wider work areas.** Stage intros are capped around 760px; work areas expand to 820–940px when maps, idea sets, test evidence, or story artifacts need room.
- [x] **Examples appear on demand.** Example project content is removed from the landing page and examples inside stages use collapsed `details` controls. Prototype has pathway-specific example controls.
- [x] **Quiet persistent navigation.** Stage pages use `Step X of Y`, Back, and Continue. No top stage journey or “See all steps.” The six-stage map remains at the bottom with current/completed state.
- [x] **Persistent student-help affordance.** Every stage has the same small `Need help?` control with a facilitator reminder.
- [x] **Stage-specific access question.** Every stage integrates a concise access question into the relevant design/test/share decision.
- [x] **Conclusive completion.** Every stage has exactly one completion panel containing artifact checklist, facilitator check, download, mark complete, and next-stage action.

## Students landing page

- [x] Spacious hero with one illustration and the requested hook: **Build something that helps someone learn**.
- [x] Hero includes only the short project description, four visual anchors, primary Begin action, and secondary journey link.
- [x] Reset moved out of the hero to the final Begin section.
- [x] One six-stage journey map with number, name, and one short phrase per stage.
- [x] Journey map notes that testing can send teams back to earlier stages.
- [x] Team guidance reduced to **Think first / Decide together / Check your progress** plus one role-rotation sentence.
- [x] Two project-lens cards with a persistent current-lens label.
- [x] Three equal support cards: Guided / Supported / Independent.
- [x] Final Begin band contains the primary Stage 1 action and quiet Reset action.

## Stage 1 · Empathize

- [x] Five-step structure.
- [x] Header states purpose and canonical artifact: **Interview Plan + Empathy Map**.
- [x] Two-minute assumption challenge occurs first and explicitly says the build is not the solution.
- [x] Reflection asks about learner assumptions, cause assumptions, and what must be learned before trusting them.
- [x] Access question asks whether access needs could change the assumption.
- [x] Question Detective is embedded inside interview preparation instead of becoming a separate long lesson.
- [x] Interview source choices: Teacher / Learner / Myself / Peer-teammate.
- [x] Teacher selection reveals that the facilitator can be the teacher interviewed.
- [x] STEM task field explicitly asks for the task/situation rather than the presumed solution.
- [x] Compact selectable bank of six starter questions; students choose 3–5 and may add one custom question.
- [x] Interview Plan is generated as a visible artifact.
- [x] Real interview follows immediately, with a simple notes area.
- [x] AI rehearsal is collapsed and optional after the real-interview instructions.
- [x] Empathy Map is a large visual evidence/hypothesis map rather than a stack of unrelated cards.
- [x] Evidence and best-guess/open-question groups are visually separated.
- [x] Only one collapsed example is offered for the map.
- [x] Facilitator check uses four concise questions and one `We checked this together` status.
- [x] Finish screen has the requested artifact checklist, download, completion, and Define action.

## Stage 2 · Define

- [x] Four-step structure.
- [x] Header artifact: **Task Map + Focused Learning Challenge**.
- [x] Quick challenge contrasts broad labels with a specific, designable breakdown.
- [x] Main activity uses the visible **Task → Steps → Where it changes → Focus** flow.
- [x] Empathize evidence and learner goal carry forward automatically.
- [x] Learner identity/project lens/STEM category are not re-requested.
- [x] Task steps record learner action, needed knowledge/decision, status, and evidence.
- [x] Students can add, remove, and reorder task steps.
- [x] Students identify the first meaningful change directly on the map.
- [x] Access question appears before naming a learning breakdown.
- [x] Focused statement generates `can already / begins to get hard / evidence / learning goal / success` and remains editable.
- [x] The draft is explicitly framed as a best explanation to test, not a diagnosis.
- [x] Learning goal is integrated into the mapper rather than becoming an extra step.
- [x] Facilitator check covers specificity, evidence, goal alignment, observable success, and access.
- [x] Finish screen includes the requested Define artifacts and Ideate action.

## Stage 3 · Ideate

- [x] Six-step structure with no extra quick challenge.
- [x] Header artifact: **Strategy + Idea Shortlist**.
- [x] Six plain-language learning moves appear before matching.
- [x] Every move includes a one-line explanation, familiar example, and formal learning-science name in smaller text.
- [x] Strategy Explorer carries forward the Define learning goal and asks only high-value matching questions.
- [x] Results show 2–3 possible matches with plain-language move, formal name, reason, and learner action.
- [x] Selecting a strategy creates a visible strategy artifact and asks `Why does this fit your breakdown?`.
- [x] Non-AI idea generation uses five constrained idea types rather than five blank boxes.
- [x] Idea set includes required low/no-tech, social, visual/physical/interactive, digital/AI, and wild-card directions.
- [x] Every idea prompt asks what the learner actually does.
- [x] AI comes after student idea generation and is framed as a way to stretch ideas, not choose the answer.
- [x] AI prompt automatically uses the learning goal, strategy, current ideas, resources, context, constraints, and access needs.
- [x] Prompt explicitly says not to ask for “the best solution” and requests genuinely different possibilities.
- [x] Students bring back only 2–3 ideas worth considering.
- [x] Shortlisting allows up to three ideas and displays them side by side against Learning fit / Evidence fit / Buildability / Access without numerical scoring.
- [x] Students save a preferred direction and backup direction.
- [x] Stage completion requires the strategy, rationale, five varied ideas including low/no-tech, preferred direction, and facilitator check.

## Stage 4 · Prototype

- [x] Seven-step structure and maker-workspace framing.
- [x] Header artifact: **Testable Prototype + Build Plan**.
- [x] Quick challenge emphasizes prototyping the learning interaction rather than the finished product.
- [x] Three equal prototype pathways are presented as selectable cards.
- [x] Each pathway has its own collapsed `See examples` control.
- [x] All pathways share the prompt foundation: learning goal → learner action → context → boundaries → usable output.
- [x] Shared foundation carries forward the learning goal and selected strategy.
- [x] Path 1 asks for physical learner action, sequence, materials, feedback, and AI’s behind-the-scenes creation role.
- [x] Path 1 generates a reusable AI creation prompt for a low/no-tech prototype.
- [x] Path 1 maker guidance emphasizes reviewing/editing AI output and building only a tiny testable set.
- [x] Path 2 asks for role, opening, learner thinking, response behavior, boundaries, feedback, and ending.
- [x] Path 2 generates a conversational prompt and provides internal test cases: correct, incorrect, vague, shortcut, hard case, and “I don’t know.”
- [x] Path 3 asks for learner action, sequence, inputs, outputs, feedback, success, AI build role, and what not to build yet.
- [x] Path 3 generates an AI build request and keeps APIs/hardware/custom code optional.
- [x] Maker step requires an actual prototype another person can try and keeps the scope rule visible.
- [x] Access question changes based on the selected pathway.
- [x] Shared learning-design gate is one item at a time and stops on `Not yet` / `I'm not sure`.
- [x] Gate checks Define alignment, learner thinking, strategy visibility, observability, access, checked AI output, and small scope.
- [x] Gate ends by capturing the first test question.
- [x] Completion requires a real prototype, build rationale/instructions, design check, first test question, and facilitator check.

## Stage 5 · Test

- [x] Six-step structure.
- [x] Header artifact: **Test Record + Revision**.
- [x] Quick challenge distinguishes learner evidence from liking or simply finishing.
- [x] Test plan carries forward the learning goal and sign of success.
- [x] Test plan asks one focused question, tester, task, observable evidence, important-thinking check, and access question.
- [x] Tester choices include team/self, peer, teacher, and target learner with concise limits of each evidence source.
- [x] Test 1 observation workspace visually separates **What happened?** from **What does that suggest?**.
- [x] Students record whether the learning goal changed and one evidence-linked revision.
- [x] Test 2 is optional; students may run it or record why it is not possible.
- [x] Completion requires at least one meaningful test/revision cycle; two cycles remain recommended.
- [x] Version history is rendered as a visual timeline rather than a form table.
- [x] Next test question is captured before completion.
- [x] Completion requires test plan, observations, learning evidence, revision, next question, and facilitator check.

## Stage 6 · Share

- [x] Six-step structure.
- [x] Header artifact: **Share-out Story + Something Useful to Show**.
- [x] Prominent reassurance states that the project does not need to be finished.
- [x] Evidence-sized claim challenge remains first.
- [x] Students choose one story center once: learning, problem, prototype, testing change, or developed tool.
- [x] Story Builder is one question at a time rather than ten simultaneous text boxes.
- [x] Story Builder carries forward learner evidence, breakdown, strategy, prototype, and testing history when available.
- [x] Conditional AI-role question appears only when the project used an AI build path/base prompt.
- [x] Story produces a portable visible artifact.
- [x] `Something useful to show` offers learning clue / prototype / test evidence / tool in action.
- [x] Students specify what the audience should notice.
- [x] Access question covers audience access and offers captions, text alternative, verbal explanation, paper backup, screenshots, and non-internet backup.
- [x] Portable share-out prepares a short version, speaking roles, and backup plan without requiring a venue choice.
- [x] Completion requires claim, uncertainty, next step, thing to show, portable short version, and facilitator check.
- [x] Celebration appears only after Share is actually marked complete; Return to Journey Map is then revealed.

## Interaction and content standards

- [x] Meaningful artifacts receive their own visually prominent summary areas.
- [x] Previously known project information is carried forward instead of repeatedly requested.
- [x] Ordinary explanatory prose is not wrapped in decorative cards.
- [x] Low-tech/off-screen design remains prominent.
- [x] AI is used as a design/build resource without making conversational AI the default product.
- [x] The Facilitators top navigation remains a direct link with no dropdown; detailed facilitator session navigation remains in page/footer navigation.
