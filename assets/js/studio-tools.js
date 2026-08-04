(function(){
'use strict';
const toolState={};
function byId(id){return document.getElementById(id)}
function text(id){return byId(id)?.value?.trim()||''}
function selectedLabel(id){const el=byId(id);return el?.options?.[el.selectedIndex]?.text||''}
function checkedValues(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value)}
function radioValue(name){return document.querySelector(`input[name="${name}"]:checked`)?.value||'uncertain'}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function downloadText(name,value,type='text/plain'){const b=new Blob([value],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();URL.revokeObjectURL(a.href)}
async function copyText(value,statusId){try{await navigator.clipboard.writeText(value);if(statusId&&byId(statusId))byId(statusId).textContent='Copied.';}catch(e){if(statusId&&byId(statusId))byId(statusId).textContent='Select and copy the output manually.';}}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function listHtml(items,empty='None identified.'){return items.length?`<ul>${items.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:`<p>${escapeHtml(empty)}</p>`}
function plainList(title,items){return `${title}\n${items.length?items.map(x=>`- ${x}`).join('\n'):'- None identified.'}`}
function markComplete(id){toolState[id]=true;document.querySelectorAll(`[data-tool-status="${id}"], [data-progress-for="${id}"]`).forEach(el=>{el.textContent='Complete';el.classList.add('is-complete')});}
function openTool(id){const sec=byId(id);if(!sec)return;document.querySelectorAll('details.tool-step').forEach(d=>d.open=d.closest('section')===sec);sec.querySelector('details.tool-step')?.setAttribute('open','');}
function handleHash(){if(location.hash){const id=location.hash.slice(1);if(document.querySelector(`#${CSS.escape(id)} details.tool-step`))openTool(id);}}
window.addEventListener('hashchange',handleHash);handleHash();
document.querySelectorAll('.tool-nav-link,.studio-links a,.sidebar-toc a').forEach(a=>a.addEventListener('click',()=>{const id=(a.getAttribute('href')||'').replace('#','');setTimeout(()=>openTool(id),0)}));

// -----------------------------------------------------------------------------
// 1. Adaptive Problem Size Check
// -----------------------------------------------------------------------------
let sizeOutput='';
const problemTargetEvidence={
 knowledge:'Use unaided recall, accurate recognition, or use of the knowledge in a new item.',
 procedure:'Observe whether the learner completes the sequence independently and checks the result.',
 reasoning:'Ask the learner to explain a decision and apply the reasoning to a new example.',
 representation:'Use a new graph, table, diagram, model, or passage and observe accurate interpretation.',
 metacognition:'Observe planning, strategy selection, monitoring, explanation of confusion, and a justified next step.',
 motivation:'Define observable behavior such as beginning, persisting, requesting help, returning after an error, or completing a chosen next step.',
 multiple:'Select one necessary knowledge, action, strategy, or decision before defining evidence.'
};
byId('size-check')?.addEventListener('submit',e=>{
 e.preventDefault();
 const statement=text('problem-statement');
 const learners=text('problem-learners');
 const target=text('problem-target');
 const focus=text('problem-focus');
 const success=text('problem-success');
 const evidence=checkedValues('problem-evidence');
 const timeline=text('problem-timeline');
 const testAccess=text('problem-test-access');
 const language=text('problem-language');
 const scope=text('problem-scope');
 const dependencies=text('problem-dependencies');
 const focusPoints={specific:18,related:10,broad:0,unsure:3}[focus]||0;
 const successPoints={observable:18,developing:9,opinion:2,unsure:0}[success]||0;
 let evidencePoints=0;
 if(evidence.includes('teacher'))evidencePoints+=4;
 if(evidence.includes('learner'))evidencePoints+=5;
 if(evidence.includes('work'))evidencePoints+=5;
 if(evidence.includes('research'))evidencePoints+=4;
 if(evidence.includes('assumption'))evidencePoints-=8;
 evidencePoints=clamp(evidencePoints,-8,18);
 const timeFit={
  short:{specific:10,related:3,broad:0,unsure:1},
  five:{specific:10,related:8,broad:2,unsure:4},
  ten:{specific:9,related:10,broad:6,unsure:5},
  semester:{specific:8,related:10,broad:8,unsure:6}
 }[timeline]?.[focus]||0;
 const testPoints={learner:12,'teacher-peer':8,peer:4,none:0}[testAccess]||0;
 const languagePoints={action:10,mixed:4,deficit:-8}[language]||0;
 const scopePoints={one:8,features:3,platform:-5,unsure:1}[scope]||0;
 const dependencyPoints={known:6,some:3,unknown:0}[dependencies]||0;
 const learnerPoints={one:4,small:4,class:2,varied:0}[learners]||0;
 const raw=focusPoints+successPoints+evidencePoints+timeFit+testPoints+languagePoints+scopePoints+dependencyPoints+learnerPoints;
 const score=Math.round(clamp(raw,0,104)/104*100);
 const blockers=[],actions=[],strengths=[],cautions=[];
 if(statement.length<20)actions.push('Rewrite the problem as a complete statement that names the learner action and the point where the process breaks down.'); else strengths.push('The team has written a concrete problem statement to evaluate.');
 if(focus==='specific')strengths.push('The problem is focused on one necessary component.');
 if(focus==='related')actions.push('Choose the first or most necessary component among the related components.');
 if(focus==='broad'||focus==='unsure')blockers.push('The problem is still too broad or uncertain for one prototype.');
 if(success==='observable')strengths.push('Success is defined as an observable performance.');
 if(success==='developing')actions.push(`Refine the success measure. ${problemTargetEvidence[target]}`);
 if(success==='opinion'||success==='unsure')blockers.push(`Satisfaction or general confidence is not enough evidence of learning. ${problemTargetEvidence[target]}`);
 if(!evidence.length)blockers.push('No evidence source has been identified.');
 if(evidence.includes('assumption'))blockers.push('The definition relies on a team assumption that must be checked with people or performance evidence.');
 if(!evidence.includes('teacher'))actions.push('Add a teacher-client perspective on the learning goal, prerequisites, and signs of success.'); else strengths.push('Teacher-client evidence is included.');
 if(!evidence.includes('learner'))actions.push('Add a learner interview or observation so the team does not rely only on adult interpretation.'); else strengths.push('Learner evidence is included.');
 if(!evidence.includes('work'))actions.push('Request or observe a privacy-safe work sample, attempt, or performance example.'); else strengths.push('The problem is connected to observed performance.');
 if(timeline==='short'&&focus!=='specific')blockers.push('A one- or two-session cycle requires one very small component and one prototype question.');
 if((learners==='class'||learners==='varied')&&(timeline==='short'||focus!=='specific'))actions.push('Select one shared bottleneck or one priority learner profile for the first design cycle.');
 if(learners==='varied')cautions.push('Different learner groups may require separate interviews, access checks, or versions rather than one universal solution.');
 if(testAccess==='none')blockers.push('No realistic testing access is confirmed.');
 if(testAccess==='peer')cautions.push('Peer testing can check clarity and interaction, but it cannot establish usefulness for the intended learner.');
 if(testAccess==='teacher-peer')cautions.push('Use teacher-client and peer feedback for a prospective prototype, then arrange learner testing before claiming impact.');
 if(language==='deficit')blockers.push('Rewrite the problem without labeling the learner as lazy, weak, low, unmotivated, or incapable.');
 if(language==='mixed')actions.push('Replace general judgments with observable knowledge, action, reasoning, strategy, or behavior.');
 if(scope==='platform')actions.push('Reduce the first build to one interaction, one routine, one example set, or one learner decision.');
 if(scope==='features')actions.push('Identify which single feature tests the most important assumption first.');
 if(scope==='unsure')actions.push('Choose a low-resolution prototype format before development begins.');
 if(dependencies==='unknown')actions.push('Complete Task Analysis before ideation because several prerequisites or dependencies are unknown.');
 if(dependencies==='some')cautions.push('Mark uncertain prerequisites and test them before treating the selected component as the root bottleneck.');
 if(target==='multiple')blockers.push('The project is targeting several kinds of change at once; select one primary learning action.');
 if(target==='motivation'&&(success==='opinion'||success==='unsure'))actions.push('Operationalize motivation through observable initiation, persistence, help-seeking, return after error, or task completion.');
 if(timeline==='semester'&&focus==='specific'&&scope==='one')cautions.push('Use the additional time for repeated testing, varied examples, and revision rather than automatically expanding the problem.');
 if(!blockers.length&&score>=78)strengths.push('The combination of scope, evidence, timeline, testing access, and product expectations is feasible for a design cycle.');
 let status='Redefine before building';
 if(!blockers.length&&score>=78)status='Ready for task analysis and prototyping';
 else if(blockers.length<=1&&score>=55)status='Ready after targeted revisions';
 const evidenceLevel=(evidence.includes('teacher')&&evidence.includes('learner')&&evidence.includes('work'))?'Triangulated':evidence.length>=2&&!evidence.includes('assumption')?'Developing':'Weak or provisional';
 const frame=`[${selectedLabel('problem-learners')} ] can already [name an existing success], but has difficulty [one specific component] when [name the context]. The team will test whether [${problemTargetEvidence[target]}] changes after [one focused support or interaction].`;
 const statusClass=status.startsWith('Ready for')?'fit-high':status.startsWith('Ready after')?'fit-medium':'fit-blocked';
 byId('size-result').innerHTML=`
 <div class="result-summary ${statusClass}"><div><span class="result-kicker">Readiness</span><h3>${escapeHtml(status)}</h3><p>${escapeHtml(evidenceLevel)} evidence base · ${score}/100 feasibility score</p></div><div class="score-ring" aria-label="${score} out of 100">${score}</div></div>
 <div class="grid two result-detail-grid"><article class="card"><h3>Strengths</h3>${listHtml(strengths,'No strength is confirmed yet.')}</article><article class="card"><h3>Blockers</h3>${listHtml(blockers,'No hard blocker identified.')}</article><article class="card"><h3>Next revisions</h3>${listHtml([...new Set(actions)])}</article><article class="card"><h3>Cautions</h3>${listHtml([...new Set(cautions)],'No additional caution identified.')}</article></div>
 <div class="callout-blue"><strong>Recommended problem frame</strong><p>${escapeHtml(frame)}</p></div>
 <div class="note-box"><strong>Suggested evidence of learning:</strong> ${escapeHtml(problemTargetEvidence[target])}</div>`;
 sizeOutput=[
  'ADAPTIVE PROBLEM SIZE CHECK',`STATUS: ${status}`,`FEASIBILITY SCORE: ${score}/100`,`EVIDENCE BASE: ${evidenceLevel}`,
  `CURRENT STATEMENT: ${statement||'[not entered]'}`,`TARGET LEARNERS: ${selectedLabel('problem-learners')}`,`TARGET CHANGE: ${selectedLabel('problem-target')}`,`FOCUS: ${selectedLabel('problem-focus')}`,`SUCCESS EVIDENCE: ${selectedLabel('problem-success')}`,
  `EVIDENCE SOURCES: ${evidence.length?evidence.join(', '):'None selected'}`,`TIMELINE: ${selectedLabel('problem-timeline')}`,`TESTING ACCESS: ${selectedLabel('problem-test-access')}`,`PROBLEM LANGUAGE: ${selectedLabel('problem-language')}`,`PRODUCT SCOPE: ${selectedLabel('problem-scope')}`,`DEPENDENCIES: ${selectedLabel('problem-dependencies')}`,
  plainList('STRENGTHS',strengths),plainList('BLOCKERS',blockers),plainList('NEXT REVISIONS',[...new Set(actions)]),plainList('CAUTIONS',[...new Set(cautions)]),`RECOMMENDED PROBLEM FRAME\n${frame}`,`SUGGESTED EVIDENCE OF LEARNING\n${problemTargetEvidence[target]}`
 ].join('\n\n');
 markComplete('problem');
});
byId('copy-size-result')?.addEventListener('click',()=>copyText(sizeOutput||'Complete the Adaptive Problem Size Check first.'));
byId('download-size-result')?.addEventListener('click',()=>downloadText('adaptive-problem-size-check.txt',sizeOutput||'Adaptive Problem Size Check not completed.'));

// -----------------------------------------------------------------------------
// 2–4. Structured tools
// -----------------------------------------------------------------------------
const taskIds=['goal','know','do','prereq','vocab','concepts','procedures','decisions','errors','load','bottleneck','learned'];
const taskNames=['FINAL LEARNING GOAL','REQUIRED KNOWLEDGE','REQUIRED ACTIONS','PREREQUISITES','VOCABULARY AND SYMBOLS','CONCEPTS','PROCEDURES','DECISION POINTS','COMMON ERRORS','COGNITIVE-LOAD RISKS','SELECTED BOTTLENECK','EVIDENCE OF LEARNING'];
function taskText(){return taskIds.map((id,i)=>`${taskNames[i]}\n${text(id)||'[not entered]'}`).join('\n\n')}
byId('make-task')?.addEventListener('click',()=>{byId('task-output').textContent=taskText();markComplete('task')});
byId('download-task')?.addEventListener('click',()=>downloadText('task-analysis.txt',taskText()));
byId('copy-task')?.addEventListener('click',()=>copyText(taskText()));
const evidence=[];
function evidencePlain(){return evidence.length?evidence.map((r,i)=>`EVIDENCE ${i+1}\nCLAIM: ${r[0]}\nSOURCE: ${r[1]}\nSTRENGTH: ${r[2]}\nRELEVANCE: ${r[3]}\nDESIGN IMPLICATION: ${r[4]}`).join('\n\n'):'No evidence records entered.'}
byId('add-evidence')?.addEventListener('click',()=>{const row=['claim','source','strength','relevance','implication'].map(id=>text(id));if(!row[0]||!row[1]){alert('Enter a claim and source.');return;}evidence.push(row);const tr=document.createElement('tr');row.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});byId('evidence-body').appendChild(tr);const card=document.createElement('article');card.className='record-card';card.innerHTML=`<h3>Evidence ${evidence.length}</h3><dl><dt>Claim</dt><dd>${escapeHtml(row[0])}</dd><dt>Source</dt><dd>${escapeHtml(row[1])}</dd><dt>Strength</dt><dd>${escapeHtml(row[2])}</dd><dt>Relevance</dt><dd>${escapeHtml(row[3])}</dd><dt>Design implication</dt><dd>${escapeHtml(row[4])}</dd></dl>`;byId('evidence-cards')?.appendChild(card);['claim','source','relevance','implication'].forEach(id=>byId(id).value='');markComplete('evidence')});
byId('download-evidence')?.addEventListener('click',()=>{const esc=s=>`"${String(s).replaceAll('"','""')}"`;const rows=[['Claim','Source','Strength','Relevance','Design implication'],...evidence];downloadText('learning-science-evidence.csv',rows.map(r=>r.map(esc).join(',')).join('\n'),'text/csv')});
byId('copy-evidence')?.addEventListener('click',()=>copyText(evidencePlain()));
const pids=['skill','before','prerequisite','confused','beginning','developing','proficient','enables','advanced'];
const pnames=['SELECTED SKILL','WHAT COMES BEFORE','PREREQUISITES','OFTEN CONFUSED WITH','BEGINNING','DEVELOPING','PROFICIENT','WHAT IT ENABLES','ADVANCED WORK'];
function progressionText(){return pids.map((id,i)=>`${pnames[i]}\n${text(id)||'[not entered]'}`).join('\n\n')}
byId('make-progression')?.addEventListener('click',()=>{byId('progression-output').textContent=progressionText();markComplete('progression')});
byId('download-progression')?.addEventListener('click',()=>downloadText('learning-progression.txt',progressionText()));
byId('copy-progression')?.addEventListener('click',()=>copyText(progressionText()));

// -----------------------------------------------------------------------------
// 5. Adaptive Strategy Matcher
// -----------------------------------------------------------------------------
const strategies={
 retrieval:{name:'Retrieval practice and spacing',concept:'Memory retrieval and distributed practice',why:'Strengthens access to previously learned knowledge through effortful recall.',not:'Do not use recall practice as a substitute for first teaching or conceptual explanation.',tools:'Question cards, flashcards, low-stakes quiz, retrieval routine, retrieval Gem',test:'Compare unaided recall and accurate use before and after spaced attempts.',challenges:['retrieve','vocab','tests','prior'],actions:['recall'],stages:['developing','independent'],errors:['forgetting','inconsistent'],feedback:['corrective'],timing:['after-attempt','delayed'],contexts:['independent','transfer'],frequency:['spaced','mixed'],supports:['tool','independent']},
 elaboration:{name:'Elaboration and self-explanation',concept:'Generative learning and knowledge integration',why:'Prompts the learner to explain relationships, reasons, and connections.',not:'Broad explanation prompts may overload a novice who lacks prerequisites.',tools:'Why/how cards, explanation routine, teach-back, explanation coach',test:'Ask the learner to explain and use the idea in a different example.',challenges:['prior','explain','reading','writing'],actions:['explain','apply'],stages:['developing','independent'],errors:['systematic','misapplied'],feedback:['reasoning','reflection'],timing:['after-explanation'],contexts:['guided','independent'],frequency:['repeated','spaced'],supports:['prompts','independent']},
 worked:{name:'Worked examples with fading',concept:'Cognitive load and gradual release',why:'Makes a successful process visible while reducing unnecessary working-memory demands.',not:'A full model can become answer substitution when support is not faded.',tools:'Annotated model, step cards, partially completed example, guided Gem',test:'Remove one part of the model and observe whether the learner completes and explains it.',challenges:['steps','load','writing','question'],actions:['sequence','apply'],stages:['novice','developing'],errors:['overload','no-attempt','systematic'],feedback:['worked','hints'],timing:['after-attempt','after-explanation'],contexts:['first','guided'],frequency:['one','repeated'],supports:['none','model']},
 feedback:{name:'Error analysis and targeted feedback',concept:'Formative feedback and learning from error',why:'Makes the learner’s reasoning visible and connects a specific error to a retry.',not:'Generic praise, correction without explanation, or immediate answers will not develop error detection.',tools:'Error sort, correction routine, annotated comparison, error-analysis coach',test:'Use a comparable item and observe whether the learner detects and corrects the pattern independently.',challenges:['evaluate','explain','persist','apply'],actions:['inspect','explain'],stages:['developing','independent'],errors:['systematic','misapplied','inconsistent'],feedback:['corrective','reasoning','worked'],timing:['after-attempt','after-explanation'],contexts:['guided','independent'],frequency:['repeated','spaced'],supports:['prompts','tool']},
 chunking:{name:'Task decomposition and chunking',concept:'Working-memory limits and cognitive load',why:'Makes entry points, sequence, and decision points visible for a complex task.',not:'Over-chunking can hide relationships or prevent the learner from managing the whole task.',tools:'Checklist, workflow cards, question-decomposition routine, planning coach',test:'Observe whether the learner can begin, sequence, and eventually complete the task without the scaffold.',challenges:['question','steps','load','writing','select'],actions:['sequence','monitor'],stages:['novice','developing'],errors:['no-attempt','overload'],feedback:['hints','worked','reflection'],timing:['after-attempt','end-set'],contexts:['first','guided'],frequency:['one','repeated'],supports:['none','tool','model']},
 metacognition:{name:'Metacognitive monitoring and self-regulation',concept:'Planning, monitoring, strategy choice, and reflection',why:'Helps the learner predict, notice confusion, select a strategy, check progress, and plan a next step.',not:'Reflection becomes superficial when it is disconnected from a specific task and action.',tools:'Prediction-check routine, reflection prompts, progress map, strategy checklist',test:'Ask the learner to predict, monitor, justify a strategy, and choose a next step on a new task.',challenges:['monitor','select','evaluate','tests','persist'],actions:['monitor','sequence'],stages:['developing','independent','transfer'],errors:['inconsistent','misapplied','no-attempt'],feedback:['reflection','reasoning'],timing:['after-explanation','end-set','delayed'],contexts:['independent','transfer'],frequency:['spaced','mixed'],supports:['prompts','tool','independent']},
 comparison:{name:'Comparison and contrasting cases',concept:'Discrimination and concept formation',why:'Highlights the features that distinguish similar ideas, examples, strategies, or representations.',not:'Cases must vary on meaningful features and should not differ only in surface details.',tools:'Card sort, example/nonexample set, side-by-side cases, debate or classification partner',test:'Present new cases and ask the learner to classify and justify the distinguishing feature.',challenges:['distinguish','patterns','visual','prior','apply'],actions:['compare','interpret'],stages:['novice','developing','transfer'],errors:['systematic','misapplied','representation'],feedback:['worked','reasoning'],timing:['after-explanation','end-set'],contexts:['first','guided','transfer'],frequency:['repeated','mixed'],supports:['model','prompts','tool']},
 representation:{name:'Representation interpretation and translation',concept:'Multiple representations and disciplinary literacy',why:'Builds explicit links among graphs, tables, diagrams, symbols, language, and underlying concepts.',not:'Choose representations because they fit the content and access need—not a fixed learning-style label.',tools:'Graph annotation, data-table guide, diagram-to-text routine, representation translator',test:'Use a new representation and ask the learner to extract, translate, and explain the information.',challenges:['visual','reading','patterns','question'],actions:['interpret','compare'],stages:['novice','developing','transfer'],errors:['representation','systematic'],feedback:['hints','reasoning','worked'],timing:['after-attempt','after-explanation'],contexts:['first','guided','transfer'],frequency:['repeated','mixed'],supports:['model','tool','prompts']},
 transfer:{name:'Varied practice and transfer',concept:'Flexible knowledge and application',why:'Requires learners to select and use knowledge across contexts, representations, or subjects.',not:'Transfer practice is premature when the core concept or procedure is not yet accurate.',tools:'Scenario cards, mixed practice, simulator, cross-subject challenge',test:'Use a novel context without naming the strategy and observe selection, explanation, and adaptation.',challenges:['apply','transfer','patterns','select'],actions:['apply','compare','monitor'],stages:['independent','transfer'],errors:['misapplied','inconsistent'],feedback:['reasoning','reflection'],timing:['end-set','delayed'],contexts:['transfer','independent'],frequency:['spaced','mixed'],supports:['independent','tool']},
 reading:{name:'Text structure and comprehension monitoring',concept:'Disciplinary literacy and comprehension',why:'Supports purposeful reading, evidence selection, inference, text structure, and monitoring.',not:'A summary generator may hide whether the learner can build meaning from the text.',tools:'Reading guide, annotation routine, evidence organizer, comprehension coach',test:'Use a new passage and examine inference, evidence selection, and monitoring.',challenges:['reading','question','writing','prior'],actions:['interpret','explain','monitor'],stages:['novice','developing','independent'],errors:['overload','systematic','no-attempt'],feedback:['hints','reasoning','reflection'],timing:['after-explanation','end-set'],contexts:['guided','independent'],frequency:['repeated','spaced'],supports:['model','prompts','tool']},
 motivation:{name:'Goal, relevance, choice, and progress supports',concept:'Motivation, expectancy, value, belonging, and self-regulation',why:'Supports beginning, persistence, help-seeking, and return after error through meaningful goals and visible progress.',not:'Motivation supports should not replace instruction for a missing prerequisite or inaccessible task.',tools:'Choice menu, short goal cycle, progress tracker, relevance interview, persistence routine',test:'Observe initiation, persistence, help-seeking, return after error, and completion—not only stated enjoyment.',challenges:['persist','tests','monitor'],actions:['monitor','sequence'],stages:['novice','developing','independent'],errors:['no-attempt','inconsistent'],feedback:['reflection','hints'],timing:['after-attempt','end-set','delayed'],contexts:['guided','independent'],frequency:['repeated','spaced'],supports:['none','prompts','tool']},
 collaboration:{name:'Collaborative explanation and reciprocal practice',concept:'Learning through explanation, dialogue, and peer feedback',why:'Requires learners to articulate, question, compare, and respond to another person’s reasoning.',not:'Unstructured group work may hide participation differences or spread misconceptions.',tools:'Paired explanation cards, reciprocal teaching, structured debate, peer-feedback protocol',test:'Use assigned roles and examine whether each learner can later perform and explain independently.',challenges:['explain','reading','writing','distinguish'],actions:['explain','compare'],stages:['developing','independent'],errors:['systematic','inconsistent'],feedback:['reasoning','reflection'],timing:['after-explanation','end-set'],contexts:['guided','independent'],frequency:['repeated','spaced'],supports:['prompts','tool']}
};
let matcherPlain='';
function scoreStrategy(profile,values){
 let score=0;const reasons=[];
 const add=(condition,points,reason)=>{if(condition){score+=points;if(reason)reasons.push(reason)}};
 add(profile.challenges.includes(values.challenge),20,`matches the identified breakdown: ${values.challengeLabel}`);
 add(profile.actions.includes(values.action),18,`practices the desired mental action: ${values.actionLabel}`);
 add(profile.stages.includes(values.stage),8,`fits the learner stage: ${values.stageLabel}`);
 add(profile.errors.includes(values.error),12,`addresses the observed pattern: ${values.errorLabel}`);
 add(profile.feedback.includes(values.feedback),8,`supports the requested feedback: ${values.feedbackLabel}`);
 add(profile.timing.includes(values.timing),4,`fits the feedback timing`);
 add(profile.contexts.includes(values.context),8,`fits the practice context`);
 add(profile.frequency.includes(values.frequency),5,`fits the available practice frequency`);
 add(profile.supports.includes(values.support),5,`builds appropriately from the current support`);
 if(values.constraints.includes('short')&&['retrieval','chunking','feedback','motivation'].some(k=>profile===strategies[k])){score+=3;reasons.push('can be implemented in short routines')}
 if(values.constraints.includes('reading-language')&&['representation','reading','comparison'].some(k=>profile===strategies[k])){score+=3;reasons.push('can make language and representations more explicit')}
 if(values.constraints.includes('motivation')&&profile===strategies.motivation){score+=5;reasons.push('directly addresses confidence, relevance, or persistence')}
 return {score,reasons};
}
byId('matcher-form')?.addEventListener('submit',e=>{
 e.preventDefault();
 const values={
  challenge:text('challenge'),challengeLabel:selectedLabel('challenge'),stage:text('learner-stage'),stageLabel:selectedLabel('learner-stage'),support:text('current-support'),supportLabel:selectedLabel('current-support'),error:text('error-pattern'),errorLabel:selectedLabel('error-pattern'),already:text('already'),bottleneck:text('bottleneck-evidence'),evidence:text('evidence-quality'),evidenceLabel:selectedLabel('evidence-quality'),action:text('mental-action'),actionLabel:selectedLabel('mental-action'),context:text('practice-context'),contextLabel:selectedLabel('practice-context'),frequency:text('practice-frequency'),frequencyLabel:selectedLabel('practice-frequency'),feedback:text('feedback-type'),feedbackLabel:selectedLabel('feedback-type'),timing:text('feedback-timing'),timingLabel:selectedLabel('feedback-timing'),fade:text('fade-method'),fadeLabel:selectedLabel('fade-method'),fadeDetails:text('fade-details'),constraints:checkedValues('strategy-constraint')
 };
 const ranked=Object.entries(strategies).map(([key,p])=>({key,profile:p,...scoreStrategy(p,values)})).sort((a,b)=>b.score-a.score);
 const top=ranked.slice(0,3);
 const maxPossible=94;
 const evidenceBase={repeated:3,triangulated:4,single:2,'self-report':1,assumption:0}[values.evidence]||0;
 let confidencePoints=evidenceBase+(values.already.length>=20?1:0)+(values.bottleneck.length>=30?1:0);
 const confidence=confidencePoints>=5?'High':confidencePoints>=3?'Moderate':'Low';
 const cautions=[],nextEvidence=[];
 if(values.already.length<20)nextEvidence.push('Describe a specific prerequisite or partial success the learner can already perform.');
 if(values.bottleneck.length<30)nextEvidence.push('Add repeated performance evidence that distinguishes this bottleneck from another possible cause.');
 if(values.evidence==='assumption')cautions.push('The strategy sequence is provisional because the bottleneck is based mainly on an assumption.');
 if(values.evidence==='self-report')cautions.push('Pair self-report with an observed attempt or work sample before treating this as the bottleneck.');
 if(values.stage==='novice'&&values.context==='transfer')cautions.push('Transfer practice is premature until the learner can perform the core component with guided support.');
 if(values.stage==='novice'&&values.frequency==='one')cautions.push('One opportunity may reveal usability but is unlikely to establish learning or durable change.');
 if(values.error==='systematic'&&values.feedback==='corrective')cautions.push('A repeated misconception needs explanation, comparison, or error analysis—not correction alone.');
 if(values.frequency==='one'&&values.action==='recall')cautions.push('A single recall attempt cannot test spacing or durability.');
 const feedbackPlans={
  corrective:'Require an attempt, identify the specific error, ask for a correction, and use a comparable item before giving the answer.',
  hints:'Use graduated hints: open question, focused cue, partial representation, then a model only when necessary.',
  reasoning:'Identify one accurate idea and one gap in reasoning, then ask a focused question that requires revision.',
  worked:'Compare the learner’s attempt with a worked example and ask the learner to locate and explain the first difference.',
  reflection:'Ask the learner to predict, monitor, explain the chosen strategy, judge confidence with evidence, and select a next step.'
 };
 const timingPlans={
  'after-attempt':'Provide feedback only after the learner commits to an attempt.',
  'after-explanation':'Wait until the learner explains the reasoning so feedback responds to thinking rather than only the answer.',
  'end-set':'Allow a short set before feedback so the team can see patterns rather than reacting to one item.',
  delayed:'Use delayed feedback and a later retrieval or transfer check to examine durability.'
 };
 const fadeDefaults={
  'remove-hints':'Move from open question to fewer cues, then remove hints after successful attempts.',
  'increase-delay':'Increase wait time before help and require the learner to choose a next action first.',
  'remove-steps':'Remove completed parts of the model or checklist one at a time.',
  'student-choice':'Ask the learner to select and justify the strategy instead of being told which one to use.',
  'vary-context':'Move from familiar examples to mixed, less familiar contexts and representations.',
  custom:'Write a specific rule for when and how support changes.'
 };
 const formatAdvice=[];
 if(values.constraints.includes('no-device'))formatAdvice.push('Use paper cards, role-play, a printed organizer, manipulatives, or an advisor-facilitated routine.');
 if(values.constraints.includes('short'))formatAdvice.push('Use a repeatable 5–10 minute routine with one target action and one evidence check.');
 if(values.constraints.includes('reading-language'))formatAdvice.push('Use plain language, examples, visuals with text descriptions, oral response options, and vocabulary support.');
 if(values.constraints.includes('sensory-motor'))formatAdvice.push('Offer keyboard, screen-reader, enlarged-text, captioned, oral, tactile, or assisted alternatives as appropriate.');
 if(values.constraints.includes('motivation'))formatAdvice.push('Include meaningful choice, short goals, visible progress, relevance, and a planned response after error.');
 if(!formatAdvice.length||values.constraints.includes('none'))formatAdvice.push('Select the simplest paper, physical, or digital format that lets the learner perform the target mental action.');
 const sequenceByStage={
  novice:`Begin with ${top[0].profile.name}, pair it with ${top[1].profile.name}, and move to ${top[2].profile.name} only after the learner can complete a guided attempt.`,
  developing:`Elicit an attempt, use ${top[0].profile.name}, add ${top[1].profile.name} for the recurring gap, and use ${top[2].profile.name} to build independence.`,
  independent:`Begin with an independent attempt, use ${top[0].profile.name} for consistency, then ${top[1].profile.name} and ${top[2].profile.name} across varied tasks.`,
  transfer:`Use ${top[0].profile.name} in unfamiliar cases, require strategy selection and explanation, and use ${top[1].profile.name} and ${top[2].profile.name} to compare contexts and monitor transfer.`
 }[values.stage];
 const fadePlan=values.fade==='custom'&&values.fadeDetails?values.fadeDetails:`${fadeDefaults[values.fade]}${values.fadeDetails?' Team detail: '+values.fadeDetails:''}`;
 const testPlan=`Use ${values.contextLabel.toLowerCase()} with ${values.frequencyLabel.toLowerCase()}. Record whether the learner performs “${values.actionLabel}” with less support, then use a comparable or new task. Primary evidence: ${top[0].profile.test}`;
 byId('matcher-results').innerHTML=`
 <div class="result-summary fit-high"><div><span class="result-kicker">Strategy confidence</span><h3>${confidence} confidence</h3><p>${escapeHtml(values.evidenceLabel)} · recommendations remain hypotheses to test</p></div><div class="score-ring" aria-label="Top strategy fit ${Math.round(top[0].score/maxPossible*100)} percent">${Math.round(top[0].score/maxPossible*100)}%</div></div>
 <div class="callout-blue"><strong>Recommended sequence</strong><p>${escapeHtml(sequenceByStage)}</p></div>
 <div class="fit-grid">${top.map((r,i)=>`<article class="card strategy-card"><div class="fit-card-heading"><span class="fit-rank">${i+1}</span><span class="fit-badge fit-${r.score>=60?'high':r.score>=40?'medium':'low'}">${Math.round(r.score/maxPossible*100)}% fit</span></div><h3>${escapeHtml(r.profile.name)}</h3><p><strong>Why this combination fits:</strong></p>${listHtml(r.reasons.slice(0,6))}<p><strong>Research concept:</strong> ${escapeHtml(r.profile.concept)}</p><p><strong>Possible formats:</strong> ${escapeHtml(r.profile.tools)}</p><p><strong>When to be cautious:</strong> ${escapeHtml(r.profile.not)}</p><p><strong>How to test:</strong> ${escapeHtml(r.profile.test)}</p></article>`).join('')}</div>
 <div class="grid two result-detail-grid"><article class="card"><h3>Feedback plan</h3><p>${escapeHtml(feedbackPlans[values.feedback])}</p><p>${escapeHtml(timingPlans[values.timing])}</p></article><article class="card"><h3>Fading plan</h3><p>${escapeHtml(fadePlan)}</p></article><article class="card"><h3>Format and access</h3>${listHtml(formatAdvice)}</article><article class="card"><h3>Evidence and cautions</h3>${listHtml([...cautions,...nextEvidence],'No additional caution identified.')}</article></div>
 <div class="note-box"><strong>Testing recommendation:</strong> ${escapeHtml(testPlan)}</div>`;
 matcherPlain=[
  'ADAPTIVE STRATEGY MATCHER',`CONFIDENCE: ${confidence}`,`LEARNER FOUNDATION: ${values.already||'[not entered]'}`,`BOTTLENECK EVIDENCE: ${values.bottleneck||'[not entered]'}`,`BREAKDOWN: ${values.challengeLabel}`,`LEARNER STAGE: ${values.stageLabel}`,`CURRENT SUPPORT: ${values.supportLabel}`,`ERROR PATTERN: ${values.errorLabel}`,`MENTAL ACTION: ${values.actionLabel}`,`PRACTICE CONTEXT: ${values.contextLabel}`,`PRACTICE FREQUENCY: ${values.frequencyLabel}`,`FEEDBACK: ${values.feedbackLabel}`,`FEEDBACK TIMING: ${values.timingLabel}`,`FADING: ${fadePlan}`,`RECOMMENDED SEQUENCE\n${sequenceByStage}`,
  ...top.map((r,i)=>`STRATEGY ${i+1}: ${r.profile.name}\nFIT: ${Math.round(r.score/maxPossible*100)}%\nMATCHED CONDITIONS: ${r.reasons.join('; ')}\nCONCEPT: ${r.profile.concept}\nFORMATS: ${r.profile.tools}\nCAUTION: ${r.profile.not}\nTEST: ${r.profile.test}`),
  `FEEDBACK PLAN\n${feedbackPlans[values.feedback]} ${timingPlans[values.timing]}`,`FORMAT AND ACCESS\n${formatAdvice.map(x=>'- '+x).join('\n')}`,plainList('CAUTIONS AND NEXT EVIDENCE',[...cautions,...nextEvidence]),`TESTING RECOMMENDATION\n${testPlan}`
 ].join('\n\n');
 markComplete('matcher');
});
byId('copy-matcher')?.addEventListener('click',()=>copyText(matcherPlain||'Run the Adaptive Strategy Matcher first.'));
byId('download-matcher')?.addEventListener('click',()=>downloadText('adaptive-strategy-matcher.txt',matcherPlain||'Adaptive Strategy Matcher not completed.'));

// -----------------------------------------------------------------------------
// 6. Adaptive Product-Type Decision
// -----------------------------------------------------------------------------
let productPlain='';
const productProfiles={
 nonai:{name:'Non-AI learning tool',description:'Paper, physical, visual, game-based, activity-based, or a fixed digital resource.',prototype:'Create a paper or physical sample that lets a learner perform the target action in one realistic task.'},
 aiassist:{name:'AI-assisted non-AI tool',description:'AI helps draft examples or content, while students verify and curate a stable final tool.',prototype:'Generate a small candidate set, verify every item, and create a static card, activity, organizer, or question set.'},
 conversation:{name:'Conversational AI tool',description:'A Gem or chatbot provides adaptive questions, hints, dialogue, role-play, or reflection.',prototype:'Role-play a paper conversation flow or mock transcript before entering instructions into an approved platform.'},
 custom:{name:'Custom application',description:'A custom interface, workflow, visualization, simulation, or rule-based interaction.',prototype:'Build a clickable wireframe or one-function prototype before connecting data, accounts, or generative services.'}
};
function addScores(scores,changes){Object.entries(changes).forEach(([k,v])=>scores[k]+=v)}
byId('product-decision-form')?.addEventListener('submit',e=>{
 e.preventDefault();
 const problem=text('problem-description'),actionDescription=text('learner-action-description');
 const action=text('product-action-type'),interaction=text('interaction-need'),variability=text('response-variability'),feedback=text('feedback-need'),data=text('data-sensitivity'),account=text('account-status'),capacity=text('tech-capacity'),timeline=text('product-timeline'),testAccess=text('product-testing-access'),connectivity=text('connectivity'),maintenance=text('maintenance');
 const gates={unique:radioValue('ai-unique'),verify:radioValue('verify-output'),struggle:radioValue('preserve-struggle'),safe:radioValue('safe-test'),lowtech:radioValue('low-tech')};
 const scores={nonai:30,aiassist:25,conversation:20,custom:15};
 const reasons={nonai:[],aiassist:[],conversation:[],custom:[]};
 const blockers={nonai:[],aiassist:[],conversation:[],custom:[]};
 const global=[],safeguards=[],nextSteps=[];
 function apply(map,label){Object.entries(map).forEach(([k,v])=>{scores[k]+=v;if(v>=8)reasons[k].push(label)})}
 const actionMap={recall:{nonai:18,aiassist:12,conversation:7,custom:4},explain:{nonai:8,aiassist:8,conversation:18,custom:8},compare:{nonai:16,aiassist:10,conversation:8,custom:6},apply:{nonai:8,aiassist:8,conversation:14,custom:14},plan:{nonai:14,aiassist:6,conversation:10,custom:8},monitor:{nonai:10,aiassist:8,conversation:18,custom:8},interpret:{nonai:16,aiassist:8,conversation:7,custom:12},simulate:{nonai:5,aiassist:6,conversation:20,custom:16}};
 apply(actionMap[action],`fits the learner action: ${selectedLabel('product-action-type')}`);
 const interactionMap={static:{nonai:25,aiassist:8,conversation:-12,custom:-5},'fixed-practice':{nonai:17,aiassist:12,conversation:7,custom:8},'varied-content':{nonai:4,aiassist:23,conversation:12,custom:10},'adaptive-dialogue':{nonai:-8,aiassist:2,conversation:27,custom:18},roleplay:{nonai:3,aiassist:4,conversation:27,custom:14},workflow:{nonai:2,aiassist:3,conversation:3,custom:30}};
 apply(interactionMap[interaction],`fits the required interaction: ${selectedLabel('interaction-need')}`);
 apply({fixed:{nonai:15,aiassist:7,conversation:-5,custom:0},moderate:{nonai:5,aiassist:13,conversation:8,custom:7},open:{nonai:-5,aiassist:5,conversation:18,custom:12}}[variability],`fits the response variability: ${selectedLabel('response-variability')}`);
 apply({'none-static':{nonai:17,aiassist:8,conversation:-6,custom:2},'rule-based':{nonai:8,aiassist:4,conversation:5,custom:18},adaptive:{nonai:-8,aiassist:2,conversation:24,custom:16},human:{nonai:12,aiassist:10,conversation:5,custom:3}}[feedback],`fits the feedback need: ${selectedLabel('feedback-need')}`);
 if(data==='none'||data==='nonsensitive'){reasons.nonai.push('requires little or no learner data');reasons.aiassist.push('can use non-sensitive examples');}
 if(data==='deidentified'){scores.conversation-=8;scores.custom-=5;safeguards.push('Use only the minimum de-identified content and confirm that re-identification is not possible.');}
 if(data==='identifiable'||data==='sensitive'){blockers.conversation.push('Generative or conversational use of identifiable or sensitive information is not appropriate for this prototype.');blockers.custom.push('Do not build a custom system around identifiable or sensitive learner data without institutional approval and a different data plan.');scores.aiassist-=18;safeguards.push('Remove or replace identifying and sensitive information with invented or de-identified examples.');}
 if(account==='no-account')apply({nonai:18,aiassist:10,conversation:-10,custom:-5},'works without learner accounts');
 if(account==='approved-ai')apply({nonai:0,aiassist:8,conversation:18,custom:3},'approved AI accounts are confirmed');
 if(account==='approved-custom')apply({nonai:0,aiassist:4,conversation:6,custom:20},'approved development and hosting are confirmed');
 if(account==='uncertain'){blockers.conversation.push('Account, age, school, or platform requirements are uncertain.');blockers.custom.push('Development or hosting approval is uncertain.');nextSteps.push('Confirm current account, age, school, privacy, and sharing requirements before technology development.');}
 if(account==='prohibited'){blockers.conversation.push('The proposed platform is not permitted.');blockers.custom.push('The proposed platform or hosting path is not permitted.');scores.aiassist-=12;nextSteps.push('Choose an approved tool or a non-AI prototype.');}
 apply({paper:{nonai:25,aiassist:4,conversation:-12,custom:-20},'ai-content':{nonai:8,aiassist:23,conversation:5,custom:0},'no-code':{nonai:4,aiassist:9,conversation:24,custom:-5},coding:{nonai:0,aiassist:4,conversation:8,custom:22},'supported-coding':{nonai:0,aiassist:5,conversation:10,custom:28}}[capacity],`fits the team capacity: ${selectedLabel('tech-capacity')}`);
 apply({short:{nonai:22,aiassist:12,conversation:-4,custom:-25},five:{nonai:12,aiassist:12,conversation:10,custom:-8},ten:{nonai:7,aiassist:10,conversation:12,custom:8},semester:{nonai:4,aiassist:8,conversation:12,custom:18}}[timeline],`fits the timeline: ${selectedLabel('product-timeline')}`);
 if(testAccess==='learner')apply({nonai:8,aiassist:8,conversation:12,custom:12},'intended learner testing is available');
 if(testAccess==='teacher')apply({nonai:7,aiassist:7,conversation:4,custom:2},'teacher-client and peer testing are available');
 if(testAccess==='peer'){scores.conversation-=8;scores.custom-=10;nextSteps.push('Treat the result as a prospective prototype and arrange intended-learner testing before claiming impact.');}
 if(testAccess==='none'){blockers.conversation.push('No realistic testing access is confirmed.');blockers.custom.push('No realistic testing access is confirmed.');scores.nonai-=5;scores.aiassist-=5;global.push('Do not claim learning impact until intended-learner testing is possible.');}
 if(connectivity==='offline')apply({nonai:22,aiassist:7,conversation:-25,custom:-15},'must work offline or without a personal device');
 if(connectivity==='intermittent')apply({nonai:14,aiassist:8,conversation:-12,custom:-8},'must tolerate intermittent devices or internet');
 if(connectivity==='reliable')apply({nonai:0,aiassist:5,conversation:10,custom:10},'reliable devices and internet are available');
 if(maintenance==='one-time')apply({nonai:13,aiassist:8,conversation:-7,custom:-18},'little ongoing maintenance is available');
 if(maintenance==='periodic')apply({nonai:6,aiassist:8,conversation:6,custom:4},'periodic review is possible');
 if(maintenance==='ongoing')apply({nonai:2,aiassist:7,conversation:12,custom:18},'ongoing maintenance is available');
 if(gates.unique==='yes')apply({nonai:-5,aiassist:5,conversation:20,custom:18},'AI provides a unique educational capability');
 if(gates.unique==='no')apply({nonai:20,aiassist:8,conversation:-18,custom:-15},'a simpler tool can provide the needed capability');
 if(gates.unique==='uncertain'){scores.conversation-=7;scores.custom-=7;nextSteps.push('Compare the proposed AI interaction with a paper or rule-based prototype using the same learner task.');}
 if(gates.verify==='yes')apply({nonai:0,aiassist:10,conversation:12,custom:9},'generated content or feedback can be verified');
 if(gates.verify==='no'){blockers.conversation.push('Generated content or feedback cannot be verified.');blockers.custom.push('Generated content or feedback cannot be verified.');scores.aiassist-=20;nextSteps.push('Limit AI to brainstorming or use fixed, teacher-reviewed content.');}
 if(gates.verify==='uncertain'){scores.aiassist-=7;scores.conversation-=12;scores.custom-=10;safeguards.push('Define who verifies content, what source is used, and what happens when the tool is uncertain.');}
 if(gates.struggle==='yes')apply({nonai:5,aiassist:5,conversation:10,custom:10},'the interaction preserves productive struggle');
 if(gates.struggle==='no'){global.push('Pause product selection: redesign the interaction so the learner must attempt, explain, compare, apply, monitor, or revise before receiving help.');scores.conversation-=20;scores.custom-=20;}
 if(gates.struggle==='uncertain'){global.push('Test whether the tool asks before telling and whether the learner still performs the target mental action.');}
 if(gates.safe==='yes')apply({nonai:5,aiassist:5,conversation:10,custom:10},'safe realistic testing is possible');
 if(gates.safe==='no'){blockers.conversation.push('The product cannot yet be tested safely and realistically.');blockers.custom.push('The product cannot yet be tested safely and realistically.');nextSteps.push('Use a paper flow, storyboard, role-play, or mock transcript until a safe test is possible.');}
 if(gates.safe==='uncertain'){scores.conversation-=8;scores.custom-=8;nextSteps.push('Define the test participant, task, permission, stopping rule, and evidence before development.');}
 if(gates.lowtech==='yes'){Object.keys(scores).forEach(k=>scores[k]+=3);safeguards.push('Keep the accessible low-tech alternative available during testing and the sharing event.');}
 if(gates.lowtech==='no'){scores.conversation-=7;scores.custom-=7;safeguards.push('Create an accessible low-tech or human-facilitated alternative before relying on the digital product.');}
 if(gates.lowtech==='uncertain')safeguards.push('Identify how a learner can participate without the proposed device, account, interface, or AI service.');
 if(problem.length<20)nextSteps.push('Write a complete learning-problem statement before committing to a product.');
 if(actionDescription.length<15)nextSteps.push('Describe the learner action in observable terms before selecting features.');
 const result=Object.keys(productProfiles).map(key=>({key,rawScore:scores[key],score:0,blocked:blockers[key],profile:productProfiles[key],reasons:[...new Set(reasons[key])]})).sort((a,b)=>{if(a.blocked.length!==b.blocked.length)return a.blocked.length-b.blocked.length;return b.rawScore-a.rawScore});
 const available=result.filter(r=>!r.blocked.length);
 const maxRaw=Math.max(1,...available.map(r=>r.rawScore));
 result.forEach(r=>{r.score=r.blocked.length?0:Math.round(clamp(r.rawScore/maxRaw*100,0,100))});
 const primary=available[0]||result[0],backup=available[1]||result[1];
 let overall='Recommended starting path';
 if(global.some(x=>x.startsWith('Pause')))overall='Redesign the learning interaction before building';
 else if(primary.blocked.length)overall='Resolve blockers before selecting a digital product';
 const confidencePoints=(problem.length>=20?1:0)+(actionDescription.length>=15?1:0)+(gates.unique!=='uncertain'?1:0)+(gates.verify!=='uncertain'?1:0)+(gates.safe!=='uncertain'?1:0)+(testAccess!=='none'?1:0)+(account!=='uncertain'?1:0);
 const confidence=confidencePoints>=6?'High':confidencePoints>=4?'Moderate':'Low';
 const testPlan={learner:'Test one realistic task with an intended learner, observe behavior, and compare the target action before and after support.',teacher:'Use teacher-client review for alignment and peer testing for clarity; arrange learner testing before claiming usefulness.',peer:'Use peers only to test instructions and interaction. Label the result prospective until intended learners test it.',none:'Limit work to a prospective paper or mock prototype and do not claim impact.'}[testAccess];
 const sharedSafeguards=[...new Set([...safeguards,...global])];
 byId('product-decision-result').innerHTML=`
 <div class="result-summary ${overall.startsWith('Recommended')?'fit-high':'fit-medium'}"><div><span class="result-kicker">${escapeHtml(overall)}</span><h3>${escapeHtml(primary.profile.name)}</h3><p>${confidence} decision confidence · backup: ${escapeHtml(backup.profile.name)}</p></div><div class="score-ring" aria-label="Fit score ${primary.score} out of 100">${primary.score}</div></div>
 <div class="fit-grid product-fit-grid">${result.map(r=>`<article class="card product-card ${r.blocked.length?'is-blocked':''}"><div class="fit-card-heading"><span class="fit-badge ${r.blocked.length?'fit-blocked':r.score>=75?'fit-high':r.score>=55?'fit-medium':'fit-low'}">${r.blocked.length?'Blocked':r.score+'% fit'}</span></div><h3>${escapeHtml(r.profile.name)}</h3><p>${escapeHtml(r.profile.description)}</p><p><strong>Matched conditions</strong></p>${listHtml(r.reasons.slice(0,7),'No strong positive match identified.')}<p><strong>Blockers</strong></p>${listHtml(r.blocked,'No blocker identified.')}<p><strong>Minimum prototype</strong></p><p>${escapeHtml(r.profile.prototype)}</p></article>`).join('')}</div>
 <div class="grid two result-detail-grid"><article class="card"><h3>Why start here</h3>${listHtml(primary.reasons.slice(0,8))}</article><article class="card"><h3>Required safeguards</h3>${listHtml(sharedSafeguards,'Use privacy-safe content, human review, and an accessible alternative.')}</article><article class="card"><h3>Next decisions</h3>${listHtml([...new Set(nextSteps)],'Proceed to a low-resolution prototype and compare it with the backup path.')}</article><article class="card"><h3>Testing plan</h3><p>${escapeHtml(testPlan)}</p></article></div>
 <div class="callout-blue"><strong>Recommended first prototype:</strong> ${escapeHtml(primary.profile.prototype)}</div>`;
 productPlain=[
  'ADAPTIVE PRODUCT-TYPE DECISION',`OVERALL: ${overall}`,`PRIMARY PATH: ${primary.profile.name} (${primary.score}% fit)`,`BACKUP PATH: ${backup.profile.name} (${backup.score}% fit)`,`DECISION CONFIDENCE: ${confidence}`,`PROBLEM: ${problem||'[not entered]'}`,`LEARNER ACTION: ${actionDescription||'[not entered]'}`,
  `ACTION TYPE: ${selectedLabel('product-action-type')}`,`INTERACTION: ${selectedLabel('interaction-need')}`,`RESPONSE VARIABILITY: ${selectedLabel('response-variability')}`,`FEEDBACK: ${selectedLabel('feedback-need')}`,`DATA: ${selectedLabel('data-sensitivity')}`,`ACCOUNT AND APPROVAL: ${selectedLabel('account-status')}`,`TECHNICAL CAPACITY: ${selectedLabel('tech-capacity')}`,`TIMELINE: ${selectedLabel('product-timeline')}`,`TESTING ACCESS: ${selectedLabel('product-testing-access')}`,`CONNECTIVITY: ${selectedLabel('connectivity')}`,`MAINTENANCE: ${selectedLabel('maintenance')}`,
  ...result.map(r=>`${r.profile.name.toUpperCase()}\nFIT: ${r.blocked.length?'BLOCKED':r.score+'/100'}\nMATCHES: ${r.reasons.join('; ')||'None'}\nBLOCKERS: ${r.blocked.join('; ')||'None'}\nMINIMUM PROTOTYPE: ${r.profile.prototype}`),
  plainList('REQUIRED SAFEGUARDS',sharedSafeguards),plainList('NEXT DECISIONS',[...new Set(nextSteps)]),`TESTING PLAN\n${testPlan}`
 ].join('\n\n');
 markComplete('product-decision');
});
byId('copy-product-result')?.addEventListener('click',()=>copyText(productPlain||'Complete the Adaptive Product-Type Decision first.'));
byId('download-product-result')?.addEventListener('click',()=>downloadText('adaptive-product-type-decision.txt',productPlain||'Adaptive Product-Type Decision not completed.'));

// -----------------------------------------------------------------------------
// 7. Build plan
// -----------------------------------------------------------------------------
let buildPlain='';
byId('generate-build-plan')?.addEventListener('click',()=>{buildPlain=`PROTOTYPE BUILD PLAN\nTEST QUESTION: ${text('build-question')||'[not entered]'}\nFORMAT: ${text('build-format')||'[not entered]'}\nNOT BUILDING YET: ${text('build-not-building')||'[not entered]'}\nMAIN RISK OR EDGE CASE: ${text('build-risk')||'[not entered]'}\nACCESSIBILITY AND LOW-TECH ALTERNATIVE: ${text('build-access')||'[not entered]'}`;byId('build-plan-output').textContent=buildPlain;markComplete('build-guide')});
byId('copy-build-plan')?.addEventListener('click',()=>copyText(buildPlain||'Generate the build plan first.'));
byId('download-build-plan')?.addEventListener('click',()=>downloadText('prototype-build-plan.txt',buildPlain||'Build plan not completed.'));

// -----------------------------------------------------------------------------
// 8. Guided Prompt Builder
// -----------------------------------------------------------------------------
const promptQuestions=[
 {key:'mode',category:'Role',question:'What role should the conversational tool play?',why:'The role determines the type of interaction. A practice partner behaves differently from a debate partner, reflection coach, or error-analysis coach.',how:'Choose the narrowest mode that matches the selected learner action and strategy. Do not choose a general “tutor” role.',example:'Question-decomposition coach',type:'select',options:['Motivational interviewer','Practice partner','Reflection coach','Question-decomposition coach','Error-analysis coach','Debate partner','Retrieval-practice guide','Reading-comprehension guide','Writing-outline partner','Scenario simulator','Feedback generator','Learning-progress mapper']},
 {key:'learner',category:'Learner',question:'Who is the intended learner?',why:'The tool needs an appropriate reading level, context, prior experience, and access plan. Personal identifiers are not needed.',how:'Describe a grade range or learning context, relevant prior knowledge, and access needs without entering a name, ID, grade record, disability record, or other sensitive information.',example:'Ninth-grade biology students who can identify graph axes and need plain-language directions and keyboard access.',type:'textarea'},
 {key:'client',category:'Need',question:'What authentic teacher-client need should the tool address?',why:'A clear client need keeps the prompt connected to teaching and learning rather than a platform feature.',how:'Summarize the teacher-client’s recent example, what students already do, where they get stuck, and what a short support should make possible.',example:'Students can identify the variables on a graph but often misread the scale between labeled values.',type:'textarea'},
 {key:'component',category:'Scope',question:'What is the exact learning component?',why:'A conversational tool becomes inconsistent when it tries to address an entire subject or several unrelated skills.',how:'Name one necessary and observable knowledge component, decision, procedure, representation, or self-regulation action.',example:'Determine the numerical interval represented between labeled points on a graph axis.',type:'textarea'},
 {key:'knows',category:'Foundation',question:'What can the learner already do?',why:'The tool should build from existing knowledge instead of reteaching everything or assuming no competence.',how:'Name a specific prerequisite or partial success that has been observed.',example:'The learner can identify the x- and y-axes and read the labeled endpoint values.',type:'textarea'},
 {key:'stuck',category:'Bottleneck',question:'Where does the learner’s process break down?',why:'The prompt needs the first meaningful breakdown so it can respond to the cause rather than the final wrong answer.',how:'Describe what the learner says or does, the repeated error, and the point immediately before the difficulty.',example:'The learner subtracts the endpoint values but divides by the number of labeled points instead of the number of spaces.',type:'textarea'},
 {key:'principle',category:'Evidence',question:'Which verified learning-science principle should guide the interaction?',why:'The prompt should implement a defensible learning strategy rather than a familiar claim or AI suggestion.',how:'State the principle, its relevant limit or condition, and the source the team verified in the Evidence Record.',example:'Worked examples can reduce unnecessary cognitive load for novices, but the steps should fade as accuracy improves.',type:'textarea'},
 {key:'action',category:'Learner action',question:'What mental action should the learner practice?',why:'The tool should be designed around what the learner must do—not what the AI will generate.',how:'Choose the action that would provide the strongest evidence of learning.',example:'Explain or elaborate',type:'select',options:['Recall','Explain or elaborate','Compare or discriminate','Sequence or plan','Apply or transfer','Monitor and reflect','Inspect and correct an error','Interpret a representation']},
 {key:'sequence',category:'Interaction',question:'What interaction sequence should the tool follow?',why:'A sequence prevents an open-ended chatbot from giving inconsistent help or jumping directly to an answer.',how:'Describe the opening question, learner attempt, feedback or hint cycle, retry, reflection, and stopping point.',example:'Ask the learner to read the labels, request an interval estimate, ask for the number of spaces, give one hint if needed, require a retry, then ask for a consistency check.',type:'textarea'},
 {key:'struggle',category:'Productive struggle',question:'What should the learner attempt before receiving help?',why:'Defining productive struggle protects learner agency and prevents answer substitution.',how:'Name the step, explanation, comparison, prediction, or strategy choice that must occur first.',example:'The learner must estimate the interval and explain how the number of spaces affects the calculation.',type:'textarea'},
 {key:'feedback2',category:'Feedback',question:'What feedback should occur, and when?',why:'Feedback changes learning only when it responds to the learner’s attempt and points toward an actionable next step.',how:'State the timing, level, and sequence. Distinguish an open question, focused cue, partial example, and full model.',example:'After an explanation, identify one accurate idea and one gap; give a focused cue before a partial example.',type:'textarea'},
 {key:'reflection-prompt',category:'Reflection',question:'What reflection should the learner complete?',why:'Reflection helps the learner name the strategy, monitor understanding, and plan a next step.',how:'Ask for evidence, a strategy explanation, confidence with a reason, or a next action—not “Did you like it?”',example:'What did you check to decide that the interval is consistent, and what will you do first on the next graph?',type:'textarea'},
 {key:'motivation',category:'Engagement',question:'How will the interaction support motivation or persistence?',why:'A learning tool should support relevance, choice, progress, belonging, or return after error without using praise as a substitute for instruction.',how:'Choose one or two concrete design behaviors connected to the learner need.',example:'Let the learner choose between two graph contexts and show progress after each independent success.',type:'textarea'},
 {key:'access',category:'Accessibility',question:'What accessibility and participation requirements must the prompt follow?',why:'Access requirements affect language, response mode, pacing, representation, input, and alternatives throughout the interaction.',how:'Consider reading, language, visual, hearing, motor, cognitive-load, device, and low-tech needs. State both requirements and alternatives.',example:'Use short sentences, describe visual information in text, accept typed or spoken explanations, and provide a printable version.',type:'textarea'},
 {key:'fade2',category:'Fading',question:'How should support decrease as the learner improves?',why:'A support that never fades can create dependence and hide whether the learner can perform independently.',how:'Define the evidence or number of successful attempts that triggers fewer hints, longer wait time, missing steps, or strategy choice.',example:'After two accurate guided attempts, remove the interval formula and ask the learner to select the next step.',type:'textarea'},
 {key:'avoid',category:'Limits',question:'How will the tool avoid simply giving answers?',why:'Explicit limits are needed because conversational AI often completes the task when asked directly.',how:'State what the tool must refuse or redirect, what the learner must provide first, and when a teacher or trusted adult is needed.',example:'Do not provide the interval until the learner has attempted the calculation and explained the number of spaces; redirect answer requests to a focused question.',type:'textarea'},
 {key:'measure',category:'Evidence',question:'How will the team measure whether the tool helps?',why:'A prompt is not successful because it is fluent or enjoyable. The team needs observable learning, use, and revision evidence.',how:'Name the target behavior, comparison task, amount of support, and evidence to record during testing.',example:'On a new graph, record whether the learner calculates the interval accurately, explains the spaces, and completes the task with fewer hints.',type:'textarea'}
];
const promptAnswers={};let promptIndex=0,promptPlain='';
function questionInput(q){
 if(q.type==='select')return `<label for="prompt-current-answer">Your answer</label><select id="prompt-current-answer">${q.options.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('')}</select>`;
 return `<label for="prompt-current-answer">Your answer</label><textarea id="prompt-current-answer" placeholder="Write a specific, evidence-based response."></textarea>`;
}
function renderPromptQuestion(){
 const q=promptQuestions[promptIndex];
 byId('prompt-progress-label').textContent=`Question ${promptIndex+1} of ${promptQuestions.length}`;
 const completed=Object.values(promptAnswers).filter(v=>String(v).trim()).length;
 byId('prompt-progress').value=completed;byId('prompt-progress-percent').textContent=`${Math.round(completed/promptQuestions.length*100)}% complete`;
 byId('prompt-question-category').textContent=q.category;byId('prompt-question-text').textContent=q.question;byId('prompt-question-why').textContent=q.why;byId('prompt-question-how').textContent=q.how;byId('prompt-question-example').textContent=q.example;
 byId('prompt-answer-host').innerHTML=questionInput(q);
 const input=byId('prompt-current-answer');input.value=promptAnswers[q.key]||'';input.focus();
 byId('prompt-back').disabled=promptIndex===0;byId('prompt-next').textContent=promptIndex===promptQuestions.length-1?'Save and generate prompt':'Save and continue →';
 byId('prompt-wizard-status').textContent='';renderPromptAnswerProgress();renderPrompt();
}
function savePromptAnswer(){const q=promptQuestions[promptIndex];const value=byId('prompt-current-answer')?.value?.trim()||'';if(!value){byId('prompt-wizard-status').textContent='Enter a response before continuing. Use the example as a guide, but adapt it to your project.';return false;}promptAnswers[q.key]=value;return true;}
function renderPromptAnswerProgress(){byId('prompt-answer-progress').innerHTML=promptQuestions.map((q,i)=>`<button class="tag answer-progress-tag ${promptAnswers[q.key]?'is-complete':''}" data-prompt-jump="${i}" type="button">${i+1}. ${escapeHtml(q.category)}</button>`).join('');document.querySelectorAll('[data-prompt-jump]').forEach(b=>b.addEventListener('click',()=>{promptIndex=Number(b.dataset.promptJump);renderPromptQuestion()}));}
function answer(key,fallback){return promptAnswers[key]||fallback}
function buildPrompt(){return `ROLE AND MODE\nAct as a ${answer('mode','[Select a focused learning-design role.]')}.

INTENDED LEARNER\n${answer('learner','[Describe the learner without identifying information.]')}

TEACHER-CLIENT NEED\n${answer('client','[Describe the authentic need.]')}

EXACT LEARNING COMPONENT\n${answer('component','[Name the smallest meaningful component.]')}

WHAT THE LEARNER ALREADY KNOWS\n${answer('knows','[Describe an observed prerequisite or partial success.]')}

WHERE THE PROCESS BREAKS DOWN\n${answer('stuck','[Describe the specific bottleneck and evidence.]')}

LEARNING-SCIENCE PRINCIPLE\n${answer('principle','[State a verified principle, condition, and limit.]')}

DESIRED LEARNER ACTION\n${answer('action','[Recall, explain, compare, apply, monitor, or revise.]')}

INTERACTION SEQUENCE\n${answer('sequence','[Define the opening, attempt, feedback, retry, reflection, and stopping point.]')}

PRODUCTIVE STRUGGLE TO PRESERVE\n${answer('struggle','[State what the learner must attempt before help.]')}

FEEDBACK\n${answer('feedback2','[Define type, timing, level, and retry.]')}

REFLECTION\n${answer('reflection-prompt','[Prompt understanding, strategy, evidence, and next step.]')}

MOTIVATION AND PERSISTENCE\n${answer('motivation','[Define relevance, choice, progress, belonging, or return after error.]')}

ACCESSIBILITY AND PARTICIPATION\n${answer('access','[Define language, sensory, motor, cognitive-load, device, and low-tech requirements.]')}

FADING\n${answer('fade2','[Define how and when support will decrease.]')}

AVOID ANSWER SUBSTITUTION AND DEFINE LIMITS\n${answer('avoid','[State what the tool must not complete and when to involve a trusted adult.]')}

MEASURE EFFECTIVENESS\n${answer('measure','[Define the target behavior, comparison task, support level, and evidence.]')}

REQUIRED BEHAVIOR
- Ask before telling and require an attempt.
- Ask the learner to show and explain thinking.
- Follow the defined interaction sequence and stay within the exact component.
- Use the defined feedback hierarchy rather than immediate answers.
- Prompt a retry and then reflection.
- Fade support according to the stated evidence rule.
- Preserve learner agency and productive struggle.
- Do not claim that a learner has a fixed visual, auditory, or kinesthetic learning style.
- Do not request unnecessary personal or sensitive information.
- State uncertainty, encourage verification, and do not invent sources.
- Use accessible language and response options.
- Recommend a teacher or trusted adult when the request exceeds the tool’s role.`}
function renderPrompt(){promptPlain=buildPrompt();byId('prompt-output').textContent=promptPlain;}
function renderPromptReview(){byId('prompt-review-list').innerHTML=promptQuestions.map((q,i)=>`<article class="answer-review-card"><div><span class="audience-label">${escapeHtml(q.category)}</span><h4>${escapeHtml(q.question)}</h4><p>${escapeHtml(promptAnswers[q.key]||'[Not answered]')}</p></div><button class="button secondary small" data-edit-prompt="${i}" type="button">Edit</button></article>`).join('');document.querySelectorAll('[data-edit-prompt]').forEach(b=>b.addEventListener('click',()=>{promptIndex=Number(b.dataset.editPrompt);byId('prompt-review-panel').hidden=true;renderPromptQuestion()}));}
byId('prompt-wizard-form')?.addEventListener('submit',e=>{e.preventDefault();if(!savePromptAnswer())return;if(promptIndex<promptQuestions.length-1){promptIndex++;renderPromptQuestion()}else{renderPrompt();renderPromptReview();byId('prompt-review-panel').hidden=false;markComplete('prompt');byId('prompt-status').textContent='Prompt generated. Review every answer before testing it in an approved platform.';}});
byId('prompt-back')?.addEventListener('click',()=>{const current=byId('prompt-current-answer')?.value?.trim();if(current)promptAnswers[promptQuestions[promptIndex].key]=current;if(promptIndex>0)promptIndex--;renderPromptQuestion()});
byId('prompt-review')?.addEventListener('click',()=>{renderPromptReview();byId('prompt-review-panel').hidden=false;});
byId('prompt-close-review')?.addEventListener('click',()=>byId('prompt-review-panel').hidden=true);
byId('prompt-restart')?.addEventListener('click',()=>{if(!confirm('Clear all Prompt Builder answers and start again?'))return;Object.keys(promptAnswers).forEach(k=>delete promptAnswers[k]);promptIndex=0;byId('prompt-review-panel').hidden=true;renderPromptQuestion();});
byId('prompt-prefill')?.addEventListener('click',()=>{
 const found=[];
 const put=(key,value)=>{if(value&&!promptAnswers[key]){promptAnswers[key]=value;found.push(key)}};
 put('learner',selectedLabel('problem-learners'));
 put('client',text('problem-statement')||text('goal')||text('problem-description'));
 put('component',text('bottleneck')||text('skill'));
 put('knows',text('know')||text('prereq'));
 put('stuck',[text('bottleneck'),text('errors')].filter(Boolean).join(' — '));
 if(evidence.length)put('principle',`${evidence[0][0]} Source: ${evidence[0][1]}. Design implication: ${evidence[0][4]}`);
 put('action',selectedLabel('mental-action'));
 put('feedback2',[selectedLabel('feedback-type'),selectedLabel('feedback-timing')].filter(Boolean).join('; '));
 put('fade2',[selectedLabel('fade-method'),text('fade-details')].filter(Boolean).join('; '));
 put('measure',text('learned'));
 const accessParts=[];checkedValues('strategy-constraint').forEach(x=>accessParts.push(x));if(text('connectivity'))accessParts.push(selectedLabel('connectivity'));if(radioValue('low-tech'))accessParts.push(`Low-tech alternative: ${radioValue('low-tech')}`);put('access',accessParts.join('; '));
 const strategyToMode={retrieval:'Retrieval-practice guide',elaboration:'Practice partner',worked:'Practice partner',feedback:'Error-analysis coach',chunking:'Question-decomposition coach',metacognition:'Reflection coach',comparison:'Debate partner',representation:'Reading-comprehension guide',transfer:'Scenario simulator',reading:'Reading-comprehension guide',motivation:'Motivational interviewer',collaboration:'Debate partner'};
 if(matcherPlain){const topName=Object.keys(strategies).find(k=>matcherPlain.includes(strategies[k].name));if(topName)put('mode',strategyToMode[topName]);}
 renderPromptQuestion();byId('prompt-wizard-status').textContent=found.length?`Prefilled ${found.length} answers from earlier tools. Review each one before continuing.`:'No completed earlier-tool answers were available to prefill.';
});
byId('copy-prompt')?.addEventListener('click',()=>{copyText(buildPrompt(),'prompt-status');markComplete('prompt')});
byId('download-prompt')?.addEventListener('click',()=>{downloadText('guided-learning-design-prompt.txt',buildPrompt());markComplete('prompt')});
renderPromptQuestion();

// -----------------------------------------------------------------------------
// 9. Testing log and project packet
// -----------------------------------------------------------------------------
const tests=[];
function testsPlain(){return tests.length?tests.map((x,i)=>`TEST ${i+1}\nSTAGE: ${x[0]}\nQUESTION: ${x[1]}\nUSER TRIED: ${x[2]}\nHESITATED/MISUNDERSTOOD: ${x[3]}\nUSED/IGNORED: ${x[4]}\nSAID/DID: ${x[5]}\nLEARNING CHANGE: ${x[6]}\nREVISION: ${x[7]}`).join('\n\n'):'No testing records entered.'}
byId('add-test-record')?.addEventListener('click',()=>{const ids=['test-stage','test-question','user-tried','test-hesitation','test-used','test-said-did','learning-change','test-revision'];const vals=ids.map(text);if(!vals[1]){alert('Enter the test question.');return;}tests.push(vals);byId('test-record-list').innerHTML=tests.map((x,i)=>`<article class="card"><span class="audience-label">${escapeHtml(x[0])}</span><h3>Test ${i+1}: ${escapeHtml(x[1])}</h3><p><strong>User tried:</strong> ${escapeHtml(x[2])}</p><p><strong>Hesitation or misunderstanding:</strong> ${escapeHtml(x[3])}</p><p><strong>Used successfully or ignored:</strong> ${escapeHtml(x[4])}</p><p><strong>Said and did:</strong> ${escapeHtml(x[5])}</p><p><strong>Learning behavior:</strong> ${escapeHtml(x[6])}</p><p><strong>Revision:</strong> ${escapeHtml(x[7])}</p></article>`).join('');ids.slice(1).forEach(id=>byId(id).value='');markComplete('testing-log')});
byId('download-test-records')?.addEventListener('click',()=>downloadText('testing-revision-log.txt',testsPlain()));
byId('copy-test-records')?.addEventListener('click',()=>copyText(testsPlain()));
function packet(){return ['STUDENT AI LEARNING INNOVATION LEAGUE — PROJECT PACKET','Generated from the Project Studio. Work is not saved automatically.',sizeOutput||'ADAPTIVE PROBLEM SIZE CHECK\nNot completed.',taskText(),evidencePlain(),progressionText(),matcherPlain||'ADAPTIVE STRATEGY MATCHER\nNot completed.',productPlain||'ADAPTIVE PRODUCT-TYPE DECISION\nNot completed.',buildPlain||'PROTOTYPE BUILD PLAN\nNot completed.',buildPrompt(),testsPlain()].join('\n\n==============================\n\n')}
function downloadPacket(){downloadText('learning-league-project-packet.txt',packet())}
byId('download-project-packet')?.addEventListener('click',downloadPacket);document.querySelectorAll('[data-download-packet]').forEach(b=>b.addEventListener('click',downloadPacket));byId('print-studio')?.addEventListener('click',()=>window.print());
})();
