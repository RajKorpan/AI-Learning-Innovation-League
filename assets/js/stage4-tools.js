(()=>{
'use strict';
const STORE='leagueStageToolsV2', JOURNEY='leagueJourneyStateV1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){return {}}};
const save=(k,v)=>{const s=load();s[k]=v;try{localStorage.setItem(STORE,JSON.stringify(s))}catch(e){}return v};
const journey=()=>{try{return JSON.parse(localStorage.getItem(JOURNEY)||'{}')}catch(e){return {}}};
const checked=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
// Migrate an older four-path prototype choice into the current three-path model.
try{const j=journey();if(j.buildPath==='d'){j.buildPath='c';localStorage.setItem(JOURNEY,JSON.stringify(j));}const s=load();if(s.buildWizard?.path==='d'){s.buildWizard.path='c';localStorage.setItem(STORE,JSON.stringify(s));}}catch(e){}
async function copy(text,status){try{await navigator.clipboard.writeText(text);if(status)status.textContent='Copied. Open the AI tool your facilitator or school permits.';}catch(e){if(status)status.textContent='Copy was blocked. Select the prompt text and copy it manually.';}}

// Design check — one decision at a time. A "not yet" answer stops the sequence until revised.
const designCore=[
 {k:'real',q:'Does this design respond to a real learning challenge you listened to or experienced directly?',why:'A useful tool starts with a real learning need, not a feature idea.',fix:'Return to Empathize and make sure the challenge comes from an interview, observation, or your own documented learning experience.'},
 {k:'focused',q:'Is the tool focused on one manageable learning challenge?',why:'Small is good. A focused prototype makes it possible to learn what actually helped.',fix:'Shrink the design to one learning breakdown or learner action before adding more features.'},
 {k:'goal',q:'Can you say what the learner should be able to do and how you will know?',why:'Without a learning target, testing becomes “Did they like it?” instead of “Did learning move?”',fix:'Return to your learning objective and observable evidence of success.'},
 {k:'thinking',q:'Does the learner have to do important thinking?',why:'The learner should retrieve, explain, compare, decide, make, monitor, or reflect—not only receive answers.',fix:'Change the interaction so the learner makes an attempt before the tool supplies substantial help.'},
 {k:'strategy',q:'Can you explain the learning strategy built into the design?',why:'The form of the tool should connect to how the learner is expected to practice or think.',fix:'Return to Strategy Explorer and identify what the learner is actually practicing.'},
 {k:'access',q:'Can the learner understand the directions and participate in the interaction?',why:'A format barrier can hide what the learner actually knows or can do.',fix:'Revise directions, pacing, representation, input method, or provide an equivalent alternative.'},
 {k:'testable',q:'Can you test one important claim with this small version?',why:'A prototype should answer a question. If it is too large to test, it is too large to build first.',fix:'Choose one uncertainty and make the smallest version that can answer it.'}
];
const designAI=[
 {k:'purpose',q:'Does AI add something useful to this learning experience?',why:'AI should have a reason to be present beyond making the project look technical.',fix:'Name the capability AI adds. If you cannot, use the simpler learning-experience path.'},
 {k:'reusable',q:'Is this more than a one-time AI answer?',why:'A Learning League AI tool should support a designed, repeatable learning process.',fix:'Design a repeatable interaction: what the learner does, how AI responds, and what happens next.'},
 {k:'learner',q:'Does the learner still do the important thinking instead of AI doing it for them?',why:'AI should support learning rather than replace the thinking that produces learning.',fix:'Require a learner attempt, explanation, comparison, or decision before AI gives substantial help.'},
 {k:'feedback',q:'If AI gives feedback, does it respond to a learner attempt instead of simply giving the answer?',why:'Feedback is most useful when it helps the learner interpret and improve an attempt.',fix:'Make AI wait for an attempt, respond specifically, and invite another try.'},
 {k:'verify',q:'Do you have a way to check important AI-generated content or feedback?',why:'Generative AI can be confidently wrong.',fix:'Add a verification plan, limit high-stakes claims, and tell the tool how to handle uncertainty.'}
];
let designIndex=0;
function designItems(){const path=journey().buildPath||load().productDecision?.path||'';return path==='b'||path==='c'?[...designCore,...designAI]:designCore;}
function renderDesignCheck(){const box=$('design-check-question');if(!box)return;const items=designItems();designIndex=Math.max(0,Math.min(designIndex,items.length-1));const x=items[designIndex];$('design-check-progress').max=items.length;$('design-check-progress').value=designIndex+1;$('design-check-progress-label').textContent=`Check ${designIndex+1} of ${items.length}`;box.innerHTML=`<span class="wizard-phase-label">Design gate</span><h3>${esc(x.q)}</h3><div class="wizard-guidance"><p><strong>Why this matters:</strong> ${esc(x.why)}</p></div>`;$('design-check-result').innerHTML='';}
document.addEventListener('click',e=>{const b=e.target.closest('[data-design-answer]');if(!b||!$('design-check-question'))return;const items=designItems(),x=items[designIndex],answer=b.dataset.designAnswer;if(answer!=='yes'){$('design-check-result').innerHTML=`<div class="warning-box"><strong>Pause here before continuing.</strong><p>${esc(answer==='unsure'?'It is okay not to know yet. Talk it through, inspect the prototype, or ask your facilitator.':'This part of the design needs another pass.')}</p><p><strong>What to do:</strong> ${esc(x.fix)}</p><p>When you have revised or checked this decision, answer this same question again.</p></div>`;return;}const saved=load().designCheckSteps||{};saved[x.k]='yes';save('designCheckSteps',saved);if(designIndex<items.length-1){designIndex++;renderDesignCheck();return;}save('designCheck',{answers:saved,aiUsed:items.length>designCore.length,ready:true});const path=journey().buildPath||load().productDecision?.path||'';const next=path==='b'?'<a class="button primary small" href="#prompt-builder">Next: Design the AI learning tool →</a>':'<a class="button primary small" href="#advisor-check">Next: Review the prototype with your facilitator →</a>';$('design-check-result').innerHTML=`<div class="result-summary fit-high"><div><span class="result-kicker">Design check complete</span><h3>Ready for a small test</h3><p>You have thought through each required design decision. Testing may still show that one of your best guesses is wrong—and that is useful.</p></div></div><div class="tool-actions">${next}</div>`;});
window.addEventListener('league:build-path-changed',()=>{designIndex=0;renderDesignCheck();});
renderDesignCheck();

// Curated AI examples
const examples={
 word:`Act as a question-decomposition coach for a learner working on math word problems. Do not solve the problem. Ask one short question at a time. First ask the learner to name the unknown, then the givens, then the relationships. Require the learner to state a plan before suggesting an operation. If the learner is stuck, give one focused cue rather than the answer. After the learner states a plan, ask them to explain why it fits.`,
 retrieval:`Act as a retrieval-practice coach for a learner studying biology vocabulary. Ask for one term or example from memory before showing any definition. After the attempt, identify what was accurate and give a short correction if needed. Ask the learner to try again from a different cue. Keep rounds short and do not turn the interaction into rereading. End by asking which terms need another later attempt.`,
 explain:`Act as an explain-and-compare coach. Present two short contrasting examples related to the target concept. Ask the learner which difference matters and why before giving feedback. If the learner gives a surface feature, ask one follow-up that points toward the underlying relationship. Do not explain the concept until the learner has made an attempt. End by asking the learner to create or identify a new contrasting case.`
};
document.querySelectorAll('[data-ai-prompt-preview]').forEach(pre=>pre.textContent=examples[pre.dataset.aiPromptPreview]||'');
document.querySelectorAll('[data-copy-ai-example]').forEach(btn=>btn.addEventListener('click',()=>copy(examples[btn.dataset.copyAiExample]||'',btn.closest('.ai-example-card')?.querySelector('.copy-status')||null)));
$('remix-ai-example')?.addEventListener('click',()=>{
 const key=$('ai-example-select')?.value||'word', change=$('ai-example-change')?.value||'shorter';
 const mods={shorter:'\n\nMODIFICATION: Keep every AI response to no more than 2–3 short sentences unless the learner asks for more.',younger:'\n\nMODIFICATION: Use simpler vocabulary and shorter sentences appropriate for a younger learner. Keep the learning goal the same.',reflection:'\n\nMODIFICATION: After each practice round, ask one short reflection question: What did you notice about how you decided?',two:'\n\nMODIFICATION: Use only two practice rounds, then end with a learner summary and next-step question.'};
 const text=(examples[key]||'')+(mods[change]||'');
 const out=$('ai-remix-result');out.innerHTML=`<h4>Modified prompt</h4><pre>${esc(text)}</pre><button class="button secondary small" id="copy-ai-remix" type="button">Copy modified prompt</button><p class="status" id="ai-remix-status"></p>`;$('copy-ai-remix')?.addEventListener('click',()=>copy(text,$('ai-remix-status')));
});


// Show one curated AI learning-tool example at a time.
document.querySelectorAll('[data-ai-example-choice]').forEach(btn=>btn.addEventListener('click',()=>{
  const key=btn.dataset.aiExampleChoice;
  document.querySelectorAll('[data-ai-example-choice]').forEach(b=>b.classList.toggle('is-selected',b===btn));
  document.querySelectorAll('.ai-example-card').forEach(card=>{
    const selected=card.dataset.aiExample===key;
    card.hidden=!selected;
    card.classList.toggle('is-selected',selected);
  });
  const select=$('ai-example-select'); if(select) select.value=key;
}));

// Empathy interview practice prompt — structured and intentionally brief.
$('make-empathy-practice')?.addEventListener('click',()=>{
 const topicMap={math:'mathematics',science:'science',computing:'computing / computer science',engineering:'engineering / design',data:'data / quantitative reasoning'};
 const levelMap={middle:'a middle-school learner',earlyhigh:'an early high-school learner',high:'a high-school learner'};
 const difficultyMap={
  remember:'the learner can follow along during practice but has trouble remembering later',
  explain:'the learner can carry out a familiar step but has trouble explaining why it works',
  apply:'the learner can succeed on familiar examples but has trouble using the idea in a new situation',
  steps:'the learner can do some parts but loses track of the sequence or next decision',
  errors:'the learner makes mistakes but often does not notice when the reasoning goes off track',
  representation:'the learner has trouble connecting graphs, symbols, diagrams, tables, equations, or words'
 };
 const area=topicMap[$('practice-topic')?.value]||'a STEM topic';
 const level=levelMap[$('practice-level')?.value]||'a secondary learner';
 const difficulty=difficultyMap[$('practice-difficulty')?.value]||'a realistic learning difficulty';
 const specific=($('practice-specific')?.value||'').trim();
 const subject=specific?`${specific} (${area})`:area;
 const text=`Pretend you are ${level} working on ${subject}. Privately use this situation to guide your answers: ${difficulty}. Do not announce the difficulty or label yourself. Answer my questions naturally through specific examples. If I ask a leading question, do not simply agree with it. Keep this practice interview short—about 5 questions. After I say “end interview,” step out of role and tell me: (1) one question that was open and useful, (2) one question that was leading or solution-focused, and (3) one neutral follow-up I could try. This is practice only; do not claim the simulation represents a real learner.`;
 const out=$('empathy-practice-result');out.innerHTML=`<div class="result-summary fit-high"><div><span class="result-kicker">3-minute practice prompt</span><h3>Practice asking—not figuring out the answer</h3><p>Use this only if a rehearsal would help. Then interview a real person.</p></div></div><pre>${esc(text)}</pre><div class="tool-actions"><button class="button secondary small" id="copy-empathy-practice" type="button">Copy practice prompt</button></div><p class="status" id="empathy-practice-status"></p>`;$('copy-empathy-practice')?.addEventListener('click',()=>copy(text,$('empathy-practice-status')));
});

// Prompt history visual
function setHistory(step){const h=$('prompt-history');if(!h)return;const order=['first','draft1','test1','draft2','test2'];const idx=order.indexOf(step);[...h.querySelectorAll('span')].forEach((x,i)=>{x.classList.toggle('is-done',i<idx);x.classList.toggle('is-current',i===idx)});}
document.addEventListener('leaguePromptStep',e=>{setHistory(e.detail?.step||'first');});
$('save-prompt-test2')?.addEventListener('click',()=>{const improved=($('prompt-test2-improved')?.value||'').trim(),still=($('prompt-test2-still')?.value||'').trim(),next=($('prompt-test2-next')?.value||'').trim();if(!improved&&!still){$('prompt-test2-result').innerHTML='<div class="warning-box">Record what changed before saving the comparison.</div>';return}save('promptTest2',{improved,still,next});setHistory('test2');$('prompt-test2-result').innerHTML=`<div class="result-summary fit-high"><div><span class="result-kicker">Iteration history</span><h3>Draft 1 → Test 1 → Draft 2 → Test 2</h3><p>You now have evidence about how a design change affected the interaction.</p></div></div><p><strong>What improved:</strong> ${esc(improved||'[not recorded]')}</p><p><strong>What still needs work:</strong> ${esc(still||'[not recorded]')}</p><p><strong>Possible next change:</strong> ${esc(next||'No additional change identified yet.')}</p>`;});
const saved=load(); if(saved.promptTest2)setHistory('test2'); else if(saved.promptDraft2){setHistory('draft2');} else if(saved.promptDraft1)setHistory('test1'); else if(saved.firstPrompt)setHistory('first');
})();
